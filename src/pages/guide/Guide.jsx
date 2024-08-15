import React, { useState } from "react";

const CustomAccordion = ({ title, children, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center p-2 text-gray-800 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center text-md font-semibold">
          <span className="mr-2">{icon}</span>
          {title}
        </div>
        <span
          className={`transition-transform transform ${isOpen ? "rotate-180" : ""}`}
        >
          <svg
            className="w-4 h-4 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="p-4 text-sm text-gray-500 bg-gray-100 rounded-md">
          {children}
        </div>
      )}
    </div>
  );
};

const Guide = () => {
  return (
    <div className="max-w-[540px] mx-auto mt-4 p-4 bg-gray-50 rounded-lg space-y-6">
      {/* 이용 혜택 Section */}
      <div className="p-4 bg-white rounded-lg">
        <h2 className="text-base font-semibold mb-2 text-gray-900">
          이용 혜택
        </h2>
        <CustomAccordion title="파티장-파티원 자동 매칭 지원" icon="🧑‍🤝‍🧑">
          <p>
            함께 볼 사람을 힘들게 구할 필요 없이 엔빵가 자동으로 매칭해줘요.
            파티장은 수수료 할인 혜택까지 받을 수 있어요.
          </p>
        </CustomAccordion>
        <CustomAccordion title="정산 스트레스 Zero" icon="💳">
          <p>관리 비용과 정산의 스트레스에서 자유로워지세요.</p>
        </CustomAccordion>
        <CustomAccordion title="저렴한 금액에 화질은 최고" icon="💵">
          <p>
            요금은 혼자 볼 때 보다 최대 75% 저렴하지만 화질은{" "}
            <span className="font-bold">4K 최고 화질</span>로 이용할 수 있어요.
          </p>
        </CustomAccordion>
        <CustomAccordion title="파티장 정산금 100% 보장" icon="🔒">
          <p>
            파티원이 다 모이지 않아도 파티장 정산금은 매달 엔빵가 보장하고
            입금해 드려요.
          </p>
          <p>다른 곳에는 없는 엔빵만의 특별한 제도에요.</p>
        </CustomAccordion>
      </div>

      {/* 간단 설명서 Section */}
      <div className="p-4 bg-white rounded-lg">
        <h2 className="text-base font-semibold mb-2 text-gray-900">
          간단 설명서
        </h2>
        <CustomAccordion title="엔빵은?" icon="🥒">
          <p>
            엔빵은 사람들이 쉽게 모여 영화나 공연을 함께 볼 수 있도록 돕는
            플랫폼입니다.
          </p>
        </CustomAccordion>
        <CustomAccordion title="간단 이용법" icon="📒">
          <p>
            가입 후 원하는 파티에 참가하거나 새로운 파티를 만들 수 있습니다.
          </p>
        </CustomAccordion>
        <CustomAccordion title="파티장 역할" icon="👑">
          <p>파티장은 참가자들을 모집하고 파티를 관리합니다.</p>
        </CustomAccordion>
        <CustomAccordion title="파티원 역할" icon="🙋‍♂️">
          <p>파티원은 파티에 참여하여 함께 즐깁니다.</p>
        </CustomAccordion>
      </div>

      {/* 요금 가이드 Section */}
      <div className="p-4 bg-white rounded-lg">
        <h2 className="text-base font-semibold mb-2 text-gray-900">
          요금 가이드
        </h2>
        <CustomAccordion title="이용 요금표" icon="🧾">
          <p>엔빵의 서비스 이용 요금은 합리적인 가격으로 제공됩니다.</p>
        </CustomAccordion>
        <CustomAccordion title="파티장 정산금" icon="🔄">
          <p>
            파티장의 정산금은 안전하게 처리되며, 모든 거래 내역이 명확히
            제공됩니다.
          </p>
        </CustomAccordion>
      </div>
    </div>
  );
};

export default Guide;
