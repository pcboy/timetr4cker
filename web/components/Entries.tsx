import * as React from "react";
import { Component } from "react";

import { RIENumber } from "riek";
import { RootStoreContext } from "../stores/rootStore";
import { useQuery, QueryCache } from "react-query";
import { Project } from "../stores/Project";
import { observer } from "mobx-react";
import { DateTime, Duration } from "luxon";
import { IEntry } from "../stores/Entry";
import { RIEInput } from "riek";
import { MdDeleteSweep } from "react-icons/md";

export const Entry: React.FC<{ entry: IEntry }> = observer(({ entry }) => {
  return (
    <div className="flex justify-between w-full screen:bg-white screen:shadow-md screen:p-2 screen:px-5 rounded-md screen:mt-3 screen:mb-5 print:text-sm screen:hover:shadow-md cursor-pointer relative">
      <div className="flex">
        <RIEInput
          value={DateTime.fromISO(entry.startTime).toLocaleString(
            DateTime.TIME_24_SIMPLE
          )}
          propName="startTime"
          className="editable has-text-left mr-2 w-10"
          style={{ textAlign: "left" }}
          validate={(input: any) => input.match(/^\d{1,2}:\d{1,2}$/g) !== null}
          change={(data: { startTime: string }) => {
            const [_, hours, minutes] = data.startTime.match(
              /^(\d{1,2}):(\d{1,2})$/
            )!;
            entry.updateStartTime(
              DateTime.fromISO(entry.startTime)
                .set({ hours: parseInt(hours), minutes: parseInt(minutes) })
                .toISO()
            );
            entry.save();
          }}
        ></RIEInput>
        ~
        {entry.endTime && (
          <RIEInput
            value={DateTime.fromISO(entry.endTime).toLocaleString(
              DateTime.TIME_24_SIMPLE
            )}
            propName="endTime"
            className="editable has-text-right ml-2 w-10"
            validate={(input: any) =>
              input.match(/^\d{1,2}:\d{1,2}$/g) !== null
            }
            change={(data: { endTime: string }) => {
              const [_, hours, minutes] = data.endTime.match(
                /^(\d{1,2}):(\d{1,2})$/
              )!;
              entry.updateEndTime(
                DateTime.fromISO(entry.endTime)
                  .set({ hours: parseInt(hours), minutes: parseInt(minutes) })
                  .toISO()
              );
              entry.save();
            }}
          ></RIEInput>
        )}
      </div>
      <div className="duration font-bold relative group">
        {entry.endTime ? (
          <p>
            {Duration.fromObject({ minutes: entry.duration }).toFormat("hh:mm")}
          </p>
        ) : (
          <p>-</p>
        )}
        <MdDeleteSweep
          className="absolute -right-20 -top-1 hover:text-red-500 w-20 hidden group-hover:block"
          size={32}
          onClick={() => entry.delete()}
        ></MdDeleteSweep>
      </div>
    </div>
  );
});

export const Entries: React.FC = observer(({}) => {
  const { uiStore, projectStore } = React.useContext(RootStoreContext);

  React.useEffect(() => {
    console.log("useEffect");
    console.log(projectStore.currentProject.groupedEntries);
  }, [projectStore.currentProject.entries.length]);

  return (
    <div className="flex w-full screen:mt-16 flex-col">
      {projectStore.currentProject.entries.length == 0 ? (
        <div className="flex w-full justify-center">
          <h1>You have no Time Entries yet for this period</h1>
        </div>
      ) : (
        <>
          <div className="flex flex-col w-full">
            <div className="flex w-full justify-between text-xl text-gray-600 screen:hidden">
              <b>Hours</b>
              <b>Duration</b>
            </div>
            {projectStore.currentProject.sortedDays.map((day) => (
              <React.Fragment key={`entry_group_${day}`}>
                <div className="screen:mb-8 screen:mt-5">
                  <div className="flex items-center">
                    <div className="border-t border-gray-300 flex-grow"></div>
                    <div className="flex-shrink ml-5 screen:text-xl print:text-sm font-bold">
                      {day}
                    </div>
                  </div>
                  {projectStore.currentProject.groupedEntries[day].map(
                    (entry) => (
                      <Entry entry={entry} key={`entry_${entry.id}`} />
                    )
                  )}
                  <div className="flex items-center mt-5 justify-end print:hidden">
                    <p className="ml-5">{`Subtotal: ${projectStore.currentProject.groupedEntries[
                      day
                    ]
                      .map((x) => x.duration)
                      .reduce((a, b) => (a + b) / 60.0, 0)
                      .toFixed(1)} hours`}</p>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center mt-5">
            <div className="border-t border-gray-300 flex-grow"></div>
            <p className="flex-shrink ml-5 font-bold">{`TOTAL: ${(
              (projectStore.currentProject.currentMinutes || 0) / 60.0
            ).toFixed(1)} hours`}</p>
          </div>
        </>
      )}
    </div>
  );
});
