import { Route, Routes } from "react-router-dom";

import CardRegister from "./pages/payment/CardRegister";
// import Chat from "./pages/chat/Chat";
import KakaoPayApprove from "./pages/payment/kakaoPay/KakaoPayApprove";
import KakaoPayCancel from "./pages/payment/kakaoPay/KakaoPayCancel";
import KakaoPayFail from "./pages/payment/kakaoPay/KakaoPayFail";
import KakaoPayRegister from "./pages/payment/kakaoPay/KakaoPayRegister";
import Main from "./pages/main/Main";
import Manager from "./pages/admin/payment/PaymentManager";
import Payment from "./pages/payment/Payment";
import RefundManager from "./pages/admin/payment/RefundManager";
import SignUp from './pages/join/SignUp';
import Login from './pages/login/UserLogin';

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
{/*       <Route path="/chat" element={<Chat />} /> */}
      <Route path="/admin/payments" element={<Manager />} />
      <Route path="/admin/refunds" element={<RefundManager />} />
      <Route path="/users/sign-up" element={<SignUp />} />
      <Route path="/users/user-login" element={<Login />} />

    </Routes>
  );
};

export default Router;
