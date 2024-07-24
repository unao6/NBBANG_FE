import "./index.css";

import { BrowserRouter, useLocation } from "react-router-dom";

import Container from "./components/Container";
import Content from "./components/Content";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import React from "react";
import Router from "./Router";

function App() {
  const location = useLocation();
  const hideHeaderFooter = [
    "/payment/kakaopay/register",
    "/payment/card/register",
  ].includes(location.pathname);

  return (
    <div className="App font-pre">
      <Container>
        {!hideHeaderFooter && <Header />}
        <Content>
          <Router />
        </Content>
        {!hideHeaderFooter && <Footer />}
      </Container>
    </div>
  );
}

export default App;
