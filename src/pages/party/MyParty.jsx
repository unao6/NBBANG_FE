import React, { useEffect, useState } from 'react';

import { getMyParty } from '../../api/party/partyApi'; // API 함수 import
import { getOttImage } from '../../components/OttImage.js'; // OTT 이미지 함수 import
import { useNavigate } from 'react-router-dom';

const MyParty = () => {
  const [myParties, setMyParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPartyData = async () => {
      try {
        const response = await getMyParty(); // API 호출
        setMyParties(response.data); // 서버에서 받아온 데이터를 상태로 설정
      } catch (error) {
        console.error('파티 정보를 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false); // 데이터를 불러온 후 로딩 상태 해제
      }
    };

    fetchMyPartyData();
  }, []);

  const handlePartyClick = (partyId) => {
    navigate(`/my-party/${partyId}`); // 클릭 시 해당 파티의 상세 페이지로 이동
  };

  if (loading) {
    return <div className="min-h-full flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <main className="container mx-auto mt-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {myParties.length > 0 ? (
          myParties.map(party => (
            <div
              key={party.partyId}
              className="flex items-center justify-between p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              onClick={() => handlePartyClick(party.partyId)} // 파티 클릭 이벤트 설정
            >
              <div className="flex items-center">
                <img
                  src={getOttImage(party.name)}
                  alt={party.name}
                  className="w-12 h-12 object-contain rounded-full mr-4"
                />
                <div>
                  <h3 className="text-base font-bold text-gray-800">{party.name} 파티</h3>
                </div>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 p-4">이용 중인 파티가 없습니다.</p>
        )}

        {/* 파티 추가 버튼 */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          onClick={() => navigate('/add-party')}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full mr-4">
              <span className="text-2xl text-gray-500">+</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">파티 추가</h3>
              <p className="text-sm text-gray-500">새로운 파티를 이용해보세요</p>
            </div>
          </div>
          <span className="text-gray-400">&gt;</span>
        </div>
      </div>
    </main>
  );
};

export default MyParty;
