
import Fastify ,{type FastifyInstance} from "fastify";
import { bootstrap } from "./bootstrap/index.js";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "node:path";

export const BuildApp = async (): Promise <FastifyInstance> => {
//   const app = Fastify({ logger: false });

const app = Fastify({logger:false});

app.register(multipart);

app.register(fastifyStatic, {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/",
});


await app.register(cookie);
await  bootstrap(app)
return app;

}


