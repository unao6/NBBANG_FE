import "./index.css";

import { ThemeProvider, createTheme } from "@mui/material";

import AdminContainer from "./pages/admin/AdminContainer";
import Container from "./components/Container";
import Content from "./components/Content";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import React, { useState, useEffect } from "react";
import Router from "./Router";
import { useLocation, Navigate } from "react-router-dom";
import { checkIfAdmin } from "./api/user/userApi";

function App() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      try {
        const result = await checkIfAdmin();
        setIsAdmin(result);
      } catch (error) {
        console.error('Failed to check admin role:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (location.pathname.startsWith('/admin')) {
      fetchRole();
    } else {
      setIsLoading(false); // /admin이 아닌 페이지에서는 바로 로딩 완료
    }
  }, [location.pathname]);
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
        main: "#504EEE",
        accent: "#462AE3"
      },
      secondary: {
        main: "#FACC15",
        light: "#FFEB3B",
        contrastText: "#364D1C",
      },
    },
    typography: {
      fontFamily: "Pretendard, sans-serif",
    },
  });

  const isAdminPage = location.pathname.startsWith("/admin");

  // 관리자가 아닌 경우 /admin 페이지로 접근 시 리다이렉트
  if (location.pathname.startsWith('/admin') && !isLoading) {
    if (!isAdmin) {
      return <Navigate to="/login" replace />;
    }
  }

  if (isLoading) {
    // 로딩 상태일 때는 로딩 표시 또는 빈 화면
    return <div></div>;
  }

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
