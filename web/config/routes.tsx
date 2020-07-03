import * as React from "react";

import { Route } from "mobx-router";

import { WelcomePage } from "../pages/WelcomePage";

export const routes = {
  home: new Route({
    path: "/",
    component: <WelcomePage />,
  }),
};

export default routes;