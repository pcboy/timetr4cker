import { types } from "mobx-state-tree";
import { DateTime } from "luxon";
import { Project } from "./Project";

export const firstDayOfMonth = DateTime.local().startOf("month").toISO();

export const lastDayOfMonth = DateTime.local().endOf("month").toISO();

export const UiStore = types
  .model("UiStore", {
    selectedPeriod: types.optional(
      types.model({
        startDate: types.string,
        endDate: types.string,
      }),
      { startDate: firstDayOfMonth, endDate: lastDayOfMonth }
    ),
  })
  .actions((self) => ({
    setStartDate(date: string) {
      console.log(date);
      self.selectedPeriod.startDate = date;
    },
    setEndDate(date: string) {
      console.log(date);
      self.selectedPeriod.endDate = date;
    },
  }));
