import { Route, Routes } from "react-router-dom";

import KakaoPayApproval from "./pages/payment/kakaoPay/KakaoPayApproval";
import KakaoPayCancel from "./pages/payment/kakaoPay/KakaoPayCancel";
import KakaoPayFail from "./pages/payment/kakaoPay/KakaoPayFail";
import Main from "./pages/main/Main";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/payment/kakaopay/approval" element={<KakaoPayApproval />} />
      <Route path="/payment/kakaopay/fail" element={<KakaoPayFail />} />
      <Route path="/payment/kakaopay/cancel" element={<KakaoPayCancel />} />
    </Routes>
  );
};

export default Router;
