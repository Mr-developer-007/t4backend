import { FastifyReply, FastifyRequest } from "fastify";
import Client from "./clients.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";


export interface IClinetLogin {
    email:string;
    password:string;
}


export const loginClient = async(request:FastifyRequest<{Body:IClinetLogin}>,reply:FastifyReply)=>{
    try {
        const {email,password} = request.body
    if(!email || !password){
        return reply.status(401).send({success:false,message:"Email and password Required"})
    }

    const client = await Client.findOne({email}).select("+password")
    if(!client){
        return reply.status(401).send({success:false,message:"Incorrect Email or password "})
    }

    const verifypassword = await bcrypt.compare(password,client.password)

  if(!verifypassword){return reply.status(401).send({success:false,message:"Email and password Required"})}





   const token = jwt.sign(
       {
         adminId: client._id.toString(),
         email: client.email,
         role: "client",
       },
       env.jwtSecret,
       {
         expiresIn: "2d",
       }
     );


 return reply.setCookie("client_token", token, {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "lax",
        path: "/",
      }).code(200)
      .send({
        success: true,
        message: "Login successful"
      });


    } catch (error) {
        console.log(error)
       return  reply.status(500).send({success:false,message:error,error})
 
    }
}


export const getClient = async(request:FastifyRequest,reply:FastifyReply)=>{
    try {

        const client = request.client



        return reply.status(200).send({success:true,client})
        
    } catch (error) {
    return  reply.status(500).send({success:false,message:error})

    }
}