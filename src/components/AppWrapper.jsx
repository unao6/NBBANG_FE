import App from "../App";
import { BrowserRouter } from "react-router-dom";
import React from "react";

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
