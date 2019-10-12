import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import EventsPubSub from "./EventsPubSub";

window.PubSub = new EventsPubSub();
document.oncontextmenu = () => false;
ReactDOM.render(<App />, document.getElementById("root"));
serviceWorker.unregister();
