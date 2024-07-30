import "./index.css";

import { ThemeProvider, createTheme } from "@mui/material";

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
    "/login",
    "/users/user-login",
    "/users/sign-up",
    "/auth/user-auth"
  ].includes(location.pathname);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#8BC34A",
      },
      secondary: {
        main: "#FF9800",
        light: "#FFEB3B",
        contrastText: "#364D1C",
      },
    },
  });

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="App font-pre h-screen flex flex-col overflow-hidden">
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </div>
  );
}

export default App;
