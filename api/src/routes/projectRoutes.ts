import projectController from "../controllers/projectController";

export const projectRoutes = [
  {
    method: <const>"GET",
    url: "/projects",
    handler: projectController.getProjects,
  },
  {
    method: <const>"GET",
    url: "/projects/:projectName",
    handler: projectController.getProject,
  },
  {
    method: <const>"POST",
    url: "/projects/:projectId",
    handler: projectController.updateProject,
  },
];
