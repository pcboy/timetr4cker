import { Sequelize } from "sequelize-typescript";

let config = require("./config.json");

import { Project } from "../src/models/project";
import { Entry } from "../src/models/entry";
import * as path from "path";

const Umzug = require("umzug");

const db = new Sequelize({
  ...config[process.env.NODE_ENV || 'test'],
  define: {
    charset: "utf8",
    timestamps: true,
  },
  logging: console.log,
  models: [Project, Entry],
});

const umzug = new Umzug({
  migrations: {
    // indicates the folder containing the migration .js files
    path: path.join(__dirname, "../migrations"),
    // inject sequelize's QueryInterface in the migrations
    params: [db.getQueryInterface(), db.Sequelize],
  },
  // indicates that the migration data should be store in the database
  // itself through sequelize. The default configuration creates a table
  // named `SequelizeMeta`.
  storage: "sequelize",
  storageOptions: {
    sequelize: db,
  },
});

(async () => {
  // checks migrations and run them if they are not already applied
  await umzug.up();
  console.log("All migrations performed successfully");
})();

export default db;
