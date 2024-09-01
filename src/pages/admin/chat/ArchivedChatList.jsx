import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchArchivedChats } from '../../../api/chat/chatApi';

const ArchivedChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const chatsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await fetchArchivedChats();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }
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

  const handleChatClick = (chat) => {
    navigate(`/admin/chat/archived/${chat.id}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0); 
  };

  const getUserNickname = (messages) => {
    for (let message of messages) {
      if (message.nickname && !['N/BBANG', 'System'].includes(message.nickname)) {
        return message.nickname;
      }
    }
    return '';
  };

  const getMemoText = (memo) => {
    try {
      const memoObject = JSON.parse(memo);
      return memoObject.memo || '';
    } catch (e) {
      return memo;
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + ' ...';
    }
    return text;
  };

  const filteredChats = chats.filter((chat) => {
    const nickname = getUserNickname(chat.messages);
    const matchesSearch = nickname
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">채팅 아카이브</h1>
        <button
          onClick={() => navigate('/admin/chat')}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition duration-300"
        >
          채팅 목록
        </button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="닉네임 검색"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-64 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm shadow-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                닉네임
              </th>
              <th className="w-3/4 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                저장 메모
              </th>
              <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                상담 종료일
              </th>
              <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                상담 저장일
              </th>
              <th className="w-1/8 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayChats.map((chat) => (
              <tr key={chat.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                  {getUserNickname(chat.messages) || '?'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {truncateText(getMemoText(chat.memo)) || '?'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {chat.endedAt ? new Date(chat.endedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {chat.savedAt ? new Date(chat.savedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <button
                    onClick={() => handleChatClick(chat)}
                    className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition duration-300"
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
        activeClassName={'font-bold text-primary'}
        pageClassName={'mx-1'}
        previousClassName={'mx-1'}
        nextClassName={'mx-1'}
        breakClassName={'mx-1'}
        pageLinkClassName={
          'text-sm px-2 py-1 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-300'
        }
        previousLinkClassName={
          'text-sm px-2 py-1 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-300'
        }
        nextLinkClassName={
          'text-sm px-2 py-1 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-300'
        }
        breakLinkClassName={
          'text-sm px-2 py-1 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-300'
        }
      />
    </div>
  );
};

export default ArchivedChatList;
