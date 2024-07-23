import React from "react";
import { initiateKakaoPay } from "../../../api/payment/kakaoPay/kakaoPay";

const KakaoPayButton = () => {
  const handlePayment = async () => {
    try {
      const data = {
        cid: "TC0ONETIME",
        partner_order_id: "order1234",
        partner_user_id: "user1234",
        item_name: "Sample Item",
        quantity: 1,
        total_amount: 100,
        approval_url: "http://localhost:3000/payment/kakaopay/approval",
        fail_url: "http://localhost:3000/payment/kakaopay/fail",
        cancel_url: "http://localhost:3000/payment/kakaopay/cancel",
      };
      const result = await initiateKakaoPay(data);
      window.location.href = result.next_redirect_pc_url;
    } catch (error) {
      console.error("결제 요청 중 오류 발생:", error);
    }
  };

  return <button onClick={handlePayment}>카카오페이 결제 시작</button>;
};

export default KakaoPayButton;
