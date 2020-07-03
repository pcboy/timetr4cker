export type EntryResponse = {
  id: string;
  startTime: number;
  endTime: number;
  project: ProjectResponse;
};

export type ProjectResponse = {
  id: string;
  name: string;
};
