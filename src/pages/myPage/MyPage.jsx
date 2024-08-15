import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HelpIcon from "@mui/icons-material/Help";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaymentIcon from "@mui/icons-material/Payment";
import React from "react";
import axiosInterceptors from "../../api/axiosInterceptors";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const menuItems = [
    {
      text: "계정 정보",
      icon: <AccountCircleIcon />,
      href: "/mypage/user-info",
    },
    {
      text: "파티원 | 결제수단",
      icon: <PaymentIcon />,
      href: "/mypage/payment",
    },
    {
      text: "파티장 | 정산계좌",
      icon: <PaymentIcon />,
      href: "/mypage/account",
    },
    // { text: "공지사항", icon: <AnnouncementIcon />, href: "/notices" },
    { text: "알림 설정", icon: <NotificationsIcon />, href: "/notifications" },
    // { text: "자주 묻는 질문", icon: <HelpIcon />, href: "/faq" },
    { text: "1:1 채팅 문의", icon: <ChatIcon />, href: "/chat/start" },
    {
      text: "프로모션 코드 등록",
      icon: <LocalOfferIcon />,
      href: "/mypage/promoCode",
    },
    // { text: "제안하기", icon: <FeedbackIcon />, href: "/suggestions" },
  ];

const handleLogout = async () => {
    try {
      // 로그아웃 API 요청 보내기
      const response = await axiosInterceptors.post("/logout", null, {
        withCredentials: true, // 쿠키를 포함하여 요청
      });

      if (response.status === 200) {
        // 로그아웃 성공 시 로컬 스토리지에서 토큰 제거
        localStorage.removeItem("access");

        // 로컬 스토리지 변경 감지 이벤트를 수동으로 트리거
        window.dispatchEvent(new Event("storage"));

        // 로그아웃 후 로그인 페이지로 리다이렉트
        navigate("/");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };


  return (
    <div className="min-h-full bg-gray-50 p-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow">
        <List component="nav" aria-label="main mailbox folders">
          {menuItems.map((item, index) => (
            <ListItem button key={index} component="a" href={item.href}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <div className="p-4">
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleLogout}
            style={{ marginTop: "10px" }}
          >
            로그아웃
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
