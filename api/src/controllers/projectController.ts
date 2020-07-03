import * as ProjectModel from "../models/project";

const createProject = async (req: any, reply: any) => {
  return ProjectModel.createProject("project1");
};

const getProjects = async (req: any, reply: any) => {
  return ProjectModel.getProjects();
};

const projectsController = {
  getProjects,
  createProject,
};

export default projectsController;
