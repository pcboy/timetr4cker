import * as React from "react";
import { Component } from "react";

import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { CurrentDate } from "../components/CurrentDate";
import { ProjectConfiguration } from "../components/ProjectConfiguration";
import { RootStoreContext } from "../stores/rootStore";

import { useQuery } from "react-query";
import { observer } from "mobx-react";
import { Entries } from "../components/Entries";

const MainControls: React.FC<{
  projectName: string;
  startDate: string;
  endDate: string;
}> = observer(({ projectName, startDate, endDate }) => {
  const { projectStore, uiStore } = useContext(RootStoreContext);

  const [notFound, setNotFound] = React.useState(false);

  useEffect(() => {
    projectStore
      .getProject(projectName.toString())
      .then((projectId) => {
        projectStore.setCurrentProject(projectId);
        startDate && uiStore.setStartDate(startDate);
        endDate && uiStore.setEndDate(endDate);
      })
      .catch((e) => setNotFound(true));
  }, [projectName, startDate, endDate]);

  return projectStore.currentProject ? (
    <div className="min-h-screen screen:px-10 md:px-0">
      <div className="container pt-5 mx-auto screen:max-w-5xl pb-40">
        <CurrentDate className="mb-32" />
        <ProjectConfiguration className="print:hidden" />
        <p className="w-full flex screen:hidden text-3xl font-bold justify-center mb-8">
          {projectStore.currentProject.name}
        </p>
        <Entries />
      </div>
    </div>
  ) : (
    <div className="h-screen w-screen flex justify-center items-center">
      {notFound ? <b>Project not found</b> : <b>Loading project..</b>}
    </div>
  );
});

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const { projectStore } = useContext(RootStoreContext);

  const { projectName } = router.query;
  const { startDate, endDate } = router.query;

  return (
    projectName && (
      <MainControls
        projectName={projectName.toString()}
        startDate={startDate && startDate.toString()}
        endDate={startDate && endDate.toString()}
      />
    )
  );
};

export default ProjectPage;
