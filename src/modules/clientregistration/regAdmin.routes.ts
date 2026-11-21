import  type { FastifyInstance } from "fastify";
import { deleteLead, getFormData, MarkAsRead, type UserParams } from "./regform.controller.js";
import { verifyAdmin } from "../../middlewere/verifyAdmin.js";



export const ReqformAdmin = async(app:FastifyInstance):Promise<void>=>{

app.get("/get",{preHandler:verifyAdmin},getFormData)
app.patch<{Params:UserParams}>("/mark_as_read/:id",{preHandler:verifyAdmin},MarkAsRead)

app.delete<{Params:UserParams}>("/delete/:id",{preHandler:verifyAdmin},deleteLead)

}