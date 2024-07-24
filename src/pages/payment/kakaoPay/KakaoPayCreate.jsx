import Button from "@mui/material/Button";
import React from "react";
import { createKakaoPay } from "../../../api/payment/kakaoPay/kakaoPay";

const KakaoPayButton = () => {
  const handlePayment = async () => {
    try {
      const userId = 1; //임시로 1설정
      const result = await createKakaoPay(userId);
      window.location.href = result.next_redirect_pc_url;
    } catch (error) {
      console.error("결제 요청 중 오류 발생:", error);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      className="bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-600"
    >
      카카오페이 결제 시작
    </Button>
  );
};

export default KakaoPayButton;
