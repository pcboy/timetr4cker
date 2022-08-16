import { types } from "mobx-state-tree";
import * as React from "react";
import { ProjectStore } from "./ProjectStore";
import { UiStore } from "./UiStore";

export const RootStore = types.model("RootStore", {
  projectStore: types.optional(ProjectStore, () => ProjectStore.create({})),
  uiStore: types.optional(UiStore, () => UiStore.create({})),
});

export const rootStore = RootStore.create({});

export const RootStoreContext = React.createContext(rootStore);
