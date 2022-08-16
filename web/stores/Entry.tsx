import { getParent, Instance, types } from "mobx-state-tree";
import { DateTime } from "luxon";
import Axios from "axios";

export type EntryResponse = {
  id: string;
  startTime: string;
  endTime: string;
};

export const Entry = types
  .model("Entry", {
    id: types.identifier,
    startTime: types.string,
    endTime: types.maybeNull(types.string),
  })
  .actions((self) => ({
    updateStartTime(startTime: string) {
      self.startTime = startTime;
    },
    updateEndTime(endTime: string) {
      self.endTime = endTime;
    },
    delete() {
      return Axios.delete(
        process.env.NEXT_PUBLIC_API_URL + `/entries/${self.id}`
      ).then(() => {
        getParent(self, 2).deleteEntry(self);
      });
    },
    save() {
      if (!self.id) {
        return Axios.post(process.env.NEXT_PUBLIC_API_URL + "/entries", {
          startTime: DateTime.fromISO(self.startTime).toMillis(),
          endTime: DateTime.fromISO(self.endTime).toMillis(),
        }).then((response) => response.data);
      }

      return Axios.put(
        process.env.NEXT_PUBLIC_API_URL + `/entries/${self.id}`,
        {
          startTime: DateTime.fromISO(self.startTime).toMillis(),
          endTime: DateTime.fromISO(self.endTime).toMillis(),
        }
      ).then((response) => response.data);
    },
  }))
  .views((self) => ({
    get duration() {
      return self.endTime
        ? DateTime.fromISO(self.endTime).diff(
            DateTime.fromISO(self.startTime),
            "minutes"
          ).values.minutes
        : 0;
    },
  }));

export interface IEntry extends Instance<typeof Entry> {}
