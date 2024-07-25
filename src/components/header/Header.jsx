import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { IconButton } from "@mui/material";
import React from "react";

const Header = () => {
  return (
    <header className="h-[68px] w-full max-w-[540px] fixed bg-white">
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
