import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useOttStore from "../../store/ottStore";

const AddParty = () => {
  const { ottId } = useParams();
  const { setOttInfo } = useOttStore();
  const [role, setRole] = useState("partyLeader");
  const [showImage, setShowImage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setOttInfo(ottId);
  }, [ottId, setOttInfo]);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleNextClick = async () => {
    if (role === "partyLeader") {
      navigate(`/party-leader-step/${ottId}`);
    } else if (role === "partyMember") {
      navigate(`/party-member-step/${ottId}`);
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center bg-gray-50">
      {!showImage ? (
        <main className="w-full max-w-lg mx-auto mt-2 p-6 bg-white rounded shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            이용 역할 선택
          </h2>
          <div className="flex justify-between items-center mb-6 gap-4">
            <div
              className={`flex flex-col items-center p-5 w-full rounded-xl cursor-pointer transition-transform transform hover:scale-105 ${
                role === "partyLeader"
                  ? "bg-indigo-100 border-2 border-primary"
                  : "bg-gray-100"
              }`}
              onClick={() => handleRoleSelect("partyLeader")}
            >
              <span className="text-accent font-bold mb-2">파티장</span>
              <span className="text-center text-sm text-gray-600">
                내 계정을 공유하고 싶어요
              </span>
            </div>
            <div
              className={`flex flex-col items-center p-5 w-full rounded-xl cursor-pointer transition-transform transform hover:scale-105 ${
                role === "partyMember"
                  ? "bg-indigo-100 border-2 border-primary"
                  : "bg-gray-100"
              }`}
              onClick={() => handleRoleSelect("partyMember")}
            >
              <span className="text-accent font-bold mb-2">파티원</span>
              <span className="text-center text-sm text-gray-600">
                계정을 공유받고 싶어요
              </span>
            </div>
          </div>

          {role === "partyLeader" && (
            <>
              <h3 className="text-gray-800 font-bold mb-3">파티장 혜택</h3>
              <ul className="list-none mb-6">
                <li className="flex items-start mb-2">
                  <span className="mr-2 text-primary">✔</span>
                  <span className="text-gray-700">50% 더 저렴한 이용</span>
                </li>
                <li className="flex items-start mb-2">
                  <span className="mr-2 text-primary">✔</span>
                  <span className="text-gray-700">
                    파티원이 구해지지 않아도 안심!
                  </span>
                </li>
                <li className="flex items-start mb-2">
                  <span className="mr-2 text-primary">✔</span>
                  <span className="text-gray-700">지금 즉시 시청 시작</span>
                </li>
                <li className="flex items-start mb-2">
                  <span className="mr-2 text-primary">✔</span>
                  <span className="text-gray-700">
                    매월 자동 정산 서비스 제공
                  </span>
                </li>
              </ul>
            </>
          )}

          {role === "partyMember" && (
            <>
              <h3 className="text-gray-800 font-bold mb-3">파티원 혜택</h3>
              <ul className="list-none mb-6">
                <li className="flex items-start mb-2">
                  <span className="mr-2 text-primary">✔</span>
                  <span className="text-gray-700">
                    공유받은 계정으로 부담없이 이용
                  </span>
                </li>
                <li className="flex items-start mb-2">
                  <span className="mr-2 text-primary">✔</span>
                  <span className="text-gray-700">
                    언제든 남은 기간만큼 환불 가능
                  </span>
                </li>
                <li className="flex items-start mb-2">
                  <span className="mr-2 text-primary">✔</span>
                  <span className="text-gray-700">
                    피클만의 제일 빠른 매칭 시스템
                  </span>
                </li>
                <br />
              </ul>
            </>
          )}

          <h3 className="text-gray-800 font-bold mb-3">공통 혜택</h3>
          <ul className="list-none mb-6">
            <li className="flex items-start mb-2">
              <span className="mr-2 text-primary">✔</span>
              <span className="text-gray-700">
                시청 기록 · 내 정보 · 프라이버시 보호
              </span>
            </li>
            <li className="flex items-start mb-2">
              <span className="mr-2 text-primary">✔</span>
              <span className="text-gray-700">KB 안전거래 서비스로 정산</span>
            </li>
            <li className="flex items-start mb-2">
              <span className="mr-2 text-primary">✔</span>
              <span className="text-gray-700">
                연락이 필요하면 '안심 번호' 쪽지
              </span>
            </li>
          </ul>

          <button
            className="mt-6 bg-primary text-white py-3 px-8 rounded-full shadow-lg w-full hover:bg-accent transition-all duration-300"
            onClick={handleNextClick}
          >
            {role === "partyLeader"
              ? "파티장으로 이용하기"
              : "파티원으로 이용하기"}
          </button>
        </main>
      ) : (
        <div className="flex flex-col items-center justify-center mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            파티 매칭이 시작되었어요!
          </h2>
          <button
            className="mt-4 bg-primary text-white py-3 px-8 rounded-full shadow-lg hover:bg-accent transition-all duration-300"
            onClick={() => navigate("/next-page")}
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
};

export default AddParty;
