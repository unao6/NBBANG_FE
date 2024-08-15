import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchAllChats, fetchNewMessagesCount, resetNewMessagesCount } from '../../../api/chat/chatApi';

const AdminChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [newMessages, setNewMessages] = useState({});
  const chatsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await fetchAllChats();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.lastRepliedAt);
          const dateB = new Date(b.lastRepliedAt);
          return dateB - dateA;
        });
        setChats(sortedData);
  
        // 모든 채팅의 새 메시지 수를 한 번에 가져옵니다.
        const newMessagesData = await fetchNewMessagesCount();
        
        // 키를 숫자로 변환
        const parsedNewMessages = Object.fromEntries(
          Object.entries(newMessagesData).map(([key, value]) => [parseInt(key), value])
        );

        setNewMessages(parsedNewMessages);
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

  const handleChatClick = async (chat) => {
    await resetNewMessagesCount(chat.id);
    navigate(`/admin/chat/${chat.id}`, { state: { isChatEnded: !chat.status } });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const welcomeMessageText = 'System: 환영합니다! 문의사항을 남겨주시면 확인 후 답변 드리겠습니다:)';

  const truncateText = (text, maxLength = 50) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + ' ...';
    }
    return text;
  };

  const filteredChats = chats.filter((chat) => {
    const matchesStatus =
      filter === 'ALL' ||
      (filter === 'ONGOING' && chat.status) ||
      (filter === 'ENDED' && !chat.status);

    const matchesSearch = chat.nickname
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const validLastMessage =
      chat.lastMessage !== null && chat.lastMessage !== welcomeMessageText;

    return matchesStatus && matchesSearch && validLastMessage;
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl mb-4">채팅 목록</h1>
        <button
          onClick={() => navigate('/admin/chat/archived/list')}
          className="bg-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300"
        >
          채팅 아카이브
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
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        >
          <option value="ALL">전체</option>
          <option value="ONGOING">상담 중</option>
          <option value="ENDED">상담종료</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                닉네임
              </th>
              <th className="w-3/4 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                최근 메시지
              </th>
              <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                최근 응답 시간
              </th>
              <th className="w-1/8 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>          
              <th className="w-1/8 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayChats.map((chat) => (
              <tr key={chat.id}>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                  {chat.nickname || '?'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {truncateText(chat.lastMessage) || '?'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {chat.lastRepliedAt ? (
                    new Date(chat.lastRepliedAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      chat.status
                        ? 'bg-green-50 text-accent'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {chat.status ? '상담 중' : '상담 종료'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleChatClick(chat)}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-accent transition duration-300 relative"
                  >
                    열기
                    {(newMessages[chat.id] || 0) > 0 && (
                      <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/3 text-xs font-semibold text-white bg-red-500 rounded-full px-2 py-1">
                        {newMessages[chat.id]}
                      </span>
                    )}
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

export default AdminChatList;
