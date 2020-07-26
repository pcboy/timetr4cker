import entriesController from "../controllers/entriesController";

export const entryRoutes = [
  {
    method: <const>"GET",
    url: "/entries/:projectName",
    handler: entriesController.getEntries,
  },
  {
    method: <const>"POST",
    url: "/entries/:projectName",
    handler: entriesController.createEntry,
  },
  {
    method: <const>"POST",
    url: "/entries/:projectName/startTimer",
    handler: entriesController.startTimer,
  },
  {
    method: <const>"POST",
    url: "/entries/:projectName/stopTimer",
    handler: entriesController.stopTimer,
  },
];
