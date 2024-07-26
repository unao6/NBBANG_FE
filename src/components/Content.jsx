import React from "react";

const Content = ({ children, hideHeaderFooter }) => {
  return (
    <div
      className={`flex-grow overflow-y-auto ${
        !hideHeaderFooter ? "pt-[68px] pb-[68px]" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default Content;
