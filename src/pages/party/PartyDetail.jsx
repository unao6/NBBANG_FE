import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { getOttImage } from "../../components/OttImage.js";
import { getPartyById } from "../../api/party/partyApi";

const PartyDetail = () => {
  const { partyId } = useParams();
  const [partyDetails, setPartyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIdInfo, setShowIdInfo] = useState(false);
  const [showPwInfo, setShowPwInfo] = useState(false);
  const [showFinalSettlement, setShowFinalSettlement] = useState(false); // State for final settlement
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartyDetails = async () => {
      try {
        const response = await getPartyById(partyId);
        setPartyDetails(response.data);
      } catch (error) {
        console.error("파티 세부 정보를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartyDetails();
  }, [partyId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        로딩 중...
      </div>
    );
  }

  if (!partyDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        파티 정보를 불러오지 못했습니다.
      </div>
    );
  }

  const ottImage = getOttImage(partyDetails.ottName);

  const maskString = (str) => {
    return str.replace(/./g, "•");
  };

  const serviceFee = 500;
  const leaderServiceFee = 200;
  const individualShare = partyDetails.ottPrice / partyDetails.capacity;
  const leaderSettlement =
    individualShare * (partyDetails.capacity - 1) - leaderServiceFee;

  const handleSettingsClick = () => {
    if (partyDetails.isLeader) {
      navigate(`/party-settings/${partyId}`, { state: { partyDetails } });
    } else {
      navigate(`/party-settings-user/${partyId}`, { state: { partyDetails } });
    }
  };

  return (
    <main className="container mx-auto mt-2 px-4">
      <div className="flex justify-between mb-2">
        <IconButton aria-label="back" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton aria-label="settings" onClick={handleSettingsClick}>
          <div className="text-sm pr-1">설정 </div>
          <SettingsIcon />
        </IconButton>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <img
            src={ottImage}
            alt={partyDetails.ottName}
            className="w-16 h-16 object-contain mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {partyDetails.ottName} 파티
            </h1>
            <p className="text-sm text-gray-500">
              {partyDetails.isLeader
                ? "파티장으로 이용 중"
                : "파티원으로 이용 중"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-evenly items-center mb-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">파티장 자리</p>
              <img
                src={ottImage}
                alt="Profile"
                className="w-16 h-16 object-contain rounded-full mx-auto"
              />
              <p className="text-center text-sm mt-2 text-gray-800">
                {partyDetails.leaderNickname}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm">파티원 자리</p>
              <div className="flex justify-evenly">
                {partyDetails.members.map((member) => (
                  <div key={member.id} className="text-center mr-4">
                    <img
                      src={ottImage}
                      alt={member.nickname}
                      className="w-16 h-16 object-contain rounded-full mx-auto"
                    />
                    <p className="text-sm mt-2 text-gray-800">
                      {member.partyMemberNickname}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">정산 안내</h2>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">
              {partyDetails.ottName}
            </div>
            <div className="text-gray-800 font-bold">
              {partyDetails.ottPrice.toLocaleString()}원/월
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="bg-primary text-white p-2 w-1/4 text-center rounded-l-lg">
              {individualShare.toLocaleString()}원
            </div>
            {Array(partyDetails.capacity - 1)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className={`bg-secondary text-black p-2 w-1/4 text-center ${
                    index === partyDetails.capacity - 2 ? "rounded-r-lg" : "rounded-l"
                  }`}
                >
                  {individualShare.toLocaleString()}원
                </div>
              ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-primary flex items-center">
              <div className="w-4 h-4 bg-primary mr-2 rounded-full"></div>내 1/
              {partyDetails.capacity} 부담금
            </div>
            <div className="text-primary">
              {individualShare.toLocaleString()}원/월
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-gray-800 flex items-center">
              <div className="w-4 h-4 bg-secondary mr-2 rounded-full"></div>
              파티원 {partyDetails.capacity - 1}명의 몫
            </div>
            <div className="text-gray-800">
              {(partyDetails.ottPrice - individualShare).toLocaleString()}원/월
            </div>
          </div>

          {/* Final Settlement Button */}
          <button
            className="bg-gray-200 p-2 rounded mt-4 w-full text-center text-gray-700"
            onClick={() => setShowFinalSettlement(!showFinalSettlement)}
          >
            수수료 및 정산,결제금액 보기
          </button>

          {/* Final Settlement Display */}
          {showFinalSettlement && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800">
                최종 정산,결제 금액
              </h3>
              {partyDetails.isLeader ? (
                <>
                  <p className="text-gray-700 mt-2">
                    수수료 : {" "}
                    <span className="text-sm text-gray-500" style={{ textDecoration: "line-through" }}>
                      {serviceFee.toLocaleString()}원
                    </span>{" "}
                    <span>{"200원"}</span>
                  </p>
                  <p className="text-gray-700 mt-2">
                    최종 정산 금액 : {leaderSettlement.toLocaleString()}원/월
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-700 mt-2">
                    수수료: {serviceFee.toLocaleString()}원
                  </p>
                  <p className="text-gray-700 mt-2">
                    최종 결제 금액:{" "}
                    {(individualShare + serviceFee).toLocaleString()}원/월
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {partyDetails.ottName} ID/PW
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            계정 정보는 변경하지 않도록 유의해주세요
          </p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-gray-800 mr-2">ID</span>
              <span className="text-gray-800">
                {showIdInfo
                  ? partyDetails.ottAccountId
                  : maskString(partyDetails.ottAccountId)}
              </span>
            </div>
            <button
              className="text-primary ml-4"
              onClick={() => setShowIdInfo(!showIdInfo)}
            >
              {showIdInfo ? "숨기기" : "표시"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-gray-800 mr-2">PW</span>
              <span className="text-gray-800">
                {showPwInfo
                  ? partyDetails.ottAccountPassword
                  : maskString(partyDetails.ottAccountPassword)}
              </span>
            </div>
            <button
              className="text-primary ml-4"
              onClick={() => setShowPwInfo(!showPwInfo)}
            >
              {showPwInfo ? "숨기기" : "표시"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PartyDetail;
