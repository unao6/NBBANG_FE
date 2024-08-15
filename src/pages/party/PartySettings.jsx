import React, { useState } from "react";
import { partyBreakUp, updateOttAccount } from "../../api/party/partyApi";
import { useLocation, useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PartySettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { partyDetails } = location.state || {};

  const [ottAccountId, setOttAccountId] = useState(
    partyDetails?.ottAccountId || ""
  );
  const [ottAccountPassword, setOttAccountPassword] = useState(
    partyDetails?.ottAccountPassword || ""
  );
  const [open, setOpen] = useState(false);
  const partyId = partyDetails?.partyId;
  const leaderFee = 200;
  const settlementAmount =
    (partyDetails.ottPrice / partyDetails.capacity) * 3 - leaderFee;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}월 ${String(date.getDate()).padStart(2, "0")}일`;
  };

  if (!partyDetails) {
    return <div>파티 정보를 불러올 수 없습니다.</div>;
  }

  const handleAccountChange = async () => {
    try {
      const partyUpdateRequest = {
        ottAccountId,
        ottAccountPassword,
      };

      await updateOttAccount(partyId, partyUpdateRequest);

      alert("계정 정보가 성공적으로 변경되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error("계정 정보를 변경하는 중 오류가 발생했습니다:", error);
      alert("계정 정보 변경 중 오류가 발생했습니다.");
    }
  };

  const handlePartyDisband = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDisband = async () => {
    try {
      await partyBreakUp(partyId);
      alert("파티가 성공적으로 해체되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("파티 해체 중 오류가 발생했습니다:", error);
      alert("파티 해체 중 오류가 발생했습니다.");
    }
    setOpen(false);
  };

  const handleAccountChangeRedirect = () => {
    navigate("/mypage/account");
  };

  return (
    <main className="container mx-auto mt-2 px-4">
      {/* Back Button */}
      <button
        aria-label="back"
        onClick={() => navigate(-1)} // 뒤로가기
        className="p-2"
      >
        <ArrowBackIcon />
      </button>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">파티장 설정</h1>

        {/* Party Information */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-2">파티 정보</h2>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">OTT 종류</div>
            <div className="text-gray-800">{partyDetails.ottName}</div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">파티생성 날짜</div>
            <div className="text-gray-800">
              {formatDate(partyDetails.createdAt)}
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">정산 일자</div>
            <div className="text-gray-800">
              {formatDate(partyDetails.settlementDate)}
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">정산 받는금액</div>
            <div className="text-gray-800">
              월 {settlementAmount.toLocaleString()}원
            </div>
          </div>
        </div>

        {/* Account Information Change */}
        <h2 className="text-xl font-bold mb-4">공유 계정 설정</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              OTT 계정 ID
            </label>
            <input
              type="text"
              value={ottAccountId}
              onChange={(e) => setOttAccountId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              OTT 계정 비밀번호
            </label>
            <input
              type="password"
              value={ottAccountPassword}
              onChange={(e) => setOttAccountPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <button
          onClick={handleAccountChange}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg mt-4 shadow-md hover:bg-accent transition duration-200"
        >
          계정 정보 변경하기
        </button>
        <div className="space-y-4">
          <button
            onClick={handleAccountChangeRedirect}
            className="w-full bg-white border border-primary text-primary py-2 px-4 rounded-lg mt-4 shadow-md hover:bg-gray-100 transition duration-200"
          >
            정산계좌 변경하기
          </button>
          <button
            onClick={handlePartyDisband
            }
            className="w-full bg-white border border-red-500 text-red-500 py-2 px-4 rounded-lg mt-4 shadow-md hover:bg-red-50 transition duration-200"
          >
            파티 해체하기
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000]">
          {/* z-index를 매우 높게 설정하여 다른 모든 요소 위에 백드롭이 위치하게 합니다 */}
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="relative bg-white rounded-lg p-6 z-[10001] w-11/12 max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4">정말 파티를 해체하겠습니까?</h2>
            <p className="text-gray-700 mb-4">
              파티를 해체하면 되돌릴 수 없습니다. 정말로 해체하시겠습니까?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                아니오
              </button>
              <button
                onClick={handleConfirmDisband}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default PartySettings;
