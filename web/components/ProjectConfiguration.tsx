import * as React from "react";
import { Component } from "react";

import { RIENumber } from "riek";
import { RootStoreContext } from "../stores/rootStore";
import { useQuery, QueryCache } from "react-query";
import { Project } from "../stores/Project";
import { observer } from "mobx-react";

const ProgressBar: React.FC<{ percent: number }> = ({ percent }) => (
  <div className="w-full bg-gray-200 rounded-l-lg rounded-r-lg dark:bg-gray-700">
    <div
      className="bg-teal-400 text-xs font-bold text-white text-center p-2 rounded-l-lg rounded-r-lg"
      style={{ width: `${percent > 100 ? 100 : percent}%` }}
    >
      {percent && percent.toFixed(0)}%
    </div>
  </div>
);

export const Button: React.FC<{
  onClick: () => void;
  className: string;
  children: JSX.Element;
}> = ({ onClick, className, children }) => (
  <button
    className={`p-2 px-7 rounded-lg text-white font-bold ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const ProjectRate: React.FC = () => {
  const { uiStore, projectStore } = React.useContext(RootStoreContext);

  return (
    <RIENumber
      value={projectStore.currentProject.rate}
      propName="rate"
      className="editable"
      change={(data) => {
        console.log(data);
        projectStore.currentProject.setRate(parseInt(data.rate));
        projectStore.currentProject.updateProject();
      }}
    ></RIENumber>
  );
};

const TimeBudget: React.FC = () => {
  const { uiStore, projectStore } = React.useContext(RootStoreContext);

  return (
    <RIENumber
      value={((projectStore.currentProject.timeBudget || 0) / 60.0).toFixed(1)}
      propName="timeBudget"
      className="editable"
      change={(data) => {
        projectStore.currentProject.setTimeBudget(
          parseInt(data.timeBudget) * 60
        );
        projectStore.currentProject.updateProject();
      }}
    ></RIENumber>
  );
};

const Budget: React.FC = () => {
  const { projectStore } = React.useContext(RootStoreContext);

  return (
    <RIENumber
      value={projectStore.currentProject.budget}
      className="editable"
      propName="budget"
      change={(data: any) => {
        projectStore.currentProject.setBudget(parseInt(data.budget));
        projectStore.currentProject.updateProject();
      }}
    ></RIENumber>
  );
};

export const ProjectConfiguration: React.FC<{ className: string }> = observer(
  ({ className }) => {
    const { uiStore, projectStore } = React.useContext(RootStoreContext);

    React.useEffect(() => {
      console.log(projectStore.currentProject);
      projectStore.currentProject.clearEntries();
      projectStore.currentProject
        .loadEntries(
          uiStore.selectedPeriod.startDate,
          uiStore.selectedPeriod.endDate
        )
        .then(() => {
          projectStore.currentProject.entries.map((entry) => {
            if (!entry.endTime) {
              projectStore.currentProject.setTimerStatus(true);
            }
          });
        });
    }, [uiStore.selectedPeriod.startDate, uiStore.selectedPeriod.endDate]);

    return (
      <div
        className={`bg-white w-full shadow-md p-5 rounded flex flex-col ${className}`}
      >
        <div className="flex justify-center">
          <div className="min-w-min">
            <Button
              className={`${
                projectStore.currentProject.isTimerStarted
                  ? "bg-red-400 hover:bg-red-500"
                  : "bg-sky-400 hover:bg-sky-500"
              }`}
              onClick={() =>
                projectStore.currentProject.isTimerStarted
                  ? projectStore.currentProject.stopTimer()
                  : projectStore.currentProject.startTimer()
              }
            >
              <span>
                {projectStore.currentProject.isTimerStarted
                  ? `STOP TIMER`
                  : `START TIMER`}
              </span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col">
          <div>
            <b style={{ marginRight: "1rem" }}>Time Budget:</b>
            <span>
              {`${(
                (projectStore.currentProject.currentMinutes || 0) / 60.0
              ).toFixed(1)} hours / `}
            </span>
            <span>
              <>
                <TimeBudget /> hours
              </>
            </span>
          </div>

          <ProgressBar
            percent={projectStore.currentProject.timePercentage}
          ></ProgressBar>
        </div>
        <div className="flex flex-col mt-5">
          <span style={{ marginRight: "1rem" }}>
            <>
              <b>Budget:</b> (Rate <ProjectRate /> monies/h)
            </>
          </span>
          <span>
            <>
              {(
                ((projectStore.currentProject.currentMinutes || 0) / 60.0) *
                (projectStore.currentProject.rate || 1)
              ).toFixed(0)}{" "}
              Monies / <Budget /> Monies
            </>
          </span>
          <ProgressBar
            percent={projectStore.currentProject.moniesPercentage}
          ></ProgressBar>
        </div>
      </div>
    );
  }
);
