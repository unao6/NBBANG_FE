import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AnnouncementIcon from "@mui/icons-material/Announcement";
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

const MyPage = () => {
  const menuItems = [
    {
      text: "엔빵 계정 관리",
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
      href: "/settlement-account",
    },
    { text: "공지사항", icon: <AnnouncementIcon />, href: "/notices" },
    { text: "알림 설정", icon: <NotificationsIcon />, href: "/notifications" },
    { text: "자주 묻는 질문", icon: <HelpIcon />, href: "/faq" },
    { text: "1:1 채팅문의", icon: <ChatIcon />, href: "/chat" },
    {
      text: "프로모션 코드 입력",
      icon: <LocalOfferIcon />,
      href: "/promo-code",
    },
    { text: "제안하기", icon: <FeedbackIcon />, href: "/suggestions" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow">
        <List component="nav" aria-label="main mailbox folders">
          {menuItems.map((item, index) => (
            <ListItem button key={index} component="a" href={item.href}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default MyPage;
