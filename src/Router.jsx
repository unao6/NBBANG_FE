import { Route, Routes } from "react-router-dom";

import CardRegister from "./pages/payment/CardRegister";
import KakaoPayApprove from "./pages/payment/kakaoPay/KakaoPayApprove";
import KakaoPayCancel from "./pages/payment/kakaoPay/KakaoPayCancel";
import KakaoPayFail from "./pages/payment/kakaoPay/KakaoPayFail";
import KakaoPayRegister from "./pages/payment/kakaoPay/KakaoPayRegister";
import Main from "./pages/main/Main";
import Manager from "./pages/admin/payment/PaymentManager";
import Payment from "./pages/payment/Payment";
import RefundManager from "./pages/admin/payment/RefundManager";
import OttList from "./pages/admin/ott/OttList";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/kakaopay/register" element={<KakaoPayRegister />} />
      <Route path="/payment/card/register" element={<CardRegister />} />
      <Route path="/payment/kakaopay/approve" element={<KakaoPayApprove />} />
      <Route path="/payment/kakaopay/fail" element={<KakaoPayFail />} />
      <Route path="/payment/kakaopay/cancel" element={<KakaoPayCancel />} />
      <Route path="/admin/payments" element={<Manager />} />
      <Route path="/admin/refunds" element={<RefundManager />} />
      <Route path="/admin/ott" element={<OttList />} />
    </Routes>
  );
};

export default Router;
