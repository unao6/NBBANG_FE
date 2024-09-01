import { Route, Routes } from "react-router-dom";

import AccountMyPage from "./pages/payment/AccountMyPage";
import AccountRegistration from "./pages/party/AccountRegistration.jsx";
import AddParty from "./pages/party/AddParty";
import AdminChat from "./pages/admin/chat/AdminChat";
import AdminPartyManagement from "./pages/admin/party/AdminPartyManagement";
import ArchivedChatList from "./pages/admin/chat/ArchivedChatList.jsx";
import ArchivedChatMessages from "./pages/admin/chat/ArchivedChatMessages.jsx";
import CardRegister from "./pages/payment/CardRegister";
import ChangeNumber from "./pages/user/ChangeNumber";
import Chat from "./pages/chat/Chat";
import ChatList from "./pages/admin/chat/AdminChatList";
import DeleteAccount from "./pages/user/DeleteAccount";
import GoogleRedirectHandler from "./pages/login/fragments/GoogleRedirectHandler";
import Guide from "./pages/guide/Guide.jsx";
import KakaoPayApprove from "./pages/payment/kakaoPay/KakaoPayApprove";
import KakaoPayCancel from "./pages/payment/kakaoPay/KakaoPayCancel";
import KakaoPayFail from "./pages/payment/kakaoPay/KakaoPayFail";
import KakaoPayRegister from "./pages/payment/kakaoPay/KakaoPayRegister";
import Login from "./pages/login/UserLogin";
import LoginPage from "./pages/login/LoginPage";
import Main from "./pages/main/Main";
import Manager from "./pages/admin/payment/PaymentManager";
import MyPage from "./pages/myPage/MyPage";
import MyParty from "./pages/party/MyParty";
import OttList from "./pages/admin/ott/OttList";
import OttSelection from "./pages/party/OttSection";
import PartyDetail from "./pages/party/PartyDetail";
import PartyLeaderStep from "./pages/party/PartyLeaderStep";
import PartyMatchingSuccess from "./pages/party/PartyMatchingSuccess";
import PartyMemberStep from "./pages/party/PartyMemberStep";
import PartySettings from "./pages/party/PartySettings";
import PartySettingsUser from "./pages/party/PartySettingsUser";
import Payment from "./pages/payment/Payment";
import PaymentMypage from "./pages/payment/PaymentMypage";
import PaymentRefund from "./pages/payment/PaymentRefund.jsx";
import PromoCode from "./pages/myPage/promotion/PromoCode.jsx";
import RefundManager from "./pages/admin/payment/RefundManager";
import SendEmail from "./pages/admin/notification/SendEmail";
import SendSms from "./pages/admin/notification/SendSms";
import SignUp from "./pages/join/SignUp";
import StartChat from "./pages/chat/StartChat";
import UserInfo from "./pages/user/UserInfo";
import UserList from "./pages/admin/user/UserList";
import AddNumber from "./pages/login/AddNumber";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/kakaopay/register" element={<KakaoPayRegister />} />
      <Route path="/payment/card/register" element={<CardRegister />} />
      <Route path="/payment/kakaopay/approve" element={<KakaoPayApprove />} />
      <Route path="/payment/kakaopay/fail" element={<KakaoPayFail />} />
      <Route path="/payment/kakaopay/cancel" element={<KakaoPayCancel />} />
      <Route path="/payment/refund" element={<PaymentRefund />} />
      <Route path="/chat/:chatId" element={<Chat />} />
      <Route path="/chat/start" element={<StartChat />} />
      <Route path="/admin/payments" element={<Manager />} />
      <Route path="/admin/refunds" element={<RefundManager />} />
      <Route path="/admin/chat" element={<ChatList />} />
      <Route path="/admin/chat/:chatId" element={<AdminChat />} />
      <Route path="/admin/chat/archived/list" element={<ArchivedChatList />} />
      <Route
        path="/admin/chat/archived/:archivedId"
        element={<ArchivedChatMessages />}
      />
      <Route path="/admin/users" element={<UserList />} />
      <Route path="/admin/notification/email" element={<SendEmail />} />
      <Route path="/admin/notification/sms" element={<SendSms />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/payment" element={<PaymentMypage />} />
      <Route path="/mypage/user-info" element={<UserInfo />} />
      <Route path="/mypage/delete-account" element={<DeleteAccount />} />
      <Route path="/mypage/change-number" element={<ChangeNumber />} />
      <Route path="/mypage/add-number" element={<AddNumber />} /> {/* AddNumber 경로 추가 */}
      <Route path="/mypage/promoCode" element={<PromoCode />} />
      <Route path="/users/sign-up" element={<SignUp />} />
      <Route path="/users/user-login" element={<Login />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/redirect" element={<GoogleRedirectHandler />} />
      <Route path="/admin/ott" element={<OttList />} />
      <Route path="/add-party" element={<OttSelection />} />
      <Route path="/add-party/:ottId" element={<AddParty />} />
      <Route path="/party-member-step/:ottId" element={<PartyMemberStep />} />
      <Route path="/party-leader-step/:ottId" element={<PartyLeaderStep />} />
      <Route
        path="/add-party/account-registration/:ottId"
        element={<AccountRegistration />}
      />
      <Route path="/my-party" element={<MyParty />} />
      <Route path="/my-party/:partyId" element={<PartyDetail />} />
      <Route path="/party-settings/:partyId" element={<PartySettings />} />
      <Route
        path="/party-settings-user/:partyId"
        element={<PartySettingsUser />}
      />
      <Route path="/admin/parties" element={<AdminPartyManagement />} />
      <Route path="/mypage/account" element={<AccountMyPage />} />
      <Route
        path="/party-matching-success"
        element={<PartyMatchingSuccess />}
      />
    </Routes>
  );
};

export default Router;