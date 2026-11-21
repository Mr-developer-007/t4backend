import  type{ FastifyInstance } from "fastify";
import { createAdmin,getAdmin,ICreateAdminBody,type IVerifyOtp, loginAdmin, verifyLogin } from "./admin.controller.js";
import { createRateLimit } from "../../utils/rate-limit.js";
import { verifyAdmin } from "../../middlewere/verifyAdmin.js";





export const adminRoutes = async(app:FastifyInstance):Promise<void>=>{

    // app.post("/create",createAdmin); IVerifyOtp

    app.post<{ Body: ICreateAdminBody }>("/login", {preHandler: createRateLimit(app, {max: 5,windowSeconds: 60, keyPrefix: "admin-login",})},loginAdmin),

        app.post<{Body:IVerifyOtp}>("/verify",{preHandler:createRateLimit(app,{max:5,windowSeconds:60,keyPrefix:"admin-otp"})},verifyLogin)
   app.get("/veryfyadmin",{preHandler:verifyAdmin},getAdmin)


}