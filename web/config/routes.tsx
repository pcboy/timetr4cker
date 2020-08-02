import * as React from "react";

import { Route } from "mobx-router";

import { WelcomePage } from "../pages/WelcomePage";
import moment from "moment";

const parseWelcomeParams = (route, params: any, store: any, queryParams: any) => {
  const entryStore = store.app.entryStore;

  queryParams?.startDate &&
    (entryStore.selectedPeriod.startDate = moment(
      queryParams.startDate
    ).toDate());

  queryParams?.endDate &&
    (entryStore.selectedPeriod.endDate = moment(
      queryParams.endDate
    ).toDate());

  params && (entryStore.project.name = params.projectName);

  console.log("current query params are -> ", queryParams);
  return true;

}

export const routes = {
  home: new Route({
    path: "/:projectName",
    component: <WelcomePage />,
    onEnter:  parseWelcomeParams,
    onParamsChange: parseWelcomeParams,
  }),
};

export default routes;
