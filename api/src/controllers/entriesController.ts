import * as EntryModel from "../models/entry";

const getEntries = async (req: any, reply: any) => {
  const {
    startTime,
    endTime,
  }: { startTime: string; endTime: string } = req.query;
  console.log(req.query);

  const projectId = 1;

  return EntryModel.getEntries(
    projectId,
    new Date(parseInt(startTime)),
    new Date(parseInt(endTime))
  );
};

const startTimer = async (req: any, reply: any) => {
  const { projectId } = req.params;

  const exists = await EntryModel.Entry.findOne({
    where: { endTime: null, projectId: projectId },
  });

  if (!exists) {
    return EntryModel.createEntry(projectId, new Date());
  }

  return reply.code(412).send({
    message: "Error: There is already a started entry for this project.",
  });
};

const stopTimer = async (req: any, reply: any) => {
  const { projectId } = req.params;

  const exists = await EntryModel.Entry.findOne({
    where: { endTime: null, projectId: projectId },
  });

  if (exists) {
    return EntryModel.Entry.update(
      { endTime: new Date() },
      { where: { projectId: projectId, endTime: null } }
    );
  }

  return reply
    .code(412)
    .send({ message: "Error: There is no pending entry for this project." });
};

const createEntry = async (req: any, reply: any) => {
  const { projectId } = req.params;
  var {
    startTime,
    endTime,
  }: { startTime: string; endTime: string } = req.query;

  return EntryModel.createEntry(
    projectId,
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
