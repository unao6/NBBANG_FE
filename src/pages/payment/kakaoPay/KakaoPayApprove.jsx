import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { approveKakaoPay } from "../../../api/payment/kakaoPay/kakaoPayApi";
import usePaymentStore from "../../../store/usePaymentStore";

const KakaoPayApprove = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { tid, pgToken, setPgToken } = usePaymentStore((state) => ({
    tid: state.tid,
    pgToken: state.pgToken,
    setPgToken: state.setPgToken,
  }));

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pgTokenValue = searchParams.get("pg_token");
    if (pgTokenValue) {
      console.log("pgTokenValue:", pgTokenValue);
      setPgToken(pgTokenValue);

      // pg_token을 추출한 후 URL에서 제거
      navigate("/payment/kakaopay/approve", { replace: true });
    }
  }, [location, navigate, setPgToken]);

  const handleAgreementChange = () => {
    setIsAgreed(!isAgreed);
  };

  const handleSubmit = async () => {
    if (isAgreed && pgToken && tid) {
      try {
        const response = await approveKakaoPay(tid, pgToken);

        navigate("/mypage/payment", {
          state: { payment: response },
        });
      } catch (error) {
        console.error("Error approving KakaoPay:", error);
      }
    } else {
      console.error("Missing required information:", { tid, pgToken });
    }
  };

  return (
    <div className="flex flex-col justify-between bg-gray-100">
      <div className="bg-white p-8 shadow-md w-full max-w-2xl mx-auto rounded">
        <h2 className="text-2xl font-bold mb-4">N/BBANG 카카오페이 카드등록</h2>

        <div className="mb-4 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-700">
            등록하기를 누르면 카카오페이 카드등록이 완료되고
            <br />
            카카오톡으로 알림이 전송됩니다.
          </p>
        </div>
        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={isAgreed}
              onChange={handleAgreementChange}
            />
            <span className="ml-2 text-sm text-gray-700">
              서비스 내용을 확인하였으며, 위 내용에 동의 합니다.
            </span>
          </label>
        </div>
      </div>

      <div className="p-8 bg-white shadow-md w-full max-w-2xl mx-auto rounded">
        <button
          disabled={!isAgreed}
          className={`w-full py-3 rounded ${
            isAgreed
              ? "bg-primary text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleSubmit}
        >
          등록하기
        </button>
      </div>
    </div>
  );
};

export default KakaoPayApprove;
