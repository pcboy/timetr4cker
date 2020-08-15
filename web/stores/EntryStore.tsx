import { observable, computed } from "mobx";
import { action } from "mobx";
import Axios from "axios";

import { EntryResponse, ProjectResponse } from "../../common/types";

import { groupBy } from "lodash";

import moment from "moment";

export const firstDayOfMonth = (offset = 0) => {
  var date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
};

export const lastDayOfMonth = (offset = 0) => {
  var date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1 + offset, 0);
};

const DateEntry = (entryResponse: EntryResponse) => {
  return {
    ...entryResponse,
    startTime: new Date(entryResponse.startTime),
    endTime: entryResponse.endTime && new Date(entryResponse.endTime),
    duration:
      entryResponse.endTime &&
      moment(entryResponse.endTime).diff(
        moment(entryResponse.startTime),
        "minutes"
      ),
  };
};

interface ProjectData {
  name: string;
  currentMinutes: number;
  budget: number;
  timeBudget: number;
  rate: number;
  isTimerStarted: boolean;
}

class EntryStore {
  @observable project: ProjectData = {
    name: "",
    currentMinutes: 0,
    budget: 0,
    timeBudget: 0,
    rate: 0,
    isTimerStarted: false,
  };

  @observable selectedPeriod = {
    startDate: firstDayOfMonth(),
    endDate: lastDayOfMonth(),
  };

  @computed get timePercentage() {
    if (this.project.timeBudget === 0) return 0;

    return (
      ((this.project.currentMinutes / this.project.timeBudget) * 100).toFixed(
        1
      ) || 0
    );
  }

  @computed get moniesPercentage() {
    if (this.project.budget === 0) return 0;

    return (
      (((this.project.currentMinutes / 60.0) * this.project.rate) /
        this.project.budget) *
        100 || 0
    );
  }

  @action updateProject = async (projectData: ProjectData) => {
    const merged = { ...this.project, ...projectData };
    console.log(merged);
    return Axios.post(
      process.env.API_URL + `/projects/${merged.name}`,
      {
        budget: merged.budget,
        timeBudget: merged.timeBudget,
        rate: merged.rate,
      },
      { withCredentials: true }
    ).then((response) => {
      console.log(JSON.stringify(this.project));
      this.project = { ...this.project, ...response.data };
      console.log(JSON.stringify(this.project));
      return this.project;
    });
  };

  @action getProject = async (projectName: string) => {
    return Axios.get<ProjectResponse[]>(
      process.env.API_URL + `/projects/${projectName}`
    ).then((response: any) => {
      this.project = { ...this.project, ...response.data };
      return this.project;
    });
  };

  @action deleteEntry = async (entryId: number) => {
    return Axios.delete(
      process.env.API_URL + `/entries/${this.project.name}/${entryId}`,
      { withCredentials: true }
    );
  };

  @action startTimer = async (projectName: string) => {
    return Axios.post(
      process.env.API_URL + `/entries/${projectName}/startTimer`,
      { withCredentials: true }
    ).then((response) => {
      this.project.isTimerStarted = true;

      return response.data;
    });
  };

  @action stopTimer = async (projectName: string) => {
    return Axios.post(
      process.env.API_URL + `/entries/${projectName}/stopTimer`,
      {
        withCredentials: true,
      }
    ).then((response) => {
      this.project.isTimerStarted = false;

      return response.data;
    });
  };

  @action createEntry = async (startTime, endTime) => {
    return Axios.post(
      process.env.API_URL + "/entries",
      { startTime, endTime },
      { withCredentials: true }
    ).then((response) => response.data);
  };

  @action updateEntry = async (
    entryId: number,
    startTime: number,
    endTime: number
  ) => {
    console.log(moment(startTime));
    return Axios.put(
      process.env.API_URL + `/entries/${entryId}`,
      { startTime, endTime },
      { withCredentials: true }
    ).then((response) => response.data);
  };

  @action loadEntries = async (projectName: string) => {
    return Axios.get<EntryResponse[]>(
      process.env.API_URL + `/entries/${projectName}`,
      {
        params: {
          startTime: this.selectedPeriod.startDate.getTime(),
          endTime: this.selectedPeriod.endDate.getTime(),
        },
      }
    )
      .then((response) => response.data)
      .then((data) => data.sort((a, b) => a.startTime - b.startTime))
      .then((data) => {
        this.project["currentMinutes"] = 0;
        let isStarted = false;
        const res = data.map((entry) => {
          if (!entry.endTime) {
            isStarted = true;
          }
          this.project.isTimerStarted = isStarted;
          const dEntry = DateEntry(entry);
          this.project["currentMinutes"] += dEntry.duration;
          return DateEntry(entry);
        });

        return res;
      })
      .then((data) => {
        console.log(this.project);
        return groupBy(data, (x) => moment(x.startTime).format("YYYY/MM/DD"));
      });
  };
}

export const entryStore = new EntryStore();
export default entryStore;
