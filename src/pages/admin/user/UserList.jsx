import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { fetchActiveUsers, fetchInactiveUsers, restoreUserAccount } from '../../../api/user/userApi';

const UserList = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewInactive, setViewInactive] = useState(false);
  const [hoveredPhone, setHoveredPhone] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(0); // 현재 페이지 번호
  const [size] = useState(10); // 페이지 당 항목 수
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = viewInactive
        ? await fetchInactiveUsers(page, size)
        : await fetchActiveUsers(page, size);

      if (viewInactive) {
        setInactiveUsers(response.content);
      } else {
        setActiveUsers(response.content);
      }
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, [viewInactive, page, size]);

  const handleViewActive = () => setViewInactive(false);
  const handleViewInactive = () => setViewInactive(true);

  const handleRestoreUser = async (email) => {
    try {
      await restoreUserAccount(email);

      const userToRestore = inactiveUsers.find(user => user.email === email);
      setActiveUsers([...activeUsers, { ...userToRestore, deleted: false }]);
      setInactiveUsers(inactiveUsers.filter(user => user.email !== email));
    } catch (err) {
      setError(err);
    }
  };
  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => handlePageClick(i)}
          sx={{
            margin: "0 4px",
            minWidth: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: i === page ? "#e0e0e0" : "transparent",
            color: i === page ? "black" : "inherit",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          {i + 1}
        </Button>
      );
    }
    return pages;
  };

  const handleRoleChange = (event) => {
    setRoleFilter(event.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const filteredUsers = (viewInactive ? inactiveUsers : activeUsers).filter(user => {
    if (roleFilter === 'all') return true;
    if (roleFilter === 'admin' && user.role === 'ROLE_ADMIN') return true;
    if (roleFilter === 'user' && user.role === 'ROLE_USER') return true;
    return false;
  });

  const formatDateTimeFromArray = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
  };

  const getStatus = (deleted) => {
    return deleted ? '탈퇴' : '활성';
  };

  const maskPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-****");
  };

  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">회원 관리</h1>
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <button
            onClick={handleViewActive}
            className={`px-4 py-2 rounded ${!viewInactive ? 'bg-primary text-white hover:bg-accent' : 'bg-gray-300 hover:bg-gray-400'}`}
          >
            가입된 회원 보기
          </button>
          <button
            onClick={handleViewInactive}
            className={`px-4 py-2 rounded ${viewInactive ? 'bg-primary text-white hover:bg-accent' : 'bg-gray-300 hover:bg-gray-400'}`}
          >
            탈퇴한 회원 보기
          </button>
        </div>
        <div>
          <select
            value={roleFilter}
            onChange={handleRoleChange}
            className="px-4 py-2 border rounded pr-8 "
          >
            <option value="all">전체</option>
            <option value="admin">관리자</option>
            <option value="user">유저</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                회원 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이메일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                닉네임
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                휴대폰 번호
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가입 날짜
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              {viewInactive && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  복구
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(filteredUsers) && filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.nickname}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  style={{ width: '150px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  onMouseEnter={() => setHoveredPhone(user.id)}  // 마우스 오버 시 user.id로 상태 변경
                  onMouseLeave={() => setHoveredPhone(null)}     // 마우스가 떠나면 상태 초기화
                >
                  {hoveredPhone === user.id
                    ? formatPhoneNumber(user.phoneNumber)
                    : maskPhoneNumber(user.phoneNumber)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTimeFromArray(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getStatus(user.deleted)}
                </td>
                {viewInactive && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleRestoreUser(user.email)}
                      className="bg-primary text-white px-4 py-2 rounded"
                    >
                      복구
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <IconButton
            onClick={handlePreviousPage}
            disabled={page === 0}
            sx={{
              backgroundColor: "#e0e0e0",
              marginRight: "8px",
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          {renderPageNumbers()}
          <IconButton
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            sx={{
              backgroundColor: "#e0e0e0",
              marginLeft: "8px",
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
    </div>
  );
};

export default UserList;