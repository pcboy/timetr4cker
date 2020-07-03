import * as React from "react";
import ReactDOM from "react-dom";
import { MobxRouter, RouterStore, startRouter } from "mobx-router";
import routes from "./config/routes";

import { entryStore } from "./stores/EntryStore";

export class AppStore {
  entryStore;
}

export class RootStore {
  public router: RouterStore<RootStore>;
  public app: AppStore;

  constructor() {
    this.router = new RouterStore<RootStore>(this);
    this.app = new AppStore();
  }
}

const store = new RootStore();

export const StoreContext = React.createContext(store);
const StoreProvider = StoreContext.Provider;

startRouter(routes, store);

ReactDOM.render(
  <StoreProvider value={store}>
    <MobxRouter store={store} />
  </StoreProvider>,
  document.getElementById("root")
);
