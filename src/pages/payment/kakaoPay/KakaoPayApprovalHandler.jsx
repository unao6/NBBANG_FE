import React, { useEffect } from "react";

import { approveKakaoPay } from "../../../api/payment/kakaoPay/kakaoPay";

const KakaoPayApprovalHandler = ({ tid }) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pgToken = urlParams.get("pg_token");
    if (pgToken) {
      const approvePayment = async () => {
        try {
          const data = {
            cid: "TC0ONETIME",
            tid: tid,
            partner_order_id: "order1234",
            partner_user_id: "user1234",
            pg_token: pgToken,
          };
          const result = await approveKakaoPay(data);
          console.log("결제 승인 결과:", result);
        } catch (error) {
          console.error("결제 승인 중 오류 발생:", error);
        }
      };
      approvePayment();
    }
  }, [tid]);

  return null;
};

export default KakaoPayApprovalHandler;
