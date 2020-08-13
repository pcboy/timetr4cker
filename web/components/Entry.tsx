import * as React from "react";
import { observer } from "mobx-react-lite";
import Moment from "react-moment";
import styled from "styled-components";
import moment from "moment";

import { MdDeleteSweep } from "react-icons/md";

import { useMutation, queryCache } from "react-query";
import entryStore from "../stores/EntryStore";

const SEntry = styled.div`
  position: relative;

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

  @media print {
    box-shadow: none;
    background: none;
    margin-bottom: 0;
    font-size: 1rem;
    padding-bottom: 0;
  }
  .delete-icon {
    display: none;
  }
  &:hover {
    .delete-icon {
      display:inline;
      position: absolute;
      right: -6rem;
      top: 0;
      z-index:100;
      height:100%;
      width: 70px;
      &:hover {
        display:inline;

        color: var(--radical-red);
        cursor: pointer;
      }
    }
  }
`;

export const Entry = observer<{
  id: number;
  startTime: Date;
  endTime: Date;
  duration: number;
}>(({ id, startTime, endTime, duration }) => {
  const deleteAction = async (data: any) => {
    entryStore.deleteEntry(data.id);
  };
  const [deleteEntry, { status }] = useMutation(deleteAction);

  return status !== "success" ? (
    <SEntry className="entry" data-id={id} key={`entry_${id}_${status}`}>
      <div className="columns">
        <div className="column is-8">
          {moment(startTime).format("HH:mm")} ~{" "}
          {endTime && moment(endTime).format("HH:mm")}
        </div>
        <div className="column is-4">
          <div className="duration">
            {endTime ? (
              <p>
                {moment
                  .utc(moment.duration(duration, "minutes").asMilliseconds())
                  .format("HH:mm")}
              </p>
            ) : (
              <p>
                <Moment interval={1000} durationFromNow>
                  {startTime}
                </Moment>
              </p>
            )}
          </div>
          <MdDeleteSweep
            className="delete-icon"
            size={32}
            onClick={() => deleteEntry({ id })}
          ></MdDeleteSweep>
        </div>
      </div>
    </SEntry>
  ) : (
    <></>
  );
});
