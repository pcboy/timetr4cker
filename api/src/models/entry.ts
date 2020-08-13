import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from "sequelize-typescript";

import { Project } from "./project";
import { Op } from "sequelize";

@Table({ timestamps: true })
export class Entry extends Model<Entry> {
  @Column(DataType.DATE)
  startTime?: Date;

  @Column(DataType.DATE)
  endTime?: Date;

  @ForeignKey(() => Project)
  @Column
  projectId?: number;

  @BelongsTo(() => Project)
  project?: Project;
}

export const getEntries = async (
  projectId: number,
  startTime: Date,
  endTime: Date
) => {
  return Entry.findAll({
    where: {
      projectId: projectId,
      [Op.or]: [
        {
          startTime: { [Op.gte]: startTime },
          endTime: { [Op.lte]: endTime },
        },
        { startTime: { [Op.gte]: startTime }, endTime: null },
      ],
    },
    include: [Project],
    order: [["startTime", "ASC"]],
  });
};

export const createEntry = async (
  projectId: number,
  startTime: Date,
  endTime?: Date
) => {
  return Entry.create({ projectId, startTime, endTime });
};

export const deleteEntry = async (projectId: number, entryId: number) => {
  return Entry.destroy({ where: { projectId, id: entryId } });
};
