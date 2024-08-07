import React from "react";
import { Link } from "react-router-dom";

const FooterLink = ({ href, children }) => {
  return (
    <Link
      to={href}
      className="text-gray-400 no-underline font-medium relative group"
    >
      <span className="transition-all duration-300 group-hover:text-black">
        {children}
      </span>
      <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-yellow-300 rounded-full transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
};

const Footer = () => {
  return (
    <footer className="h-[68px] w-full max-w-[540px] fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white z-50">
      <div className="h-full flex items-center justify-around border-t border-gray-200">
        <FooterLink href="/">소개</FooterLink>
        <FooterLink href="/add-party">파티추가</FooterLink>
        <FooterLink href="/my-party">MY파티</FooterLink>
        <FooterLink href="/guide">가이드</FooterLink>
      </div>
    </footer>
  );
};

export default Footer;
