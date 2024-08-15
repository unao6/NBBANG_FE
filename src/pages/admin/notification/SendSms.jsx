import React, { useState } from "react";
import { sendSms } from "../../../api/notification/smsApi";

const SendSms = () => {
  const [phoneNumbers, setPhoneNumbers] = useState(""); // 전화번호를 저장할 상태
  const [message, setMessage] = useState(""); // SMS 내용을 저장할 상태
  const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지 상태
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태
  const [isSending, setIsSending] = useState(false); // SMS 전송 상태

  const handleSendSms = async () => {
    setIsSending(true); // SMS 전송 시작
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // 전화번호를 쉼표(,)로 구분하여 배열로 변환하고, -를 제거
      const phoneNumberList = phoneNumbers
        .split(",")
        .map(number => number.trim().replace(/-/g, ""));

      // 각 전화번호에 대해 sendSms 함수 호출
      for (const number of phoneNumberList) {
        await sendSms(number, message);
      }

      setSuccessMessage("SMS가 성공적으로 발송되었습니다.");
    } catch (error) {
      setErrorMessage("SMS 발송 중 오류가 발생했습니다.");
      console.error("Error in sendSms:", error);
    } finally {
      setIsSending(false); // SMS 전송 종료
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">SMS 발송</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          전화번호 (쉼표로 구분, - 없이 입력):
        </label>
        <input
          type="text"
          value={phoneNumbers}
          onChange={(e) => setPhoneNumbers(e.target.value.replace(/-/g, ""))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="01012345678, 01023456789"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          메시지:
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="SMS 내용"
          rows={5}
        />
      </div>
      <button
        onClick={handleSendSms}
        className="bg-primary text-white px-4 py-2 rounded"
        disabled={isSending} // 전송 중일 때 버튼 비활성화
      >
        SMS 발송
      </button>
      {isSending && <div className="mt-4 text-primary">SMS 전송 중...</div>}
      {successMessage && (
        <div className="mt-4 text-accent">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="mt-4 text-red-500">{errorMessage}</div>
      )}
    </div>
  );
};

export default SendSms;
