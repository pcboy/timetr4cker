import * as React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { entryStore } from "../stores/EntryStore";
import { useQuery, queryCache } from "react-query";
import { Entry } from "./Entry";

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

export const Entries = observer(({ projectName }) => {
  const { status, data, error, isFetching } = useQuery("entries", () => entryStore.loadEntries(projectName).then((value) => {
    queryCache.invalidateQueries("projects");
    return value;
  })
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
        <p>{`TOTAL: ${(entryStore.project.currentMinutes / 60.0).toFixed(
          1
        )} hours`}</p>
      </div>
    </SEntries>
  );
});
