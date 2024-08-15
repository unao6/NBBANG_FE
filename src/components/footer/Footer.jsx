import { Link, useNavigate } from "react-router-dom";
import React from "react";

const FooterLink = ({ to, children, requireAuth }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    const token = localStorage.getItem("access");
    if (requireAuth && !token) {
      e.preventDefault(); // 링크의 기본 동작을 막습니다.
      navigate("/login"); // 로그인 페이지로 리디렉션합니다.
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className="text-gray-400 no-underline font-medium relative group"
    >
      <span className="transition-all duration-300 group-hover:text-black">
        {children}
      </span>
      <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-primary rounded-full transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
};

const Footer = () => {
  return (
    <footer className="h-[68px] w-full max-w-[540px] fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white z-50">
      <div className="h-full flex items-center justify-around border-t border-gray-200">
        <FooterLink to="/" requireAuth={false}>소개</FooterLink>
        <FooterLink to="/add-party" requireAuth={true}>파티추가</FooterLink>
        <FooterLink to="/my-party" requireAuth={true}>MY파티</FooterLink>
        <FooterLink to="/guide" requireAuth={false}>가이드</FooterLink>
      </div>
    </footer>
  );
};

export default Footer;