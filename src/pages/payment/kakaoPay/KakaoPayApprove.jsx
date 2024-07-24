import React, { useEffect } from "react";

import { approveKakaoPay } from "../../../api/payment/kakaoPay/kakaoPay";
import { useLocation } from "react-router-dom";

const KakaoPayApprove = ({ tid }) => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pgToken = params.get("pg_token");

    if (pgToken) {
      const approvePayment = async () => {
        try {
          const response = await approveKakaoPay({ pg_token: pgToken });
          console.log("결제 승인 성공:", response);
          //결제 성공후 카드등록 페이지로 이동해야함.
        } catch (error) {
          console.error("결제 승인 중 오류 발생:", error);
        }
      };

      approvePayment();
    }
  }, [location.search]);

  return <div>결제가 성공적으로 완료되었습니다.</div>;
};

export default KakaoPayApprove;
