import * as React from "react";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import _ from "lodash";

import { StoreContext } from "../App";

import { ApplicationLayout } from "../layouts/ApplicationLayout";

import { ProjectConfiguration } from "../components/ProjectConfiguration";
import { Entries } from "../components/Entries";
import { CurrentDate } from "../components/CurrentDate";
import entryStore from "../stores/EntryStore";

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
          Project {entryStore.project.name}
        </h1>
        <ProjectConfiguration
          key={`project_${entryStore.selectedPeriod.startDate}_${entryStore.selectedPeriod.endDate}`}
          projectName={entryStore.project.name}
        />

        <Entries
          key={`entries_${entryStore.selectedPeriod.startDate}_${entryStore.selectedPeriod.endDate}`}
          projectName={entryStore.project.name}
        />
      </>
    </ApplicationLayout>
  );
});
