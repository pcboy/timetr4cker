import * as React from "react";
import { Component, useState } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "mobx-router-typescript";
import logo from "../assets/logo.png";
import Moment from "react-moment";
import { useContext } from "react";

import { StoreContext } from "../App";

import {
  BasicContainer,
  ApplicationLayout,
} from "../layouts/ApplicationLayout";

import styled from "styled-components";

import { entryStore } from "../stores/EntryStore";
import { useQuery, useMutation, queryCache } from "react-query";

import moment from "moment";

const SEntries = styled.div`
  h1 {
    text-align: center;
  }

  .day-divider {
    text-align: right;
    font-weight: bold;
    font-size: 3rem;
    display: flex;
    align-items: center;
    p {
      min-width: fit-content;
    }

    &:before {
      content: " ";
      width: 100%;
      border-bottom: 1px solid lightgray;
      display: inline-block;
      margin-right: 2rem;
    }
  }
`;

const SCurrentDate = styled.div`
  text-align: center;
  margin-top: 10rem;
  margin-bottom: 10rem;
`;

const SEntry = styled.div`
  padding: 1rem;
  background-color: white;
  color: black;
  border-radius: 6px;
  font-weight: bold;

  .duration {
    text-align: right;
  }
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const Entry = observer(({ id, startTime, endTime, duration }) => {
  return (
    <SEntry data-id={id}>
      <div className="columns">
        <div className="column is-8">
          {moment(startTime).format("HH:mm")} ~{" "}
          {endTime && moment(endTime).format("HH:mm")}
        </div>
        <div className="column is-4">
          <div className="duration">
            {endTime ? (
              <p>{duration} minutes</p>
            ) : (
              <p>
                <Moment interval={1000} durationFromNow>
                  {startTime}
                </Moment>
              </p>
            )}
          </div>
        </div>
      </div>
    </SEntry>
  );
});

const Entries = observer(() => {
  const { status, data, error, isFetching } = useQuery(
    "entries",
    entryStore.loadEntries
  );

  if (status === "loading") {
    return (
      <SEntries>
        <h1>Loading...</h1>
      </SEntries>
    );
  }

  if (status === "error") {
    return (
      <SEntries>
        <h1>{error.message}</h1>
      </SEntries>
    );
  }

  const aggDuration = (entries) => {
    return (
      Object.values(entries)
        .flat()
        .reduce((acc, curr) => acc + (curr.duration || 0), 0) / 60
    ).toFixed(1);
  };

  return (
    <SEntries>
      {data.length == 0 ? (
        <div>
          <h1>You have no Time Entries yet for this period</h1>
        </div>
      ) : (
        <>
          <div className="columns is-multiline">
            {Object.keys(data).map((day) => (
              <React.Fragment key={`entry_group_${day}`}>
                <div className="column is-12">
                  <div className="day-divider">
                    <p>{day}</p>
                  </div>
                </div>
                <div className="column is-12">
                  {data[day].map((entry) => (
                    <Entry key={`entry_${entry.id}`} {...entry} />
                  ))}
                </div>
                <div className="column is-12" style={{ textAlign: "right" }}>
                  <p>SUBTOTAL: {aggDuration(data[day])} hours</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </>
      )}
      <div className="day-divider" style={{ marginTop: "10rem" }}>
        <p>{`TOTAL: ${aggDuration(data)} hours`}</p>
      </div>
    </SEntries>
  );
});

const CurrentDate = observer(() => {
  const startDate = entryStore.selectedPeriod.startDate;
  const endDate = entryStore.selectedPeriod.endDate;

  return (
    <SCurrentDate>
      <h1>{moment(startDate).format("dddd, MMMM Do YYYY")}</h1>
      <h1>~</h1>
      <h1>{moment(endDate).format("dddd, MMMM Do YYYY")}</h1>
    </SCurrentDate>
  );
});

const Triggers = observer(() => {
  const { status, data, error, isFetching } = useQuery(
    "projects",
    entryStore.getProjects
  );

  if (status === "loading") {
    return <h1>Loading...</h1>;
  }

  if (status === "error") {
    return <h1>{error.message}</h1>;
  }

  const isTimerStarted = (projectId) => {
    return entryStore.timersStatus[projectId];
  };

  return (
    <div>
      {data.map((p) => (
        <button
          key={`project_${p.id}`}
          className="is-primary"
          onClick={() =>
            (isTimerStarted(p.id)
              ? entryStore.stopTimer(p.id)
              : entryStore.startTimer(p.id)
            ).then(() => queryCache.invalidateQueries("entries"))
          }
        >
          {p.name}
        </button>
      ))}
    </div>
  );
});

export const WelcomePage = observer(() => {
  const store = useContext(StoreContext);

  return (
    <ApplicationLayout>
      <>
        <div
          className="logo"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <img src={logo} />
        </div>
        <CurrentDate />
        <Triggers />

        <Entries />
      </>
    </ApplicationLayout>
  );
});
