import HomeIcon from "@mui/icons-material/Home";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import React from "react";

const AdminContainer = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재위치와 동일한 메뉴를 눌렀을때 새로고침하도록 설정
  const handleNavigation = (path) => {
    if (location.pathname === path) {
      window.location.reload();
    } else {
      navigate(path);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-52 flex-shrink-0 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold">관리자 페이지</h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <NavLink
                to="/admin/payments"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
                activeClassName="bg-gray-200"
                onClick={() => handleNavigation('/admin/payments')}
              >
                결제 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/refunds"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
                activeClassName="bg-gray-200"
                onClick={() => handleNavigation('/admin/refunds')}
              >
                환불 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
                activeClassName="bg-gray-200"
                onClick={() => handleNavigation('/admin/users')}
              >
                회원 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/ott"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
                activeClassName="bg-gray-200"
                onClick={() => handleNavigation('/admin/ott')}
              >
                OTT 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/parties"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
                activeClassName="bg-gray-200"
                onClick={() => handleNavigation('/admin/parties')}
              >
                파티 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/chat"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
                activeClassName="bg-gray-200"
                onClick={() => handleNavigation('/admin/chat')}
              >
                채팅 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/notification/email"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
                activeClassName="bg-gray-200"
                onClick={() => handleNavigation('/admin/notification/email')}
              >
                이메일 발송
              </NavLink>
            </li>
            <li className="mt-8">
              <NavLink
                to="/"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 flex items-center"
              >
                <HomeIcon className="mr-2" />
                홈화면으로 돌아가기
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4 max-w-7xl mx-auto" style={{ overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

export default AdminContainer;
