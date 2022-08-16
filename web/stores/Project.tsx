import Axios from "axios";
import { cast, destroy, Instance, types } from "mobx-state-tree";
import { Entry, EntryResponse, IEntry } from "./Entry";
import { UiStore } from "./UiStore";

import { DateTime } from "luxon";
import { entries } from "mobx";

export const Project = types
  .model("Project", {
    id: types.identifier,
    name: types.optional(types.string, ""),
    budget: types.optional(types.number, 0),
    timeBudget: types.optional(types.number, 0),
    rate: types.optional(types.number, 0),
    isTimerStarted: types.optional(types.boolean, false),
    entries: types.array(Entry),
  })
  .actions((self) => ({
    pushToEntries(entry: IEntry) {
      const previousEntry = self.entries.filter((x) => x.id == entry.id)[0];
      if (previousEntry) {
        previousEntry.updateStartTime(entry.startTime);
        previousEntry.updateEndTime(entry.endTime);
        return;
      }
      self.entries.push(entry);
    },
  }))
  .actions((self) => ({
    setTimerStatus(started: boolean) {
      return (self.isTimerStarted = started);
    },
    loadEntries(startDate: string, endDate: string) {
      return Axios.get<EntryResponse[]>(
        process.env.NEXT_PUBLIC_API_URL + `/entries/${self.name}`,
        {
          params: {
            startTime: DateTime.fromISO(startDate).toMillis(),
            endTime: DateTime.fromISO(endDate).toMillis(),
          },
        }
      )
        .then((response) => response.data)
        .then((data) => {
          data.map((entry) => {
            self.pushToEntries(
              cast({
                id: entry.id.toString(),
                startTime: entry.startTime,
                endTime: entry.endTime,
              })
            );
          });
        });
    },
  }))
  .actions((self) => ({
    setRate(rate: number) {
      self.rate = rate;
    },
    setTimeBudget(budget: number) {
      self.timeBudget = budget;
    },
    setBudget(budget: number) {
      self.budget = budget;
    },
    updateProject() {
      return Axios.post(
        process.env.NEXT_PUBLIC_API_URL + `/projects/${self.id}`,
        {
          budget: self.budget,
          timeBudget: self.timeBudget,
          rate: self.rate,
        }
      );
    },
    deleteEntry(entry: IEntry) {
      destroy(entry);
    },
    clearEntries() {
      self.entries.clear();
    },
    startTimer() {
      return Axios.post(
        process.env.NEXT_PUBLIC_API_URL + `/entries/${self.name}/startTimer`,
        { withCredentials: true }
      ).then((response) => {
        self.setTimerStatus(true);
        self.loadEntries(
          DateTime.local().plus({ days: -1 }).toISO(),
          DateTime.local().toISO()
        );
        return response.data;
      });
    },
    stopTimer() {
      return Axios.post(
        process.env.NEXT_PUBLIC_API_URL + `/entries/${self.name}/stopTimer`,
        { withCredentials: true }
      ).then((response) => {
        self.setTimerStatus(false);
        self.loadEntries(
          DateTime.local().plus({ days: -1 }).toISO(),
          DateTime.local().toISO()
        );

        return response.data;
      });
    },
  }))
  .views((self) => ({
    get sortedEntries() {
      return self.entries
        .slice()
        .sort((a, b) => (a.startTime > b.startTime ? -1 : 1));
    },
  }))
  .views((self) => ({
    get groupedEntries() {
      return self.sortedEntries.reduce((a, b) => {
        const date = DateTime.fromISO(b.startTime).toFormat("yyyy/MM/dd");
        a[date] ||= [];
        a[date].push(b);
        return a;
      }, {});
    },
    get currentMinutes(): number {
      return self.entries
        .map((entry) => entry.duration)
        .reduce((a, b) => a + b, 0);
    },
  }))
  .views((self) => ({
    get sortedDays() {
      return Object.keys(self.groupedEntries).sort(
        (a, b) => DateTime.fromISO(b) - DateTime.fromISO(a)
      );
    },
    get timePercentage() {
      if (self.timeBudget === 0) return 0;

      return (self.currentMinutes / self.timeBudget) * 100 || 0;
    },
    get moniesPercentage() {
      if (self.budget === 0) return 0;

      return (
        (((self.currentMinutes / 60.0) * self.rate) / self.budget) * 100 || 0
      );
    },
  }));

export interface IProject extends Instance<typeof Project> {}
