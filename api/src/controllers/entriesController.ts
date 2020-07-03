import * as EntryModel from "../models/entry";
import { prisma } from "../generated/prisma-client";

const getEntries = async (req: any, reply: any) => {
  const {
    startTime,
    endTime,
  }: { startTime: string; endTime: string } = req.query;

  return EntryModel.getEntries(parseInt(startTime), parseInt(endTime));
};

const startTimer = async (req: any, reply: any) => {
  const { projectId } = req.params;

  const exists = await prisma.$exists.entry({
    endTime: null,
    project: { id: projectId },
  });

  if (!exists) {
    return EntryModel.createEntry(projectId, new Date().getTime());
  }

  return reply.code(412).send({
    message: "Error: There is already a started entry for this project.",
  });
};

const stopTimer = async (req: any, reply: any) => {
  const { projectId } = req.params;

  const exists = await prisma.$exists.entry({
    endTime: null,
    project: { id: projectId },
  });

  if (exists) {
    return prisma.updateManyEntries({
      data: { endTime: new Date() },
      where: { project: { id: projectId }, endTime: null },
    });
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
    parseInt(startTime),
    parseInt(endTime)
  );
};

const entriesController = {
  getEntries,
  createEntry,
  startTimer,
  stopTimer,
};

export default entriesController;
