import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { partyBreakUp, updateOttAccount } from "../../api/party/partyApi";
import { useLocation, useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PartySettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { partyDetails } = location.state || {};

  const [ottAccountId, setOttAccountId] = useState(
    partyDetails?.ottAccountId || "",
  );
  const [ottAccountPassword, setOttAccountPassword] = useState(
    partyDetails?.ottAccountPassword || "",
  );
  const [open, setOpen] = useState(false);
  const partyId = partyDetails?.partyId;
  const leaderFee = 200;
  const settlementAmount =
    (partyDetails.ottPrice / partyDetails.capacity) * 3 - leaderFee;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}월 ${String(date.getDate()).padStart(2, "0")}일`;
  };

  if (!partyDetails) {
    return <div>파티 정보를 불러올 수 없습니다.</div>;
  }

  const handleAccountChange = async () => {
    try {
      const partyUpdateRequest = {
        ottAccountId,
        ottAccountPassword,
      };

      await updateOttAccount(partyId, partyUpdateRequest);

      alert("계정 정보가 성공적으로 변경되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error("계정 정보를 변경하는 중 오류가 발생했습니다:", error);
      alert("계정 정보 변경 중 오류가 발생했습니다.");
    }
  };

  const handlePartyDisband = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDisband = async () => {
    try {
      await partyBreakUp(partyId);
      alert("파티가 성공적으로 해체되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("파티 해체 중 오류가 발생했습니다:", error);
      alert("파티 해체 중 오류가 발생했습니다.");
    }
    setOpen(false);
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
            <div className="text-gray-800 font-semibold">파티생성 날짜</div>
            <div className="text-gray-800">
              {formatDate(partyDetails.createdAt)}
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">정산 일자</div>
            <div className="text-gray-800">
              {formatDate(partyDetails.settlementDate)}
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-800 font-semibold">정산 받는금액</div>
            <div className="text-gray-800">
              월 {settlementAmount.toLocaleString()}원
            </div>
          </div>
        </div>

        {/* Account Information Change */}
        <h2 className="text-xl font-bold mb-4">공유 계정 설정</h2>
        <div className="space-y-6">
          {" "}
          {/* 여기에 space-y-6 클래스를 추가하여 간격을 넓힘 */}
          <TextField
            label="OTT 계정 ID"
            value={ottAccountId}
            onChange={(e) => setOttAccountId(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="OTT 계정 비밀번호"
            value={ottAccountPassword}
            onChange={(e) => setOttAccountPassword(e.target.value)}
            fullWidth
            variant="outlined"
            type="password"
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAccountChange}
          fullWidth
          sx={{ mt: 2 }}
        >
          계정 정보 변경하기
        </Button>
        <div className="space-y-4">
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => console.log("정산계좌 변경하기 클릭됨")}
            sx={{ mt: 2 }}
          >
            정산계좌 변경하기
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handlePartyDisband}
            sx={{ mt: 2 }}
          >
            파티 해체하기
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          정말 파티를 해체하겠습니까?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            파티를 해체하면 되돌릴 수 없습니다. 정말로 해체하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            아니오
          </Button>
          <Button onClick={handleConfirmDisband} color="secondary" autoFocus>
            네
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default PartySettings;
