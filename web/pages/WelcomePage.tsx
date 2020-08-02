import * as React from "react";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import _ from "lodash";

import { StoreContext } from "../App";

import { ApplicationLayout } from "../layouts/ApplicationLayout";

import { ProjectConfiguration } from "../components/ProjectConfiguration";
import { Entries } from "../components/Entries";
import { CurrentDate } from "../components/CurrentDate";

export const WelcomePage = observer(() => {
  const store = useContext(StoreContext);

  return (
    <ApplicationLayout>
      <>
        <CurrentDate />

        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          {store.router.params["projectName"]}
        </h1>
        <ProjectConfiguration
          projectName={store.router.params["projectName"]}
        />

        <Entries projectName={store.router.params["projectName"]} />
      </>
    </ApplicationLayout>
  );
});
