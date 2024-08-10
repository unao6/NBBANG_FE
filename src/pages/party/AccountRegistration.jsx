import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createParty } from "../../api/party/partyApi";
import { getOttImage } from "../../components/OttImage.js";
import useOttStore from "../../store/ottStore";

const AccountRegistration = () => {
  const { ottId } = useParams();
  const { ottInfo, setOttInfo } = useOttStore();
  const navigate = useNavigate();
  const [ottAccount, setOttAccount] = useState("");
  const [password, setPassword] = useState("");
  const [partyCreated, setPartyCreated] = useState(false);

  useEffect(() => {
    if (!ottInfo) {
      setOttInfo(ottId);
    }
  }, [ottId, ottInfo, setOttInfo]);

  if (!ottInfo) {
    return <div>Loading...</div>;
  }

  const { name } = ottInfo;
  const ottImage = getOttImage(name);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const partyData = {
      ottId,
      ottAccountId: ottAccount,
      ottAccountPassword: password,
    };

    try {
      await createParty(partyData);
      setPartyCreated(true);
    } catch (error) {
      console.error("파티 생성 중 오류 발생:", error);
      alert("파티 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (partyCreated) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center bg-gray-100 p-2">
        <main className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">{name} 파티 생성</h2>
          <img
            src={ottImage}
            alt={`${name} 파티 생성 성공 이미지`}
            className="mx-auto my-8 w-32 h-32 object-contain"
          />
          <p className="text-2xl font-bold">{name} 파티가 생성됐습니다!</p>
          <p className="text-gray-500 mt-2">
            이제 더 저렴한 금액으로 {name}을 즐길 수 있어요
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-green-500 text-white py-2 px-32 rounded-full shadow-lg hover:bg-green-600 transition duration-200"
          >
            홈으로 이동
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col items-center bg-gray-100 p-2">
      <main className="w-full max-w-2xl mx-auto mt-2 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-center">
          계정을 등록해주세요
        </h2>

        {/* OTT 정보 표시 */}
        <div className="bg-white p-4 rounded-lg mb-6 flex items-center shadow-md">
          <img src={ottImage} alt={name} className="w-20 h-20 object-contain" />
          <div className="ml-4 text-green-500 text-sm">
            <p className="font-bold">{name} 프리미엄 이용권</p>
            <p>구독 중인 계정</p>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="bg-yellow-100 p-4 rounded-lg mb-6">
          <h4 className="text-yellow-800 font-semibold">주의사항</h4>
          <p className="text-sm mt-2">
            {name} ID로 가입한 계정만 공유가 가능합니다.
          </p>
        </div>

        {/* 계정 입력 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="ottAccount"
              className="block text-gray-700 font-semibold mb-2"
            >
              ID
            </label>
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
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              PW
            </label>
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
