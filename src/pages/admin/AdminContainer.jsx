import { NavLink, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import React, { useState, useEffect } from "react";
import { fetchNewMessagesCount } from "../../api/chat/chatApi";

const AdminContainer = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  // 현재위치와 동일한 메뉴를 눌렀을때 새로고침하도록 설정
  const handleNavigation = (path) => {
    if (location.pathname === path) {
      window.location.reload();
    } else {
      navigate(path);
    }
  };

  // 새로운 메시지 카운트를 가져오는 함수
  const updateNewMessagesCount = async () => {
    try {
      const newMessagesData = await fetchNewMessagesCount();
      const totalNewMessages = Object.values(newMessagesData).reduce((sum, count) => sum + count, 0);
      setNewMessagesCount(totalNewMessages);
    } catch (error) {
      console.error("Failed to fetch new messages count", error);
    }
  };

  useEffect(() => {
    updateNewMessagesCount(); 
  }, [location]);

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
                className={({ isActive }) =>
                  `block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
                onClick={() => handleNavigation("/admin/payments")}
              >
                결제 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/refunds"
                className={({ isActive }) =>
                  `block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
                onClick={() => handleNavigation("/admin/refunds")}
              >
                환불 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
                onClick={() => handleNavigation("/admin/users")}
              >
                회원 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/ott"
                className={({ isActive }) =>
                  `block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
                onClick={() => handleNavigation("/admin/ott")}
              >
                OTT 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/parties"
                className={({ isActive }) =>
                  `block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
                onClick={() => handleNavigation("/admin/parties")}
              >
                파티 조회
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/chat"
                className={({ isActive }) =>
                  `block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
                onClick={() => handleNavigation("/admin/chat")}
              >
                <span>채팅 관리</span>
                  {newMessagesCount > 0 && (
                    <span className="ml-2 text-xs font-semibold text-white bg-red-500 rounded-full px-1 py-0.5">
                      {newMessagesCount}
                    </span>
                  )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/notification/email"
                className={({ isActive }) =>
                  `block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
                onClick={() => handleNavigation("/admin/notification/email")}
              >
                이메일 발송
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/notification/sms"
                className={({ isActive }) =>
                  `block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
                onClick={() => handleNavigation("/admin/notification/sms")}
              >
                문자 발송
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
      <main
        className="flex-1 p-4 max-w-7xl mx-auto"
        style={{ overflowY: "auto" }}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminContainer;
