import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { fetchArchivedChats } from '../../../api/chat/chatApi';
import CircularProgress from '@mui/material/CircularProgress';

const ArchivedChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');
  const chatsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await fetchArchivedChats();
        setChats(data);
      } catch (error) {
        setError('Failed to fetch chats');
      } finally {
        setLoading(false);
      }
    };
    loadChats();
  }, []);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleChatClick = (archivedId) => {
    navigate(`/admin/chat/${archivedId}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0); // Reset to first page when search term changes
  };

  const filteredChats = chats.filter((chat) => {
    const matchesStatus =
      filter === 'ALL' ||
      (filter === 'ONGOING' && chat.status) ||
      (filter === 'ENDED' && !chat.status);
    const matchesSearch = chat.user.nickname
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pageCount = Math.ceil(filteredChats.length / chatsPerPage);

  const displayChats = filteredChats.slice(
    currentPage * chatsPerPage,
    (currentPage + 1) * chatsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="p-6 h-full overflow-y-auto bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">채팅 관리</h1>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="닉네임 검색"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-64 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="ALL">전체</option>
          <option value="ONGOING">진행중</option>
          <option value="ENDED">종료됨</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                사용자 닉네임
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                마지막 메시지
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                종료일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayChats.map((chat) => (
              <tr key={chat.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {chat.user.nickname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {chat.lastMessage}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      chat.status
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {chat.status ? '진행중' : '종료됨'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(chat.endedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleChatClick(chat.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    열기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'flex justify-center mt-6'}
        activeClassName={'font-bold text-blue-500'}
        pageClassName={'mx-1'}
        previousClassName={'mx-1'}
        nextClassName={'mx-1'}
        breakClassName={'mx-1'}
        pageLinkClassName={
          'text-sm px-2 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 transition-colors duration-300'
        }
        previousLinkClassName={
          'text-sm px-2 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 transition-colors duration-300'
        }
        nextLinkClassName={
          'text-sm px-2 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 transition-colors duration-300'
        }
        breakLinkClassName={
          'text-sm px-2 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 transition-colors duration-300'
        }
      />
    </div>
  );
};

export default ArchivedChatList;
