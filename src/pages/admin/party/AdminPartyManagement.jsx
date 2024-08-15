import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import { getPartyByAdmin, searchPartyByEmail } from "../../../api/party/partyApi.js";

const AdminPartyManagement = () => {
  const [partyData, setPartyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [page, setPage] = useState(0); // 초기 페이지는 0 (첫 페이지)
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0); // 전체 항목 수
  const chatsPerPage = 5;

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
        if (reset) {
          setTotalItems(response.totalItems); // 서버에서 전체 항목 수를 받아옴
        }
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
    fetchPartyData(true);
  }, [page]);

  const handleSearch = () => {
    setPage(0); // 페이지를 초기화
    setPartyData([]); // 기존 데이터를 초기화
    setHasMore(true); // 추가 데이터 로드 가능 상태로 설정
    fetchPartyData(true); // 검색 데이터를 가져옴
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const pageCount = Math.max(Math.ceil(totalItems / chatsPerPage), 1); // 전체 페이지 수 계산, 최소 1페이지

  return (
    <div className="container mx-auto p-4 md:px-4">
      <h1 className="text-2xl mb-6">파티 조회</h1>

      <div className="mb-4 flex">
        <input
          type="text"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          placeholder="이메일로 검색"
          className="p-2 border border-gray-300 rounded w-1/3 mr-2 focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          onClick={handleSearch}
          className="bg-primary text-white mx-2 p-2 pl-4 pr-4 rounded hover:bg-accent "
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
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-bold mb-4">{party.ottName}</h2>
              <table className="table-fixed w-full text-md">
                <thead>
                  <tr className="bg-gray-100 text-sm ">
                    <th className="w-1/6 px-4 text-left font-normal">Role</th>
                    <th className="w-1/4 px-4 text-left font-normal">Nickname</th>
                    <th className="w-1/4 px-4 text-left font-normal">Email</th>
                    <th className="w-1/4 px-4 text-left font-normal">Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-1">파티장</td>
                    <td className="border px-4 py-1">{party.leaderNickname}</td>
                    <td className="border px-4 py-1">{party.leaderEmail}</td>
                    <td className="border px-4 py-1">{party.leaderPhoneNumber}</td>
                  </tr>
                  {party.members.map((member, memberIndex) => (
                    <tr key={memberIndex}>
                      <td className="border px-4 py-1">파티원</td>
                      <td className="border px-4 py-1">{member.partyMemberNickname}</td>
                      <td className="border px-4 py-1">{member.partyMemberEmail}</td>
                      <td className="border px-4 py-1">{member.partyMemberPhoneNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {loading && <div className="text-center">로딩 중...</div>}
        </div>
      )}
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={Math.max(pageCount, 1)} // 최소 페이지 수를 1로 설정
        marginPagesDisplayed={1} // 페이지네이션에 항상 1 이상의 페이지가 표시되도록 설정
        pageRangeDisplayed={1}   // 페이지 범위를 1로 설정 (1페이지만 표시)
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
        forcePage={page} // 현재 페이지를 명시적으로 설정
      />

    </div>
  );
};

export default AdminPartyManagement;
