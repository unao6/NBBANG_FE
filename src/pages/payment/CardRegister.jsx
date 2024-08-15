import React, { useState } from "react";

import { Bootpay } from '@bootpay/client-js';
import { postCardInfo } from "../../api/payment/bootPayApi";
import { useNavigate } from "react-router-dom";

const BootpaySubscription = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();

  const handleAgreementChange = () => {
    setIsAgreed(!isAgreed);
  };

  const handleSubscription = () => {
    Bootpay.requestSubscription({
      application_id: '669e45b893784376c33fbe8c',
      pg: '나이스페이먼츠',
      price: 100,
      tax_free: 0,
      order_name: '정기결제 입니다',
      subscription_id: (new Date()).getTime(),
      redirect_url: 'http://localhost:3000/mypage/payment',
      user: {
        username: '홍길동',
        phone: '01000000000'
      },
      extra: {
        subscription_comment: '매월 100원이 결제됩니다',
        subscribe_test_payment: true
      }
    }).then(
      async function (response) {
        if (response.event === 'done') {
          console.log(response.data);
          alert('빌링키 발급이 완료되었습니다.');

          try {
            // axiosInterceptors를 통해 API 호출
            const cardInfo = {
              receiptId: response.data.receipt_id,
              cardCompany: response.data.receipt_data.card_data.card_company,
              cardNumber: response.data.receipt_data.card_data.card_no
            };

            const result = await postCardInfo(cardInfo);
            console.log('서버 응답:', result);

            navigate("/mypage/payment");
          } catch (error) {
            console.error('Error posting card info:', error);
          }
        }
      },
      function (error) {
        console.log(error.message);
      }
    );
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 flex-grow">
      <div className="bg-white p-8 shadow-md w-full max-w-2xl mx-auto rounded">
        <h2 className="text-2xl font-bold mb-4">N/BBANG 카드등록</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">자동결제</h3>
          <p className="text-3xl font-bold text-black mt-1">100원</p>
          <p className="text-sm text-gray-500 mt-1">2024.07.24</p>
        </div>
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-700">
            결제 금액 <span className="font-bold">100원</span>은 정상카드 확인
            완료 이후 바로 취소됩니다.
          </p>
          <p className="text-sm text-gray-700 mt-2">
            카드결제만 가능합니다.
          </p>
        </div>
        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={isAgreed}
              onChange={handleAgreementChange}
            />
            <span className="ml-2 text-sm text-gray-700">
              자동결제 서비스 이용에 동의 합니다.
            </span>
          </label>
        </div>
      </div>

      <div className="bg-white p-8 shadow-md w-full max-w-2xl mx-auto mt-4 rounded">
        <h3 className="text-sm font-bold mb-2">모두 동의합니다.</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-gray-700">
            전자금융거래 이용약관 <span className="text-primary">보기</span>
          </li>
          <li className="text-sm text-gray-700">
            개인정보수집 및 이용동의 <span className="text-primary">보기</span>
          </li>
          <li className="text-sm text-gray-700">
            개인(신용)정보 제 3자 제공 및 위탁동의{" "}
            <span className="text-primary">보기</span>
          </li>
        </ul>
      </div>

      <div className="p-8 bg-white shadow-md w-full max-w-2xl mx-auto mt-4 rounded">
        <button
          disabled={!isAgreed}
          className={`w-full py-3 rounded ${
            isAgreed
              ? "bg-primary text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleSubscription}
        >
          동의하고 넘어가기
        </button>
      </div>
    </div>
  );
};

export default BootpaySubscription;