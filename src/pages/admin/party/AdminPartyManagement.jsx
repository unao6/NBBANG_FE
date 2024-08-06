import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getPartyByAdmin, searchPartyByEmail } from "../../../api/party/partyApi.js";

const AdminPartyManagement = () => {
  const [partyData, setPartyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const fetchPartyData = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      let response;
      if (searchEmail) {
        response = await searchPartyByEmail(searchEmail, page);
      } else {
        response = await getPartyByAdmin(page);
      }

      if (response.data.length > 0) {
        setPartyData(prevData => reset ? response.data : [...prevData, ...response.data]);
      } else {
        setHasMore(false); // 데이터가 더 이상 없으면 추가 로딩 중단
      }
    } catch (error) {
      console.error('파티 정보를 불러오는 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  }, [page, searchEmail]);

  useEffect(() => {
    if (page === 0) {
      fetchPartyData(true); // 초기 데이터 로드 또는 검색어가 변경될 때 데이터 초기화
    } else {
      fetchPartyData(); // 추가 데이터 로드
    }
  }, [page, fetchPartyData]);

  const handleSearch = () => {
    setPage(0); // 페이지를 초기화
    setPartyData([]); // 기존 데이터를 초기화
    setHasMore(true); // 추가 데이터 로드 가능 상태로 설정
    fetchPartyData(true); // 데이터를 다시 가져옴
  };

  const lastPartyElementRef = (node) => {
    if (loading || !hasMore) return;

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  return (
    <div className="container mx-auto mt-8 px-4 md:px-0">
      <h1 className="text-2xl font-bold mb-4">파티 관리</h1>

      <div className="mb-4 flex">
        <input
          type="text"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          placeholder="이메일로 검색"
          className="p-2 border border-gray-300 rounded flex-grow mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded"
        >
          검색
        </button>
      </div>

      {partyData.length === 0 && !loading ? (
        <div>해당 이메일과 관련된 파티가 없습니다.</div>
      ) : (
        <div className="space-y-4">
          {partyData.map((party, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-row justify-between items-center"
              ref={partyData.length === index + 1 ? lastPartyElementRef : null}
            >
              <div className="flex flex-col w-1/3">
                <h2 className="text-xl font-bold mb-2">{party.ottName}</h2>
                <p><strong>파티장:</strong> {party.leaderNickname} ({party.leaderEmail})</p>
                <p><strong>전화번호:</strong> {party.leaderPhoneNumber}</p>
              </div>
              <div className="flex-grow border-l-2 border-gray-200 pl-6">
                <h3 className="text-lg font-semibold mb-2">파티원 목록:</h3>
                <ul className="list-disc list-inside">
                  {party.members.map((member, memberIndex) => (
                    <li key={memberIndex}>
                      {member.partyMemberNickname} ({member.partyMemberEmail}) - {member.partyMemberPhoneNumber}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          {loading && <div className="text-center">로딩 중...</div>}
        </div>
      )}
    </div>
  );
};

export default AdminPartyManagement;
