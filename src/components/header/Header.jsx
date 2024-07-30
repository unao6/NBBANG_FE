import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { IconButton } from "@mui/material";
import React from "react";

const Header = () => {
  return (
    <header className="h-[68px] w-full max-w-[540px] fixed top-0 left-1/2 transform -translate-x-1/2 bg-white z-50 shadow">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center">
          <a href="/" className="text-black no-underline">
            <span className="text-2xl font-bold">N/BBANG</span>
          </a>
        </div>
        <div className="flex items-center">
          <IconButton href="/login" aria-label="login" className="text-black">
            <AccountCircleIcon />
          </IconButton>
          <IconButton
            href="/mypage"
            aria-label="my page"
            className="text-black"
          >
            <AccountCircleIcon />
          </IconButton>
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
