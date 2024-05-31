import { Table, Column, Model } from "sequelize-typescript";

@Table({ timestamps: true })
export class Project extends Model<Project> {
  @Column
  name?: string;

  @Column
  budget?: number;

  @Column
  timeBudget?: number;

  @Column
  rate?: number;
}

export const findProject = async (projectId: number) => {
  return Project.findByPk(projectId);
};

export const updateProject = async (
  projectId: number,
  budget: number,
  timeBudget: number,
  rate: number,
) => {
  const projects = (
    await Project.update<Project>(
      {
        budget,
        timeBudget,
        rate,
      },
      { where: { id: projectId }, returning: true },
    )
  )[1];

  return projects[0] as Project;
};

export const createProject = async (name: string) => {
  return Project.findOrCreate({
    where: { name },
    defaults: { name, budget: 0, timeBudget: 0 },
  });
};

export const getProjects = async () => {
  return Project.findAll();
};
