import { observable } from "mobx";
import { action } from "mobx";
import Axios from "axios";

import { EntryResponse, ProjectResponse } from "../../common/types";

import { groupBy } from "lodash";

import moment from "moment";

const firstDayOfMonth = () => {
  var date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const lastDayOfMonth = () => {
  var date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
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

class EntryStore {
  @observable timersStatus = {};

  @observable selectedPeriod = {
    startDate: firstDayOfMonth(),
    endDate: lastDayOfMonth(),
  };

  @action getProjects = async () => {
    return Axios.get<ProjectResponse[]>(process.env.API_URL + `/projects`).then(
      (response) => response.data
    );
  };

  @action deleteEntry = async (entryId) => {
    return Axios.post(
      process.env.API_URL + "/entries/delete",
      { id: entryId },
      { withCredentials: true }
    );
  };

  @action startTimer = async (projectName) => {
    return Axios.post(
      process.env.API_URL + `/entries/${projectName}/startTimer`,
      { withCredentials: true }
    ).then((response) => response.data);
  };

  @action stopTimer = async (projectName) => {
    return Axios.post(process.env.API_URL + `/entries/${projectName}/stopTimer`, {
      withCredentials: true,
    }).then((response) => response.data);
  };

  @action createEntry = async (startTime, endTime) => {
    return Axios.post(
      process.env.API_URL + "/entries",
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
      .then((data) =>
        data.map((entry) => {
          this.timersStatus[entry.project.name] = !entry.endTime;
          return DateEntry(entry);
        })
      )
      .then((data) =>
        groupBy(data, (x) => moment(x.startTime).format("YYYY/MM/DD"))
      );
  };
}

export const entryStore = new EntryStore();
export default entryStore;
