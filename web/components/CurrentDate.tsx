import * as React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { entryStore, firstDayOfMonth } from "../stores/EntryStore";
import moment from "moment";

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "mobx-router-typescript";
import routes from "../config/routes";

import { useContext } from "react";
import { StoreContext } from "../App";

const SCurrentDate = styled.div`
  text-align: center;
  margin-top: 10rem;
  margin-bottom: 10rem;
  h1 {
    font-size: 4rem;
    vertical-align: middle;
    display: table-cell;
  }
  .arrow {
    font-size: 10rem;
  }
  .date {
    padding-left: 2rem;
    padding-right: 2rem;
    max-width: 60rem;
    width: 50%;
  }

  @media print {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
`;

export const CurrentDate = observer(() => {
  const store = useContext(StoreContext);
  const startDate = entryStore.selectedPeriod.startDate;
  const endDate = entryStore.selectedPeriod.endDate;

  return (
    <SCurrentDate>
      <div className="columns">
        <div className="column is-narrow current-date-arrow-left">
          <Link
            router={store.router}
            route={routes.home}
            queryParams={{
              startDate: moment(entryStore.selectedPeriod.startDate)
                .subtract(1, "months")
                .toISOString(),
              endDate: moment(entryStore.selectedPeriod.startDate)
                .subtract(1, "months")
                .endOf("month").toISOString(),
            }}
          >
            <MdKeyboardArrowLeft className="arrow" />
          </Link>
        </div>
        <div
          className="column"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: 'space-around'
          }}
        >
          <h1 className="date" style={{ textAlign: "left" }}>
            {moment(startDate).format("dddd, MMMM Do")}
            <br />
            {moment(startDate).format("YYYY")}
          </h1>
          <h1 className="date" style={{ textAlign: "right" }}>
            {moment(endDate).format("dddd, MMMM Do")}
            <br />
            {moment(endDate).format("YYYY")}
          </h1>
        </div>
        <div className="column is-narrow current-date-arrow-right">
          <Link
            router={store.router}
            route={routes.home}
            queryParams={{
              startDate: moment(entryStore.selectedPeriod.startDate)
                .add(1, "months")
                .toISOString(),
              endDate: moment(entryStore.selectedPeriod.startDate)
                .add(1, "months")
                .endOf("month")
                .toISOString(),
            }}
          >
            <MdKeyboardArrowRight className="arrow" />
          </Link>
        </div>
      </div>
      <div></div>
    </SCurrentDate>
  );
});
