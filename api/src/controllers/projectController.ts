import * as ProjectModel from "../models/project";
import { Project } from "../models/project";

const updateProject = async (req: any, reply: any) => {
  const { projectName } = req.params;

  const project = await Project.findOne({ where: { name: projectName } });

  const {
    budget,
    timeBudget,
    rate,
  }: { budget: string; timeBudget: string; rate: string } = req.body;

  return ProjectModel.updateProject(
    project.id,
    parseInt(budget),
    parseInt(timeBudget),
    parseInt(rate)
  );
};

const getProject = async (req: any, reply: any) => {
  const { projectName } = req.params;

  return Project.findOne({ where: { name: projectName } });
};

const getProjects = async (req: any, reply: any) => {
  return ProjectModel.getProjects();
};

const projectsController = {
  getProjects,
  updateProject,
  getProject
};

export default projectsController;
