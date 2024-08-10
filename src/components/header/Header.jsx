import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import axiosInterceptors from "../../api/axiosInterceptors";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem("access");
    if (token) {
      setIsLoggedIn(true);
      try {
        // 사용자 정보를 가져와서 isAdmin 값을 설정
        const response = await axiosInterceptors.get("/api/users/user-info");
        setIsAdmin(response.data.admin);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setIsAdmin(false); // 오류 발생 시 관리자 여부를 false로 설정
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false); // 로그아웃 시 관리자 여부 초기화
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
            <>
              <IconButton
                href="/mypage"
                aria-label="my page"
                className="text-black"
              >
                <AccountCircleIcon />
              </IconButton>
              {isAdmin && (
                <IconButton
                  href="/admin/payments"
                  aria-label="admin"
                  className="text-black ml-2"
                >
                  <AdminPanelSettingsIcon />
                </IconButton>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;