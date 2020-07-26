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
  console.log(startTime);
  console.log(endTime);
  const entries = await Entry.findAll({
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
  });
  console.log(entries);
  return entries;
};

export const createEntry = async (
  projectId: number,
  startTime: Date,
  endTime?: Date
) => {
  return Entry.create({ projectId, startTime, endTime });
};
