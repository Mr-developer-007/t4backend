import { FastifyInstance } from "fastify";
import { createCategory, editCateg, getAllCategory } from "./category.controller.js";
import { verifyAdmin } from "../../middlewere/verifyAdmin.js";



export const CategoryRoutes = async(app:FastifyInstance)=>{


    app.post("/create",{preHandler:verifyAdmin},createCategory)
    app.get("/getall",{preHandler:verifyAdmin},getAllCategory)
    app.put<{Params:{id:string}}>("/update/:id",{preHandler:verifyAdmin},editCateg)

}
