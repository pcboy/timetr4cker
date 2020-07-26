import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ timestamps: true })
export class Project extends Model<Project> {
  @Column({ primaryKey: true, type: DataType.NUMBER })
  id?: number;

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

export const createProject = async (name: string) => {
  return Project.findOrCreate({
    where: { name },
    defaults: { name },
  });
};

export const getProjects = async () => {
  return Project.findAll();
};
