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
    method: <const>"DELETE",
    url: "/entries/:projectName/:entryId",
    handler: entriesController.deleteEntry,
  },
  {
    method: <const>"PUT",
    url: "/entries/:entryId",
    handler: entriesController.updateEntry,
  },
  {
    method: [<const>"POST", <const>"GET"],
    url: "/entries/:projectName/startTimer",
    handler: entriesController.startTimer,
  },
  {
    method: [<const>"POST", <const>"GET"],
    url: "/entries/:projectName/stopTimer",
    handler: entriesController.stopTimer,
  },
];
