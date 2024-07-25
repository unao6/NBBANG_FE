import { NavLink } from "react-router-dom";
import React from "react";

const AdminContainer = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-48 flex-shrink-0 bg-white shadow-md">
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
              >
                결제 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/refunds"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
                activeClassName="bg-gray-200"
              >
                환불 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
                activeClassName="bg-gray-200"
              >
                회원 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/ott"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
                activeClassName="bg-gray-200"
              >
                OTT 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/parties"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
                activeClassName="bg-gray-200"
              >
                파티 관리
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4 max-w-7xl mx-auto">{children}</main>
    </div>
  );
};

export default AdminContainer;
