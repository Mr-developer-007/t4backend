import { IAdmin } from "../modules/admin/admin.model.ts";
import { IClient } from "../modules/clients/clients.model.ts";

declare module "fastify" {
  interface FastifyRequest {
    admin:IAdmin
    client:IClient
  }
}

export {};