import * as React from "react";
import { observer } from "mobx-react-lite";
import ProgressBar from "@bit/redsky.framework.rs.progressbar";
import { RIENumber } from "riek";
import styled from "styled-components";
import { entryStore } from "../stores/EntryStore";
import { useQuery, queryCache } from "react-query";

const SProjectConfiguration = styled.div`
  padding: 1rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  margin-bottom: 3rem;
 
  .control-button {
    display: flex;
    justify-content: center;
    margin: 0 auto;
  }
  h1 {
    align-items: center;
    font-size: 3rem;
  }
  h1 button {
    margin-left: 2rem;
  }
`;

export const ProjectConfiguration = observer<{ projectName: string }>(
  ({ projectName }) => {
    const { status, data, error, isFetching } = useQuery("projects", () =>
      entryStore.getProject(projectName)
    );

    const isTimerStarted = () => {
      return entryStore.project.isTimerStarted;
    };

    if (status === "loading") {
      return <h1>Loading...</h1>;
    }

    if (status === "error") {
      return <h1>{error.message}</h1>;
    }

    const projectRate = (
      <RIENumber
        value={entryStore.project.rate}
        propName="rate"
        className="editable"
        change={(data) => {
          console.log(data);
          entryStore.updateProject({ ...entryStore.project, rate: data.rate });
        }}
      ></RIENumber>
    );

    const timeBudget = (
      <RIENumber
        value={((entryStore.project.timeBudget || 0) / 60.0).toFixed(1)}
        propName="timeBudget"
        className="editable"
        change={(data) =>
          entryStore.updateProject({
            ...entryStore.project,
            timeBudget: data.timeBudget * 60,
          })
        }
      ></RIENumber>
    );

    const budget = (
      <RIENumber
        value={entryStore.project.budget}
        className="editable"
        propName="budget"
        change={(data: any) =>
          entryStore.updateProject({
            ...entryStore.project,
            budget: data.budget,
          })
        }
      ></RIENumber>
    );

    return (
      <SProjectConfiguration className="project-configuration">
        <div className="columns is-multiline">
          <div className="column is-12">
            <button
              key={`project_${projectName}`}
              className={`control-button ${
                isTimerStarted() ? "is-danger" : "is-success"
              }`}
              onClick={() =>
                (isTimerStarted()
                  ? entryStore.stopTimer(projectName)
                  : entryStore.startTimer(projectName)
                ).then(() => queryCache.invalidateQueries("entries"))
              }
            >
              {isTimerStarted() ? `STOP TIMER` : `START TIMER`}
            </button>
          </div>
          <div className="column is-12">
            <b style={{ marginRight: "1rem" }}>Time Budget:</b>
            <span>
              {`${((entryStore.project.currentMinutes || 0) / 60.0).toFixed(
                1
              )} hours / `}
            </span>
            <span>{timeBudget} hours</span>
            <ProgressBar
              percentage={entryStore.timePercentage}
              customIndicatorContent={
                <h3>{entryStore.timePercentage + "%"}</h3>
              }
              customIndicator
              striped
              animated
            />
          </div>
          <div className="column is-12">
            <span style={{ marginRight: "1rem" }}>
              <b>Budget:</b> (Rate {projectRate} monies/h)
            </span>

            <br></br>
            <span>
              {(
                ((entryStore.project.currentMinutes || 0) / 60.0) *
                (entryStore.project.rate || 1)
              ).toFixed(0)}{" "}
              Monies / {budget} Monies
            </span>
            <ProgressBar
              percentage={entryStore.moniesPercentage}
              customIndicatorContent={
                <h3>{entryStore.moniesPercentage.toFixed(1) + "%"}</h3>
              }
              customIndicator
              striped
              animated
            />
          </div>
        </div>
      </SProjectConfiguration>
    );
  }
);
