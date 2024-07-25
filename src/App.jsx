import "./index.css";

import AdminContainer from "./pages/admin/AdminContainer";
import Container from "./components/Container";
import Content from "./components/Content";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import React from "react";
import Router from "./Router";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const hideHeaderFooter = [
    "/payment/kakaopay/register",
    "/payment/card/register",
    "/payment/kakaopay/approve",
  ].includes(location.pathname);

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="App font-pre">
      {isAdminPage ? (
        <AdminContainer>
          <Router />
        </AdminContainer>
      ) : (
        <Container>
          {!hideHeaderFooter && <Header />}
          <Content>
            <Router />
          </Content>
          {!hideHeaderFooter && <Footer />}
        </Container>
      )}
    </div>
  );
}

export default App;
