import * as EntryModel from "../models/entry";
import { Project } from "../models/project";

const getEntries = async (req: any, reply: any) => {
  const { projectName } = req.params;

  const [project]: [Project, boolean] = await Project.findOrCreate({
    where: { name: projectName },
    defaults: { budget: 1000000, timeBudget: 161 * 60, rate: 10000 },
  });

  const {
    startTime,
    endTime,
  }: { startTime: string; endTime: string } = req.query;

  return EntryModel.getEntries(
    project.id!,
    new Date(parseInt(startTime)),
    new Date(parseInt(endTime))
  );
};

const startTimer = async (req: any, reply: any) => {
  const { projectName } = req.params;
  const [project]: [Project, boolean] = await Project.findOrCreate({
    where: { name: projectName },
  });

  const exists = await EntryModel.Entry.findOne({
    where: { endTime: null, projectId: project.id! },
  });

  if (!exists) {
    return EntryModel.createEntry(project.id!, new Date());
  }

  return reply.code(412).send({
    message: "Error: There is already a started entry for this project.",
  });
};

const stopTimer = async (req: any, reply: any) => {
  const { projectName } = req.params;
  const [project]: [Project, boolean] = await Project.findOrCreate({
    where: { name: projectName },
  });

  const exists = await EntryModel.Entry.findOne({
    where: { endTime: null, projectId: project.id! },
  });

  if (exists) {
    return EntryModel.Entry.update(
      { endTime: new Date() },
      { where: { projectId: project.id!, endTime: null } }
    );
  }

  return reply
    .code(412)
    .send({ message: "Error: There is no pending entry for this project." });
};

const createEntry = async (req: any, reply: any) => {
  const { projectName } = req.params;

  const [project]: [Project, boolean] = await Project.findOrCreate({
    where: { name: projectName },
  });

  var {
    startTime,
    endTime,
  }: { startTime: string; endTime: string } = req.query;

  return EntryModel.createEntry(
    project.id!,
    new Date(parseInt(startTime)),
    new Date(parseInt(endTime))
  );
};

const entriesController = {
  getEntries,
  createEntry,
  startTimer,
  stopTimer,
};

export default entriesController;
