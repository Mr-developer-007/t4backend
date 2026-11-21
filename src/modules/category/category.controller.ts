import type { FastifyReply, FastifyRequest } from "fastify";
import { DeleteImage, UploadImage } from "../../config/UploadImage.js";
import { MultipartFile } from "@fastify/multipart";
import { createSimpleSlug } from "../../config/slugcreate.js";
import Category from "./category.model.js";






export const createCategory= async(request:FastifyRequest,reply:FastifyReply)=>{

try {

    let category = "";
    let image = "";

  const parts = request.parts({
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
        fields: 2,
      },
    });

    for await (const part of parts) {
      if (part.type === "file") {
        if (part.fieldname !== "image") continue;

        const uploadedImage = await UploadImage({
          file: part as MultipartFile,
          allowedTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
          ],
          folder: "category",
        });

        image = uploadedImage.url;

      } else {
        if (part.fieldname === "category") {
          category = String(part.value).trim();
        }
      }
    }

    if(!image){
          return reply.status(401).send({success:false,message:"Image required"}) 
    }

 if(!category){
    DeleteImage(image);

    return reply.status(401).send({success:false,message:"category required"}) 
 }

 const slug = createSimpleSlug(category)


  const categoryCreated = await Category.create({name:category,slug,image})


 return reply.status(201).send({success:true,message:"done",category:categoryCreated}) 

  
} catch (error) {
    console.log(error)
   return reply.status(500).send({success:false,message:error}) 
}
}



export const getAllCategory = async(request:FastifyRequest,reply:FastifyReply)=>{
  try {
    
    const categories = await Category.find()
     return reply.status(200).send({success:true,categories})
  } catch (error) {
     return reply.status(500).send({success:false,message:error})
  }
}




export const editCateg =async(request:FastifyRequest<{Params:{id:string}}>,reply:FastifyReply)=>{
  try {
let category = ""
let newImage = ""

const {id} = request.params

const cat = await Category.findById(id)
if(!cat){
  return reply.status(200).send({success:false,message:"Category not found"})
}

  const parts = request.parts({
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
        fields: 2,
      },
    });


for await( const part of parts){
if (part.type === "file") {
        if (part.fieldname !== "image") continue;

        const uploadedImage = await UploadImage({
          file: part as MultipartFile,
          allowedTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
          ],
          folder: "category",
        });
      newImage = uploadedImage.url;}

      if (part.fieldname === "category") {
          category = String(part.value).trim();
        }
}


const slug = createSimpleSlug(category)


if(category.trim() !==cat.name){
cat.slug = slug
cat.name = category
}

if(newImage){
  await DeleteImage(cat.image)
  cat.image= newImage
}
await cat.save()

return reply.status(200).send({success:true,message:"Category updated",cat})
    
  } catch (error) {
    return reply.status(500).send({success:false,message:error})

  }
}


export const getCategory  =async(request:FastifyRequest,reply:FastifyReply)=>{
  try {


     const categories = await Category.find({status:"active"}).select("name")
     return reply.status(200).send({success:true,categories})
  } catch (error) {
    return reply.status(500).send({success:false,message:error})
  }
}