import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axiosInterceptors from '../../../api/axiosInterceptors';

const UserList = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewInactive, setViewInactive] = useState(false);
  const [hoveredPhone, setHoveredPhone] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const activeResponse = await axiosInterceptors.get('/api/admin/active');
        const inactiveResponse = await axiosInterceptors.get('/api/admin/inactive');

        setActiveUsers(activeResponse.data);
        setInactiveUsers(inactiveResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewActive = () => setViewInactive(false);
  const handleViewInactive = () => setViewInactive(true);

  const handleRestoreUser = async (email) => {
    try {
      await axiosInterceptors.put(`/api/admin/restore-account/${email}`);

      // 복구된 회원을 활성 회원 목록으로 이동
      const userToRestore = inactiveUsers.find(user => user.email === email);
      setActiveUsers([...activeUsers, { ...userToRestore, deleted: false }]);
      setInactiveUsers(inactiveUsers.filter(user => user.email !== email));
    } catch (err) {
      setError(err);
    }
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

  // 역할 필터링을 적용한 사용자 목록
  const filteredUsers = (viewInactive ? inactiveUsers : activeUsers).filter(user =>
    roleFilter === 'all' || user.role === roleFilter
  );

  // 배열로 된 날짜 데이터를 yyyy.MM.dd HH:mm:ss 형식으로 포맷하는 함수
  const formatDateTimeFromArray = (dateArray) => {
    if (Array.isArray(dateArray) && dateArray.length >= 6) {
      const [year, month, day, hour, minute, second] = dateArray;
      return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
    }
    return 'Invalid Date';
  };

  const getStatus = (deleted) => {
    return deleted ? '탈퇴' : '활성';
  };

  // 휴대폰 번호를 마스킹하는 함수
  const maskPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-****");
  };

  // 휴대폰 번호를 포맷팅하는 함수 (마우스 오버 시 전체 번호 표시)
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
            className={`px-4 py-2 rounded ${!viewInactive ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            가입된 회원 보기
          </button>
          <button
            onClick={handleViewInactive}
            className={`px-4 py-2 rounded ${viewInactive ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            탈퇴한 회원 보기
          </button>
        </div>
        <div>
          <select
            value={roleFilter}
            onChange={handleRoleChange}
            className="px-4 py-2 border rounded pr-8"
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
                  style={{ width: '150px' }}
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
                      className="bg-green-500 text-white px-4 py-2 rounded"
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
    </div>
  );
};

export default UserList;