import { BuildApp } from "./app.js";
import { env } from "./config/env.js";



const app = await BuildApp();

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    app.close().then(() => process.exit(0), () => process.exit(1));
  });
}



try {
  await app.listen({ host: env.host, port: env.port });
  console.log(`http://${env.host}:${env.port}`)
} catch (error) {
  app.log.error(error);
  process.exit(1);
}