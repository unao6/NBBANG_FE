import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { partyMemberWithdraw } from '../../api/party/partyApi';
import { fetchUserInfo } from '../../api/user/userApi';
import { IconButton, Button, Modal, Box } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

const PartySettingsUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { partyDetails } = location.state || {}; // 전송된 상태를 가져오고 없을 시 기본값 설정
  const [user, setUser] = useState(null); // 사용자 정보를 저장할 상태
  console.log(user);
  const [open, setOpen] = useState(false); // 모달 상태 관리
  const [alertOpen, setAlertOpen] = useState(false); // 경고 메시지 상태 관리

  const partyMemberFee = 500;
  const paymentAmount = (partyDetails.ottPrice / partyDetails.capacity) + partyMemberFee;

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo();
        setUser(userInfo); // 사용자 정보를 상태로 설정
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    getUserInfo();
  }, []);

  // 날짜 형식을 변환하는 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;
  };

  // 한 달 뒤 날짜를 계산하는 함수
  const calculateOneMonthLater = (dateString) => {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + 1);
    return formatDate(date.toISOString());
  };

  // 현재 사용자의 joinDate를 가져오는 함수
  const getJoinDate = () => {
    const currentUser = partyDetails.members.find(member => member.userId === user?.userId);
    return currentUser ? currentUser.joinDate : null;
  };

  const joinDate = user ? getJoinDate() : null;

  const isEligibleToLeave = () => {
    if (!joinDate) {
      return false;
    }
    const joinDateObj = new Date(joinDate);
    const oneMonthLater = new Date(joinDateObj);
    oneMonthLater.setMonth(joinDateObj.getMonth() + 1);
    return new Date() >= oneMonthLater;
  };

  if (!partyDetails) {
    return <div>파티 정보를 불러올 수 없습니다.</div>;
  }

  const handleOpen = () => {
    if (isEligibleToLeave()) {
      setOpen(true);
    } else {
      setAlertOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAlertOpen(false);
  };

  const handleConfirm = async () => {
    try {
      // 파티 탈퇴 API 호출
      await partyMemberWithdraw(partyDetails.partyId);
      console.log("파티 탈퇴 확인됨");
      handleClose();
      // 탈퇴 후 적절한 페이지로 이동
      navigate('/');
    } catch (error) {
      console.error("파티 탈퇴 중 오류 발생:", error);
      // 오류 처리 로직 추가 가능
    }
  };

  return (
    <main className="container mx-auto mt-8 px-4 md:px-0">
      {/* Back Button */}
      <IconButton
        aria-label="back"
        onClick={() => navigate(-1)} // 뒤로가기
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Party Details */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">OTT 파티 설정</h1>

        {/* Party Information */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-2">파티 정보</h2>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">OTT 종류</div>
            <div className="text-gray-800">{partyDetails.ottName}</div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">파티가입 날짜</div>
            <div className="text-gray-800">{joinDate ? formatDate(joinDate) : '정보 없음'}</div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">결제 일자</div>
            <div className="text-gray-800">{joinDate ? calculateOneMonthLater(joinDate) : '정보 없음'}</div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">결제 금액</div>
            <div className="text-gray-800">월 {paymentAmount.toLocaleString()}원</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => navigate('/mypage/payment')}
          >
            결제카드 변경하기
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleOpen} // 모달 열기
          >
            파티 탈퇴하기
          </Button>
        </div>

        {/* Notice */}
        <div className="bg-gray-200 p-4 rounded-lg mt-6">
          <div className="flex items-center">
            <div className="mr-2">✔</div>
            <div className="text-gray-800 text-sm">
              잦은 파티탈퇴 발생 시 파티장님에게 부담이 되기 때문에 파티탈퇴는
              <br />
              최초 가입 한달 뒤인 {joinDate ? calculateOneMonthLater(joinDate) : '정보 없음'}부터 가능해요.
              <br />
              결제일에 탈퇴해도 전액 환불이 가능하니 걱정하지 마세요!
            </div>
          </div>
        </div>
      </div>

      {/* Modal for options */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="bg-white p-6 rounded-lg shadow-lg mx-auto mt-20 max-w-md relative">
          {/* Close Button */}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            className="absolute top-2 right-2"
          >
            <CloseIcon />
          </IconButton>

          <h2 id="modal-title" className="text-xl font-bold mb-4">정말 파티 탈퇴하시겠습니까?</h2>
          <p id="modal-description" className="text-gray-800 mb-4">남은 기간만큼 환불됩니다.</p>
          <div className="flex justify-between mt-4">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleConfirm}
            >
              네
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClose}
            >
              아니오
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Alert for ineligible users */}
      <Modal
        open={alertOpen}
        onClose={handleClose}
        aria-labelledby="alert-title"
        aria-describedby="alert-description"
      >
        <Box className="bg-white p-6 rounded-lg shadow-lg mx-auto mt-20 max-w-md">
          <h2 id="alert-title" className="text-xl font-bold mb-4">탈퇴 불가</h2>
          <p id="alert-description" className="text-gray-800 mb-4">
            최초 가입한 날로부터 한 달이 지나지 않았습니다. 한 달 이후에 탈퇴 가능합니다.
          </p>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
            fullWidth
          >
            확인
          </Button>
        </Box>
      </Modal>
    </main>
  );
};

export default PartySettingsUser;
