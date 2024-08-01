import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useOttStore from '../../store/ottStore';  // Zustand 스토어 import
import { getOttImage } from '../../components/OttImage.js';
import { createParty } from '../../api/party/partyApi';  // 파티 생성 API 함수 import

const AccountRegistration = () => {
  const { ottId } = useParams(); // URL 파라미터로 ottId 받아오기
  const { ottInfo, setOttInfo } = useOttStore(); // Zustand 스토어의 상태와 함수 사용
  const navigate = useNavigate();
  const [ottAccount, setOttAccount] = useState(''); // OTT ID 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태

  useEffect(() => {
    if (!ottInfo) {
      setOttInfo(ottId);  // OTT 정보를 Zustand 스토어에 설정
    }
  }, [ottId, ottInfo, setOttInfo]);

  if (!ottInfo) {
    // 데이터가 로드될 때까지 로딩 상태를 표시
    return <div>Loading...</div>;
  }

  const { name } = ottInfo; // OTT 정보 구조 분해 할당
  const ottImage = getOttImage(name); // OTT 이름을 기반으로 이미지 가져오기

  const handleSubmit = async (event) => {
    event.preventDefault();

    const partyData = {
      ottId,
      accountId: ottAccount,
      accountPassword: password,
    };

    try {
      await createParty(partyData);  // 파티 생성 API 호출
      alert('계정이 등록되었습니다.');
      navigate('/some-next-step');  // 다음 단계로 이동
    } catch (error) {
      console.error('파티 생성 중 오류 발생:', error);
      alert('파티 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <main className="w-full max-w-lg mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">마지막으로, 계정을 등록해주세요!</h2>

        {/* OTT 정보 표시 */}
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="text-center text-green-500">계정을 준비해주세요</h3>
          <div className="flex justify-center items-center mt-2">
            <img src={ottImage} alt={name} className="w-16 h-16" />
            <span className="ml-4 text-green-500">{name} 프리미엄 이용권<br />구독중인 계정</span>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="bg-yellow-100 p-4 rounded-lg mb-4">
          <h4 className="text-yellow-800 font-semibold">주의해주세요</h4>
          <p className="text-sm mt-2">{name} ID로 가입한 계정만 공유가 가능해요.</p>
        </div>

        {/* 계정 입력 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="ottAccount" className="block text-gray-700 font-semibold mb-2">ID</label>
            <input
              type="text"
              id="ottAccount"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={`${name} 아이디 입력`}
              value={ottAccount}
              onChange={(e) => setOttAccount(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">PW</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={`${name} 비밀번호 입력`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 체크박스 및 경고 */}
          <div className="mb-4 text-sm text-gray-600">
            <p>✔ 공유 가능한 안전한 비밀번호를 사용해주세요.</p>
          </div>

          {/* 버튼 */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
          >
            파티 생성하기
          </button>
        </form>
      </main>
    </div>
  );
};

export default AccountRegistration;
