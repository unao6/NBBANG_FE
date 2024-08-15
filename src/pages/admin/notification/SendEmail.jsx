import React, { useState } from "react";
import { sendEmail } from "../../../api/notification/emailApi";

const SendEmail = () => {
  const [emails, setEmails] = useState(""); // 이메일 주소를 저장할 상태
  const [subject, setSubject] = useState(""); // 이메일 제목을 저장할 상태
  const [message, setMessage] = useState(""); // 이메일 내용을 저장할 상태
  const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지 상태
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태
  const [isSending, setIsSending] = useState(false); // 이메일 전송 상태

  const handleSendEmail = async () => {
    setIsSending(true); // 이메일 전송 시작
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // 이메일 주소를 쉼표(,)로 구분하여 배열로 변환
      const emailList = emails.split(",").map(email => email.trim());

      // 각 이메일에 대해 sendEmail 함수 호출
      for (const email of emailList) {
        await sendEmail(email, subject, message.replace(/\n/g, '<br>'));
      }

      setSuccessMessage("이메일이 성공적으로 발송되었습니다.");
    } catch (error) {
      setErrorMessage("이메일 발송 중 오류가 발생했습니다.");
      console.error("Error in sendEmail:", error);
    } finally {
      setIsSending(false); // 이메일 전송 종료
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">이메일 발송</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          이메일 주소 (쉼표로 구분):
        </label>
        <input
          type="text"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="example1@mail.com, example2@mail.com"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          제목:
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="이메일 제목"
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
          placeholder="이메일 내용"
          rows={5}
        />
      </div>
      <button
        onClick={handleSendEmail}
        className="bg-primary text-white px-4 py-2 rounded"
        disabled={isSending} // 전송 중일 때 버튼 비활성화
      >
        이메일 발송
      </button>
      {isSending && <div className="mt-4 text-primary">이메일 전송 중...</div>}
      {successMessage && (
        <div className="mt-4 text-accent">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="mt-4 text-red-500">{errorMessage}</div>
      )}
    </div>
  );
};

export default SendEmail;
