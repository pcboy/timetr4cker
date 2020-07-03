import { prisma, Entry, Project } from "../generated/prisma-client";

export const getEntries = async (startTime: number, endTime: number) => {
  return prisma
    .entries({
      where: {
        OR: [
          {
            startTime_gte: new Date(startTime),
            endTime_lte: new Date(endTime),
          },
          { startTime_gte: new Date(startTime), endTime: null },
        ],
      },
    })
    .$fragment("{id startTime endTime project { id name }}");
};

export const createEntry = async (
  project_id: number,
  startTime: number,
  endTime?: number
) => {
  return prisma.createEntry({
    startTime: new Date(startTime),
    endTime: endTime ? new Date(endTime) : null,
    project: { connect: { id: project_id } },
  });
};
