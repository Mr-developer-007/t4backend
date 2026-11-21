import type { FastifyInstance } from "fastify";
import { adminRoutes } from "../modules/admin/admin.routes.js";
import { ClientRoutes, ClientRoutesAdmin } from "../modules/clients/clientAdmin.routes.js";
import { Reqform } from "../modules/clientregistration/reqform.routtes.js";
import { ReqformAdmin } from "../modules/clientregistration/regAdmin.routes.js";
import { CategoryRoutes } from "../modules/category/category.Routes.js";
import { ClientPackageRoute } from "../modules/packages/packageAgent.Routes.js";
import { agencyCategorRoute } from "../modules/category/category.agent.Routes.js";


export const  registerRoutes = async(app:FastifyInstance):Promise<void>=>{
    app.get(
    "/health",
    { schema: { tags: ["Health"], summary: "Server health" } },
    async () => ({ status: "ok" }),
  );


//     admin

await app.register(

  async(admin:FastifyInstance)=>{

await admin.register(adminRoutes,{prefix:"/auth"});
await admin.register(ClientRoutesAdmin,{prefix:"/client"})
await admin.register(ReqformAdmin,{prefix:"/formreg"})
await admin.register(CategoryRoutes,{prefix:"/category"})


  },{
    prefix:"/api/v1/admin"
  },)


//   agency

await app.register(

  async(agency:FastifyInstance)=>{

 await agency.register(Reqform,{prefix:"/register"})
await agency.register(ClientRoutes,{prefix:"/auth"})
await agency.register(ClientPackageRoute,{prefix:"/package"})
await agency.register(agencyCategorRoute,{prefix:"/category"})
  },{
    prefix:"/api/v1/agency"
  })



}



