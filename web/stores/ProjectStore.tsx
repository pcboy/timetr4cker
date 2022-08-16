import Axios from "axios";
import { destroy, Instance, types } from "mobx-state-tree";
import { Entry, IEntry } from "./Entry";
import { IProject, Project } from "./Project";
import { rootStore } from "./rootStore";

export type ProjectResponse = {
  id: string;
  name: string;
  budget: number;
  timeBudget: number;
  rate: number;
  createdAt: string;
  updatedAt: string;
};

const Transformers = {
  project: (response: ProjectResponse) => ({
    id: response.id.toString(),
    name: response.name,
    budget: response.budget,
    timeBudget: response.timeBudget,
    rate: response.rate,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  }),
};

export const ProjectStore = types
  .model("ProjectStore", {
    projects: types.array(Project),
    currentProject: types.maybe(
      types.safeReference(Project, {
        get(identifier: string, parent: any) {
          return (
            rootStore.projectStore.projects.find((x) => x.id === identifier) ||
            rootStore.projectStore.projects[0]
          );
        },
        set(value) {
          return value.id;
        },
      })
    ),
  })
  .actions((self) => ({
    pushProject(projectResponse: ProjectResponse) {
      self.projects.push(projectResponse);
    },
    getProject(projectName: string) {
      return Axios.get<ProjectResponse[]>(
        process.env.NEXT_PUBLIC_API_URL + `/projects/${projectName}`
      ).then((response: any) => {
        const proj = Transformers.project(response.data);
        if (!self.projects.map((x) => x.id).includes(proj.id)) {
          this.pushProject(proj);
        }
        return proj.id;
      });
    },
    setCurrentProject(projectId: string) {
      self.currentProject = projectId;
    },
    startTimer() {
      return Promise.resolve(true);
    },
    stopTimer() {
      return Promise.resolve(true);
    },
  }));

export interface IProjectStore extends Instance<typeof ProjectStore> {}
