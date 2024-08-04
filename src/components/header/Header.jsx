import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("access");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    // 페이지 로드 시 로그인 여부를 확인
    checkLoginStatus();

    // localStorage 변경 감지
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <header className="h-[68px] w-full max-w-[540px] fixed top-0 left-1/2 transform -translate-x-1/2 bg-white z-50 shadow">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center">
          <a href="/" className="text-black no-underline">
            <span className="text-2xl font-bold">N/BBANG</span>
          </a>
        </div>
        <div className="flex items-center">
          {!isLoggedIn ? (
            <IconButton href="/login" aria-label="login" className="text-black">
              <AccountCircleIcon />
            </IconButton>
          ) : (
            <IconButton
              href="/mypage"
              aria-label="my page"
              className="text-black"
            >
              <AccountCircleIcon />
            </IconButton>
          )}
          <IconButton
            href="/admin/payments"
            aria-label="admin"
            className="text-black ml-2"
          >
            <AdminPanelSettingsIcon />
          </IconButton>
        </div>
      </div>
    </header>
  );
};

export default Header;