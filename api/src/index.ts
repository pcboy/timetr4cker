import { entryRoutes } from "./routes/entryRoutes";
import { projectRoutes } from "./routes/projectRoutes";

import fastify from "fastify";
import db from "../config/database";

const server = fastify({ logger: true });
db.isDefined;

server.register(require("fastify-cors"), {
  origin: "*",
  credentials: true,
});

/* server.register(require("fastify-cookie"), {
  secret: process.env.SECRET_KEY,
  parseOptions: {},
});
 */
entryRoutes.forEach((route, _) => server.route(route));
projectRoutes.forEach((route, _) => server.route(route));

server.listen(8080, "0.0.0.0", async (err: Error, address: string) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

export default server;
