import { Route, Routes } from "react-router-dom";

import CardRegister from "./pages/payment/CardRegister";
import Chat from "./pages/chat/Chat";
import StartChat from "./pages/chat/StartChat";
import ChatList from "./pages/admin/chat/ChatList";
import AdminChat from "./pages/admin/chat/AdminChat"
import KakaoPayApprove from "./pages/payment/kakaoPay/KakaoPayApprove";
import KakaoPayCancel from "./pages/payment/kakaoPay/KakaoPayCancel";
import KakaoPayFail from "./pages/payment/kakaoPay/KakaoPayFail";
import KakaoPayRegister from "./pages/payment/kakaoPay/KakaoPayRegister";
import Main from "./pages/main/Main";
import Manager from "./pages/admin/payment/PaymentManager";
import MyPage from "./pages/myPage/MyPage";
import Payment from "./pages/payment/Payment";
import UserInfo from "./pages/myPage/UserInfo";
import DeleteAccount from "./pages/myPage/DeleteAccount";
import PaymentMypage from "./pages/payment/PaymentMypage";
import RefundManager from "./pages/admin/payment/RefundManager";
import SignUp from './pages/join/SignUp';
import Login from './pages/login/UserLogin';
import LoginPage from './pages/login/LoginPage';
import UserAuth from './pages/join/UserAuth';
import OttList from "./pages/admin/ott/OttList";
import OttSelection from "./pages/party/OttSection";
import AddParty from "./pages/party/AddParty";
import PartyLeaderStep from "./pages/party/PartyLeaderStep";
import AccountRegistration from './pages/party/AccountRegistration.jsx';

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
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/start" element={<StartChat />} />
      <Route path="/admin/payments" element={<Manager />} />
      <Route path="/admin/refunds" element={<RefundManager />} />
      <Route path="/admin/chat" element={<ChatList />} />
      <Route path="/admin/chat/:chatId" element={<AdminChat />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/payment" element={<PaymentMypage />} />
      <Route path="/mypage/user-info" element={<UserInfo />} />
      <Route path="/mypage/delete-account" element={<DeleteAccount />} />
      <Route path="/users/sign-up" element={<SignUp />} />
      <Route path="/users/user-login" element={<Login />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/user-auth" element={<UserAuth />} />
      <Route path="/admin/ott" element={<OttList />} />
      <Route path="/add-party" element={<OttSelection />} />
      <Route path="/add-party/:ottId" element={<AddParty />} />
      <Route path="/party-leader-step/:ottId" element={<PartyLeaderStep />} />
      <Route path="/add-party/account-registration/:ottId" element={<AccountRegistration />} />
    </Routes>
  );
};

export default Router;
