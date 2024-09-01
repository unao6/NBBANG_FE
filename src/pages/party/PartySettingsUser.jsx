import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { fetchUserInfo } from "../../api/user/userApi";

const PartySettingsUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { partyDetails } = location.state || {}; // 전송된 상태를 가져오고 없을 시 기본값 설정
  const [user, setUser] = useState(null); // 사용자 정보를 저장할 상태
  const [open, setOpen] = useState(false); // 모달 상태 관리
  const [alertOpen, setAlertOpen] = useState(false); // 경고 메시지 상태 관리

  const partyMemberFee = 500;
  const paymentAmount =
    partyDetails.ottPrice / partyDetails.capacity + partyMemberFee;

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo();
        setUser(userInfo); // 사용자 정보를 상태로 설정
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getUserInfo();
  }, []);

  // 날짜 형식을 변환하는 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}월 ${String(date.getDate()).padStart(2, "0")}일`;
  };

  // 한 달 뒤 날짜를 계산하는 함수
  const calculateOneMonthLater = (dateString) => {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + 1);
    return formatDate(date.toISOString());
  };

  // 현재 사용자의 joinDate를 가져오는 함수
  const getJoinDate = () => {
    const currentUser = partyDetails.members.find(
      (member) => member.userId === user?.userId
    );
    return currentUser ? currentUser.joinDate : null;
  };

  const joinDate = user ? getJoinDate() : null;

  // 한 달 제한을 제거하여 항상 탈퇴 가능하도록 설정
  const isEligibleToLeave = () => {
    return true;
  };

  if (!partyDetails) {
    return <div>파티 정보를 불러올 수 없습니다.</div>;
  }

  const handleOpen = () => {
    if (isEligibleToLeave()) {
      setOpen(true);
    } else {
      setAlertOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAlertOpen(false);
  };

  const handleConfirm = () => {
    // 탈퇴 후 /payment/refund 페이지로 이동
    navigate("/payment/refund");
  };

  return (
    <main className="container mx-auto mt-4 px-4">
      {/* Back Button */}
      <button
        aria-label="back"
        onClick={() => navigate(-1)}
        className="p-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Party Details */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">파티원 설정</h1>

        {/* Party Information */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-2">파티 정보</h2>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">OTT 종류</div>
            <div className="text-gray-800">{partyDetails.ottName}</div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">파티가입 날짜</div>
            <div className="text-gray-800">
              {joinDate ? formatDate(joinDate) : "정보 없음"}
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">다음 결제 일자</div>
            <div className="text-gray-800">
              {joinDate ? calculateOneMonthLater(joinDate) : "정보 없음"}
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">결제 금액</div>
            <div className="text-gray-800">
              월 {paymentAmount.toLocaleString()}원
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            className="w-full bg-primary border border-primary text-white py-2 px-4 rounded-lg mt-4 shadow-md hover:bg-accent"
            onClick={() => navigate("/mypage/payment")}
          >
            결제카드 변경하기
          </button>
          <button
            className="w-full bg-white border border-red-500 text-red-500 py-2 px-4 rounded-lg mt-4 shadow-md hover:bg-red-50 transition duration-200"
            onClick={handleOpen}
          >
            파티 탈퇴하기
          </button>
        </div>

        {/* Notice */}
        <div className="bg-gray-200 p-4 rounded-lg mt-6">
          <div className="flex items-center">
            <div className="mr-2">✔</div>
            <div className="text-gray-800 text-sm">
              잦은 파티탈퇴 발생 시 파티장님에게 부담이 되기 때문에 파티탈퇴는
              <br />
              최초 가입 한달 뒤인{" "}
              {joinDate ? calculateOneMonthLater(joinDate) : "정보 없음"}부터
              가능해요.
              <br />
              결제일에 탈퇴해도 전액 환불이 가능하니 걱정하지 마세요!
            </div>
          </div>
        </div>
      </div>

      {/* Modal for options */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div className="bg-white rounded-lg p-6 z-50 w-11/12 max-w-md mx-auto relative">
            {/* Close Button */}
            <button
              aria-label="close"
              onClick={handleClose}
              className="absolute top-2 right-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold mb-4">정말 파티 탈퇴하시겠습니까?</h2>
            <p className="text-gray-800 mb-4">환불 신청 페이지로 이동합니다.</p>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-white border border-primary text-primary rounded-lg hover:bg-gray-100 transition duration-200"
                onClick={handleConfirm}
              >
                네
              </button>
              <button
                className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition duration-200"
                onClick={handleClose}
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert for ineligible users */}
      {alertOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div className="bg-white rounded-lg p-6 z-50 w-11/12 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">탈퇴 불가</h2>
            <p className="text-gray-800 mb-4">
              최초 가입한 날로부터 한 달이 지나지 않았습니다. 한 달 이후에 탈퇴
              가능합니다.
            </p>
            <button
              className="w-full bg-primary text-white py-2 px-4 rounded-lg shadow-md hover:bg-accent transition duration-200"
              onClick={handleClose}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default PartySettingsUser;
