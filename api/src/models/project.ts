import { prisma, Entry, Project } from "../generated/prisma-client";

export const findProject = async (projectId: number) => {
  return prisma.project({ id: projectId });
};

export const createProject = async (name: string) => {
  return prisma.createProject({
    name: name,
  });
};

export const getProjects = async () => {
  return prisma.projects();
};
