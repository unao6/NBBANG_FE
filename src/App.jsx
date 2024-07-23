import "./index.css";

import { BrowserRouter } from "react-router-dom";
import Container from "./components/Container";
import Content from "./components/Content";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import React from "react";
import Router from "./Router";

function App() {
  return (
    <div className="App font-pre">
      <BrowserRouter>
        <Container>
          <Header />
          <Content>
            <Router />
          </Content>
          <Footer />
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
