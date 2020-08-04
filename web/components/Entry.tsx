import * as React from "react";
import { observer } from "mobx-react-lite";
import Moment from "react-moment";
import styled from "styled-components";
import moment from "moment";

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

  @media print {
    box-shadow: none;
    background: none;
    margin-bottom: 0;
    font-size: 1rem;
    padding-bottom:0;
  }
`;

export const Entry = observer(({ id, startTime, endTime, duration }) => {
  return (
    <SEntry className="entry" data-id={id}>
      <div className="columns">
        <div className="column is-8">
          {moment(startTime).format("HH:mm")} ~{" "}
          {endTime && moment(endTime).format("HH:mm")}
        </div>
        <div className="column is-4">
          <div className="duration">
            {endTime ? (
              <p>
                {moment.utc(moment.duration(duration, "minutes").asMilliseconds()).format("HH:mm")}
              </p>
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
