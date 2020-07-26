import { entryRoutes } from "./routes/entryRoutes";
import { projectRoutes } from "./routes/projectRoutes";

const server = require("fastify")({ logger: true });
require("../config/database");

server.register(require("fastify-cors"), {
  origin:
    process.env.NODE_ENV == "production" ? process.env.PUBLIC_URL : /localhost/,
  credentials: true,
});

server.register(require("fastify-cookie"), {
  secret: process.env.SECRET_KEY,
  parseOptions: {},
});

entryRoutes.forEach((route, _) => server.route(route));
projectRoutes.forEach((route, _) => server.route(route));

server.addHook("onRequest", async (request: any) => {
  let data = request.cookies?.token;
  if (data) {
  }

  return;
});

server.listen(8080, async (err: Error, address: string) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

export default server;
