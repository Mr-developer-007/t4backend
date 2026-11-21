import bcrypt from "bcryptjs";
import {  type FastifyReply, type FastifyRequest } from "fastify";
import Admin from "./admin.model.js";
import { randomInt } from "node:crypto";
import { emailQueue } from "../../queues/email.queue.js";
import jwt from "jsonwebtoken"
import { env } from "../../config/env.js";
import { request } from "node:http";



export interface ICreateAdminBody {
  email: string;
  password: string;
}

export interface IVerifyOtp {
   email: string;
  password: string;
  otp:string;
}


export const createAdmin= async(request: FastifyRequest<{ Body: ICreateAdminBody }>,reply: FastifyReply)=>{
    try {

        const {email,password} = request.body;

  if (!email?.trim() || !password?.trim()) {
      return reply.code(400).send({
        success: false,
        message: "Email and password are required",
      });
    }

 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return reply.code(400).send({
        success: false,
        message: "Please enter a valid email",
      });
    }


     if (password.length < 8) {
      return reply.code(400).send({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 12);


    await Admin.create({
      email: normalizedEmail,
      password: hashedPassword,
    });
        

return reply.code(200).send({success:true,message:"Admin created"})

    } catch (error) {
         return reply.code(500).send({
      success: false,
      message: "Internal server error",
    });
    }
}


export const loginAdmin = async(request: FastifyRequest<{ Body: ICreateAdminBody }>,reply: FastifyReply)=>{
  try {
    const {email,password}= request.body;
    

  if (!email?.trim() || !password?.trim()) {
      return reply.code(400).send({
        success: false,
        message: "Email and password are required",
      });
    }

 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return reply.code(400).send({
        success: false,
        message: "Please enter a valid email",
      });
    }


     if (password.length < 8) {
      return reply.code(400).send({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

  const admin = await Admin.findOne({email:normalizedEmail});
  
   if(!admin){
    return reply.code(404).send({
      success: false,
      message: "Incorrect Email or Password",
    })
   }

  const passwordCompair = await bcrypt.compare(password,admin.password);

  if(!passwordCompair){
    return reply.code(404).send({  success: false,
      message: "Incorrect Email or Password",})
  }

const otp = randomInt(100000, 1000000).toString();




await emailQueue.add("admin-login-otp",{  email: admin.email,otp,})


const redisKey = `admin-otp-send:${admin.email}`;

  await request.server.redis.set(redisKey,otp,"EX",3600)

return reply.status(200).send({success:true,message:"Otp sended"})



  } catch (error) {

   return reply.code(500).send({success:false,message:error}) 
  }
}


export const verifyLogin = async(request: FastifyRequest<{ Body: IVerifyOtp }>,reply: FastifyReply)=>{
try {
   const {email,password,otp}= request.body;
    

  if (!email?.trim() || !password?.trim()  ) {
      return reply.code(400).send({
        success: false,
        message: "Email and password are required",
      });
    }

    if(!otp.trim() || otp.length !=6){
 return reply.code(400).send({
        success: false,
        message: "Enter valide otp ",
      });
    }

 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return reply.code(400).send({
        success: false,
        message: "Please enter a valid email",
      });
    }


     if (password.length < 8) {
      return reply.code(400).send({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

  const admin = await Admin.findOne({email:normalizedEmail});
  
   if(!admin){
    return reply.code(404).send({
      success: false,
      message: "Incorrect Email or Password",
    })
   }

  const passwordCompair = await bcrypt.compare(password,admin.password);

  if(!passwordCompair){
    return reply.code(404).send({  success: false,
      message: "Incorrect Email or Password",})
  }

  const redisKey = `admin-otp-send:${admin.email}`;
  const verify = await request.server.redis.get(redisKey);
 
if(!verify){
  return reply.code(404).send({success:false,message:"Otp Expire"})
}

if(verify.toString() !==otp.toString()){ return reply.code(404).send({success:false,message:"Invalide Otp"})}



  await request.server.redis.del(redisKey)

      admin.count++
     await admin.save()
    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        email: admin.email,
        role: "admin",
        count:admin.count
      },
      env.jwtSecret,
      {
        expiresIn: "2d",
      }
    );

    return reply.setCookie("admin_token", token, {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "lax",
        path: "/",
      }).code(200)
      .send({
        success: true,
        message: "Login successful",
        admin: {
          id: admin._id.toString(),
          email: admin.email,
        },
      });



} catch (error) {
   request.log.error(
      { err: error },
      "Admin OTP verification failed"
    );

    return reply.code(500).send({
      success: false,
      message: "Internal server error",
    });
}
}


export const getAdmin = async(request:FastifyRequest,reply:FastifyReply)=>{



  return reply.send({
        success: true,
        admin: request.admin,
      });

}




