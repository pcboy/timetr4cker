import entriesController from "../controllers/entriesController";

export const entryRoutes = [
  {
    method: <const>"GET",
    url: "/entries",
    handler: entriesController.getEntries,
  },
  {
    method: <const>"POST",
    url: "/entries",
    handler: entriesController.createEntry,
  },
  {
    method: <const>"POST",
    url: "/entries/:projectId/startTimer",
    handler: entriesController.startTimer,
  },
  {
    method: <const>"POST",
    url: "/entries/:projectId/stopTimer",
    handler: entriesController.stopTimer,
  },
];
