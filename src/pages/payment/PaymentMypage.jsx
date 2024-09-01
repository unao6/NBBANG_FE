import React, { useEffect, useState } from "react";
import { deleteCardInfo, getCardInfo } from "../../api/payment/paymentApi";
import PaymentMethodModal from "./fragments/PaymentMethodModal";

const PaymentMypage = () => {
  const [cardInfo, setCardInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // 모달 상태 관리
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar 상태 관리
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar 메시지
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar 알림 타입

  useEffect(() => {
    const fetchCardInfo = async () => {
      try {
        const data = await getCardInfo();
        console.log("Fetched card info:", data);
        setCardInfo(data);
      } catch (error) {
        console.error("카드 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchCardInfo();
  }, []);

  const handleRegister = () => {
    setModalOpen(true); // 모달을 여는 함수
  };

  const handleCloseModal = () => {
    setModalOpen(false); // 모달을 닫는 함수
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Snackbar를 닫는 함수
  };

  const handleDelete = async () => {
    try {
      await deleteCardInfo();
      setCardInfo(null);
      setSnackbarMessage("결제 수단이 성공적으로 삭제되었습니다!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true); // 삭제 성공 시 Snackbar를 엽니다.
    } catch (error) {
      console.error("카드 삭제 중 오류 발생:", error);
      setSnackbarMessage("카드 삭제 중 오류가 발생했습니다.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleChange = () => {
    setModalOpen(true); // 모달을 여는 함수 (카드 변경)
  };

  const displayCardNumber = (cardNumber, cardType) => {
    if (cardType) {
      return cardType; // 카드 타입이 있을 경우 전체 표시
    }
    if (cardNumber) {
      return cardNumber.slice(-4); // 카드 번호일 경우 마지막 네 자리만 표시
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="w-full bg-white rounded-lg shadow p-4 mt-4">
        <h6 className="text-xl font-semibold mb-4">현재 결제 수단</h6>
        {cardInfo ? (
          <>
            <div className="my-4 mx-auto w-[300px] h-[180px] bg-yellow-200 relative rounded-lg shadow-md">
              <div className="p-4">
                <h5 className="text-xl font-bold">
                  {cardInfo.issuerCorp || cardInfo.cardCompany}
                </h5>
                <p className="absolute bottom-4 right-4 text-gray-700">
                  {displayCardNumber(cardInfo.cardNumber, cardInfo.cardType)}
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="text-primary font-bold flex items-center gap-2 px-4 py-2 rounded-md border border-primary"
                onClick={handleChange}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M3 20v-7a4 4 0 014-4h10a4 4 0 014 4v7" />
                  <path d="M16 6a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                결제 수단 변경
              </button>
              <button
                className="text-red-500 font-bold flex items-center gap-2 px-4 py-2 rounded-md border border-red-500"
                onClick={handleDelete}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 4H8l-7 9 7 9h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
                결제 수단 제거
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="my-4 mx-auto flex justify-center items-center w-[300px] h-[180px] bg-white border-gray-100 rounded-lg shadow-md">
              <div>
                <h6 className="ml-4 text-lg font-bold">등록된 결제 수단이 없어요</h6>
                <p className="ml-4 mr-4 text-gray-600 text-sm mt-2">
                  N/BBANG 서비스 이용을 위해 결제 수단을 등록해 주세요.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="text-primary hover:bg-indigo-100 font-bold flex items-center mt-2 gap-2 px-4 py-2 rounded-md border border-primary"
                onClick={handleRegister}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                결제 수단 등록하기
              </button>
            </div>
          </>
        )}
      </div>
      <PaymentMethodModal open={modalOpen} onClose={handleCloseModal} />
      {snackbarOpen && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg px-4 py-2">
          <div
            className={`flex items-center text-sm font-semibold ${
              snackbarSeverity === "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {snackbarMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMypage;
