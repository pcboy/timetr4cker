import projectController from "../controllers/projectController";

export const projectRoutes = [
  {
    method: <const>"GET",
    url: "/projects",
    handler: projectController.getProjects,
  },
  {
    method: <const>"POST",
    url: "/projects",
    handler: projectController.createProject,
  },
];
