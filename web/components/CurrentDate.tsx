import { observer } from "mobx-react";
import Link from "next/link";
import * as React from "react";
import { RootStoreContext } from "../stores/rootStore";
import { DateTime } from "luxon";

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export const CurrentDate: React.FC<{ className: string }> = observer(
  ({ className }) => {
    const { uiStore, projectStore } = React.useContext(RootStoreContext);

    return (
      <>
        <div
          className={`flex flex-col md:flex-row print:flex-row w-full ${className}`}
        >
          <div className="w-full md:w-1/2">
            <div className="flex flex-row items-center justify-start">
              <Link
                href={{
                  pathname: `/${projectStore.currentProject.name}`,
                  query: {
                    startDate: DateTime.fromISO(
                      uiStore.selectedPeriod.startDate
                    )
                      .minus(1, "month")
                      .startOf("month")
                      .toISO(),
                    endDate: DateTime.fromISO(uiStore.selectedPeriod.startDate)
                      .minus(1, "month")
                      .endOf("month")
                      .toISO(),
                  },
                }}
              >
                <a>
                  <MdKeyboardArrowLeft
                    size={70}
                    className="text-sky-500 print:hidden"
                  />
                </a>
              </Link>
              <h1 className="print:text-3xl screen:text-4xl md:text-5xl font-bold">
                {DateTime.fromISO(
                  uiStore.selectedPeriod.startDate
                ).toLocaleString(DateTime.DATE_FULL)}
              </h1>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="flex flex-row items-center justify-end">
              <h1 className="print:text-3xl screen:text-4xl md:text-5xl font-bold">
                {DateTime.fromISO(
                  uiStore.selectedPeriod.endDate
                ).toLocaleString(DateTime.DATE_FULL)}
              </h1>
              <Link
                href={{
                  pathname: `/${projectStore.currentProject.name}`,
                  query: {
                    startDate: DateTime.fromISO(uiStore.selectedPeriod.endDate)
                      .plus(1, "month")
                      .startOf("month")
                      .toISO(),
                    endDate: DateTime.fromISO(uiStore.selectedPeriod.endDate)
                      .plus(1, "month")
                      .endOf("month")
                      .toISO(),
                  },
                }}
              >
                <a>
                  <MdKeyboardArrowRight
                    size={70}
                    className="text-sky-500 print:hidden"
                  />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }
);
