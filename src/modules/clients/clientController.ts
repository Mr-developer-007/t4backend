import  type { FastifyReply, FastifyRequest } from "fastify"
import Client from "./clients.model.js";
import { randomInt } from "node:crypto";
import { emailQueue } from "../../queues/email.queue.js";
import bcrypt from "bcryptjs";


export interface IClientAuth {
name:string;
email:string;
phone:string;
password:string;
businessName:string;
}
export interface IClientverify {
emailotp:string;
email:string;
phone:string;
phoneotp:string;

}


export const CreateClient=async(request:FastifyRequest<{Body:IClientAuth}>,reply:FastifyReply)=>{
    try {
        const {name,email,phone,password,businessName}= request.body
         
         if(!name || !email || !phone || !password || !businessName){
         return  reply.status(401).send({
            success:false,message:"Enter All required Felds"
           })
         }

         const alreadyExist = await Client.findOne({
  $or: [{ email }, { phone }],
});

if (alreadyExist && alreadyExist.status !== "pending") {
  return reply.status(409).send({
    success: false,
    message: "Email or mobile already exists",
  });



}

const otpforEmail =randomInt(100000, 1000000).toString();
const otpforPhone =randomInt(10000, 100000).toString();

await  emailQueue.add("client-email-verify",{  email: email,otp:otpforEmail,})
await  emailQueue.add("client-mobile-verify",{  number: email,otp:otpforPhone,})

const redisemailKey = `agency-email-otp-send:${email}`;
const redisphoneKey = `agency-phone-otp-send:${email}`;

  await request.server.redis.set(redisemailKey,otpforEmail,"EX",3600)
  await request.server.redis.set(redisphoneKey,otpforPhone,"EX",3600)


  if(alreadyExist?.status === "pending"){
return reply.status(200).send({success:true,message:"Otp sended"})
  }

const hashedPassword = await bcrypt.hash(password,10)


await Client.create({
    name,email,phone,password:hashedPassword,businessName
})

return reply.status(200).send({success:true,message:"Otp sended"})



         


    } catch (error) {
      return  reply.status(500).send({success:false,message:error})
    }
}



export const VerifyOtp =async(request:FastifyRequest<{Body:IClientverify}>,reply:FastifyReply)=>{
try {
    const {email,phone,emailotp,phoneotp} = request.body


if(!email || !phone || !emailotp || !phoneotp){
     return  reply.status(401).send({
            success:false,message:"Enter All required Felds"
           })
}



const redisemailKey = `agency-email-otp-send:${email}`;
const redisphoneKey = `agency-phone-otp-send:${email}`;

const emailGetOtp = await request.server.redis.get(redisemailKey)
const phoneGetOtp = await request.server.redis.get(redisphoneKey)
if(!emailGetOtp || !phoneGetOtp){
  return reply.status(404).send({success:false,message:"Otp expired"})
}




if(emailotp!==emailGetOtp || phoneotp!==phoneGetOtp){
  return reply.status(404).send({success:false,message:"Invalide Otp"})

}

const client = await Client.findOne({
  email,phone,status:"pending"
})

if(!client){
   return reply.status(404).send({success:false,message:"Client not Found "})
}

// const clientCount =await Client.countDocuments()
client.status="approved"
client.isEmailVerified=true
client.isPhoneVerified=true
// client.businessRegistrationNumber = Number(clientCount)


await client.save();

return reply.status(201).send({
  success:true,message:"Agency Created"
})


} catch (error) {
        return  reply.status(500).send({success:false,message:error})
  
}

}



export interface ClientQuery {
  page?: number;
  limit?:number;
  search?: string;
 status?:"pending" | "approved" | "rejected" | "blocked"
}


export const getAgency = async(request:FastifyRequest<{Querystring:ClientQuery}>,reply:FastifyReply)=>{
try {

    const { status, page=1, search, limit=20 } = request.query;

  const currentPage = Math.max(1, Number(page) || 1);
    const pageLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (currentPage - 1) * pageLimit;

const filter: Record<string, any> = {};


if(status){
  filter.status= status;
}


    if (search?.trim()) {
      const searchRegex = {
        $regex: search.trim(),
        $options: "i",
      };

      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { businessName: searchRegex },
        { state: searchRegex },
      ];
    
}





const [clients,totalClients] = await Promise.all([
await Client.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageLimit).select("name email businessName status logo").lean(),
await Client.countDocuments(filter)])



const totalPages = Math.ceil(totalClients/pageLimit)

return reply.status(200).send({
  success:true,
  clients,
  pagination:{
        page: currentPage,
        limit: pageLimit,
        totalClients,
        totalPages,
       hasNextPage: currentPage < totalPages,
       hasPrevPage: currentPage > 1,    
  }
})





  
} catch (error) {
          return  reply.status(500).send({success:false,message:error})

}
}


export interface IAgency{
id:string;
}

export const getAgencySingle = async (request:FastifyRequest<{Params:IAgency}>,reply:FastifyReply)=>{
  try {
    
const agencyId = request.params.id;


const agency = await Client.findById(agencyId)
if(!agency){
  return reply.status(401).send({success:false,message:"Client not found"})
}

return reply.status(200).send({success:false,client:agency})

  } catch (error) {
              return  reply.status(500).send({success:false,message:error})

  }
}


export interface IClientEdit {
name:string;
email:string;
phone:string;
password:string;
businessName:string;
}


export const editClient = async(request:FastifyRequest<{Params:IAgency,Body:IClientEdit}>,reply:FastifyReply)=>{
  try {
    


    
  } catch (error) {
return  reply.status(500).send({success:false,message:error})
  }
}

