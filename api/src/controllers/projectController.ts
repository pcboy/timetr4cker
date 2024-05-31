import * as ProjectModel from "../models/project";
import { Project } from "../models/project";

const updateProject = async (req: any, reply: any) => {
  const { projectId } = req.params;

  console.log(projectId);
  const project = await Project.findOne({ where: { id: projectId } });

  const {
    budget,
    timeBudget,
    rate,
  }: { budget: string; timeBudget: string; rate: string } = req.body;
  console.log(req.body);

  return ProjectModel.updateProject(
    project.id,
    parseInt(budget),
    parseInt(timeBudget),
    parseInt(rate)
  ).then(() => reply.code(200).send({ success: true }));
};

const getProject = async (req: any, reply: any) => {
  const { projectName } = req.params;

  const project = await Project.findOne({ where: { name: projectName } });
  console.log(project)
  if (!project) {
    return await Project.findOrCreate({
      where: { name: projectName },
      defaults: { name: projectName },
    });
  }
  return project;
};

const getProjects = async (req: any, reply: any) => {
  return ProjectModel.getProjects();
};

const projectsController = {
  getProjects,
  updateProject,
  getProject,
};

export default projectsController;
