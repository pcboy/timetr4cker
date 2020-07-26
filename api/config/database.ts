import { Sequelize } from "sequelize-typescript";

let config = require("./config.json");

import { Project } from "../src/models/project";
import { Entry } from "../src/models/entry";

const db = new Sequelize({
  ...config[process.env.NODE_ENV!],
  define: {
    charset: "utf8",
    timestamps: true,
  },
  logging: console.log,
  models: [Project, Entry],
});

/*
(async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
*/

export default db;
