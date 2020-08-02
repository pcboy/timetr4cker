import * as React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { entryStore } from "../stores/EntryStore";
import moment from "moment";

const SCurrentDate = styled.div`
  text-align: center;
  margin-top: 10rem;
  margin-bottom: 10rem;
`;

export const CurrentDate = observer(() => {
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
