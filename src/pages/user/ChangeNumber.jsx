import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import axiosInterceptors from '../../api/axiosInterceptors';

const ChangeNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPhoneVerificationFocused, setIsPhoneVerificationFocused] = useState(false);
  const [phoneVerificationMessage, setPhoneVerificationMessage] = useState('');
  const [isPhoneVerificationSuccess, setIsPhoneVerificationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSendVerificationCode = async () => {
    try {
      await axiosInterceptors.post('/api/users/phone-certification', { phoneNumber });
      setIsVerificationSent(true);
      alert('인증번호가 발송되었습니다. 휴대폰을 확인해주세요.');
    } catch (error) {
      console.error('Error sending verification code:', error);
      alert('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axiosInterceptors.post('/api/users/phone-check', { phoneNumber, verificationCode });
      setIsVerified(true);
      setIsPhoneVerificationSuccess(true);
      setPhoneVerificationMessage('휴대폰 인증이 완료되었습니다.');
    } catch (error) {
      console.error('Error verifying code:', error);
      setIsPhoneVerificationSuccess(false);
      setPhoneVerificationMessage('인증에 실패했습니다. 인증번호를 확인해주세요.');
    }
  };

  const handleSavePhoneNumber = async () => {
    if (isVerified) {
      try {
        await axiosInterceptors.put('/api/users/change-phone-number', { phoneNumber });
        alert('휴대폰 번호가 성공적으로 변경되었습니다.');
        navigate('/mypage/user-info');
      } catch (error) {
        console.error('Error changing phone number:', error);
        alert('휴대폰 번호 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      alert('휴대폰 번호 인증을 완료해주세요.');
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <IconButton onClick={handleBackClick} sx={{ alignSelf: 'flex-start', marginBottom: 2 }}>
        <ArrowBackIosIcon />
      </IconButton>
      <Typography variant="h6" gutterBottom>
        휴대폰 번호 변경
      </Typography>

      <div className="mb-6">
        <label
          className={`block text-sm font-medium ${
            isPhoneFocused ? 'text-green-500' : 'text-gray-700'
          }`}
        >
          새 휴대폰 번호
        </label>
        <div className="relative">
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onFocus={() => setIsPhoneFocused(true)}
            onBlur={() => setIsPhoneFocused(false)}
            className={`block w-full px-3 py-2 focus:outline-none focus:ring-0 border-b-2 ${
              isPhoneFocused ? 'border-green-500' : 'border-gray-300'
            }`}
            placeholder="휴대폰 번호를 입력해주세요"
            style={{
              border: 'none',
              borderBottom: isPhoneFocused ? '2px solid #5bc490' : '2px solid #d3d3d3',
              backgroundColor: 'transparent',
            }}
          />
          <button
            type="button"
            onClick={handleSendVerificationCode}
            className="absolute inset-y-0 right-0 px-4 py-1 text-white bg-green-500 rounded-r-md hover:bg-green-600 focus:outline-none"
            disabled={!phoneNumber}
          >
            {isVerificationSent ? '인증번호 재전송' : '인증번호 전송'}
          </button>
        </div>
      </div>

      {isVerificationSent && (
        <div className="mb-6">
          <label
            className={`block text-sm font-medium ${
              isPhoneVerificationFocused ? 'text-green-500' : 'text-gray-700'
            }`}
          >
            인증번호
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            onFocus={() => setIsPhoneVerificationFocused(true)}
            onBlur={() => setIsPhoneVerificationFocused(false)}
            className={`block w-full px-3 py-2 focus:outline-none focus:ring-0 border-b-2 ${
              isPhoneVerificationFocused ? 'border-green-500' : 'border-gray-300'
            }`}
            placeholder="인증번호를 입력해주세요"
            style={{
              border: 'none',
              borderBottom: isPhoneVerificationFocused
                ? '2px solid #5bc490'
                : '2px solid #d3d3d3',
              backgroundColor: 'transparent',
            }}
          />
          <button
            type="button"
            onClick={handleVerifyCode}
            className="w-full mt-4 px-4 py-2 text-white bg-green-500 rounded focus:outline-none hover:bg-green-600"
          >
            인증 완료
          </button>
          {phoneVerificationMessage && (
            <p
              className={`text-sm mt-2 ${
                isPhoneVerificationSuccess ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {phoneVerificationMessage}
            </p>
          )}
        </div>
      )}

      {isVerified && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSavePhoneNumber}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          휴대폰 번호 저장
        </Button>
      )}
    </Box>
  );
};

export default ChangeNumber;