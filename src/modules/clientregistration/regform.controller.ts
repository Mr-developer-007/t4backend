import { FastifyReply, FastifyRequest } from "fastify";
import Regform from "./clientreg.model.js";

export interface IReg {
    name:string;
    email:string;
    phone:string;
    businessName:string;
    description:string | null;

}


 export const  registerForm = async(request:FastifyRequest<{Body:IReg}>,reply:FastifyReply)=>{
    try {

        const {name,email,phone,businessName,description} = request.body

    if(!name || !email || !phone || !businessName || !description){
reply.status(401).send({success:false,message:"Please enter all required information."})
    }


    await Regform.create({name,email,phone,businessName,description});


return reply.status(201).send({
            success:true,
            message:"Registration request submitted successfully. Our team will contact you soon."
        })

        
    } catch (error) {
        return reply.status(500).send({
            success:false,
            message:error
        })
    }
 }






 export const getFormData = async(request:FastifyRequest,reply:FastifyReply)=>{
    try {
        
 const { page=1, limit=20,status } = request.query as {
    page: number;
    limit: number;
    status:string
  };

  const currentPage = Math.max(1, Number(page) || 1);
    const perPage = Math.min(100, Math.max(1, Number(limit) || 20));
     const filter: Record<string, any> = {};

    if (status == undefined || status == "false") {
      filter.status = false ;
    }else if(status=="true"){
      filter.status = "true" 
    }

    const skip = (currentPage - 1) * perPage;


     const [forms, total] = await Promise.all([
      Regform.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean(),

      Regform.countDocuments(filter),
    ]);

    return reply.status(200).send({
      success: true,
      message: "Form data fetched successfully",
      data: forms,
      pagination: {
        total,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(total / perPage),
        hasNextPage: currentPage * perPage < total,
        hasPrevPage: currentPage > 1,
      },
    });






    } catch (error) {
         return reply.status(500).send({
            success:false,
            message:error
        }) 
    }
 }

export interface UserParams {
  id: string; 
}


export const MarkAsRead= async(request:FastifyRequest<{Params:UserParams}>,reply:FastifyReply)=>{
try {
  const { id } = request.params;

 const lead = await Regform.findById(id);

 if(!lead){return reply.status(401).send({success:true,message:"Lead not found"})}

 lead.status = !lead.status
 await lead.save();

 return reply.status(200).send({success:true,message:"Lead mark as read"})

  
} catch (error) {
    return reply.status(500).send({
            success:false,
            message:error
        }) 
}
 }

 export const deleteLead = async(request:FastifyRequest<{Params:UserParams}>,reply:FastifyReply)=>{
try {
  
  const { id } = request.params;

 const lead = await Regform.findById(id);

 if(!lead){return reply.status(401).send({success:true,message:"Lead not found"})}

 await lead.deleteOne()
  return reply.status(200).send({success:true,message:"Lead Deleted"})


} catch (error) {
   return reply.status(500).send({
            success:false,
            message:error
        }) 
}
 }



