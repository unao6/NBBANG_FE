import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { IconButton } from "@mui/material";
import React from "react";

const Header = () => {
  return (
    <header className="h-[68px] w-full max-w-[540px] fixed top-0 left-1/2 transform -translate-x-1/2 bg-white z-50">
      <div className="bg-yellow-300 h-full flex items-center justify-between px-4">
        <div>Header</div>
        <IconButton
          href="/admin/payments"
          aria-label="admin"
          className="text-black"
        >
          <AdminPanelSettingsIcon />
        </IconButton>
      </div>
    </header>
  );
};

export default Header;
