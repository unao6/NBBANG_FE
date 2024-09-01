import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AccountRegisterModal from "../payment/fragments/AccountRegisterModal";
import { createParty } from "../../api/party/partyApi";
import { getAccountInfo } from "../../api/payment/accountApi";
import { getBankImage } from "../../components/BankImage";
import { getOttImage } from "../../components/OttImage.js";
import useOttStore from "../../store/ottStore";

const AccountRegistration = () => {
  const { ottId } = useParams();
  const { ottInfo, setOttInfo } = useOttStore();
  const navigate = useNavigate();
  const [ottAccount, setOttAccount] = useState("");
  const [password, setPassword] = useState("");
  const [partyCreated, setPartyCreated] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchAccountInfo = async () => {
    try {
      const data = await getAccountInfo();
      if (!data) {
        setModalOpen(true);
      }
      setAccountInfo(data);
    } catch (error) {
      console.error("Error fetching account info:", error);
    }
  };

  useEffect(() => {
    if (!ottInfo && ottId) {
      setOttInfo(ottId);
    }
    if (!partyCreated && !modalOpen && !accountInfo) {
      fetchAccountInfo();
    }
  }, [ottId, ottInfo, partyCreated, modalOpen, accountInfo, setOttInfo]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!accountInfo) {
      alert("파티를 생성하기 전에 계좌를 등록해 주세요.");
      setModalOpen(true);
      return;
    }

    const partyData = {
      ottId,
      ottAccountId: ottAccount,
      ottAccountPassword: password,
    };

    try {
      await createParty(partyData);
      setPartyCreated(true);
    } catch (error) {
      console.error("파티 생성 중 오류 발생:", error);
      alert("파티 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAccountUpdateSuccess = () => {
    fetchAccountInfo();
    handleCloseModal();
  };

  if (partyCreated) {
    const { name } = ottInfo;
    const ottImage = getOttImage(name);

    return (
      <div className="min-h-full items-center justify-center bg-gray-100 p-4">
        <main className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
          <img
            src={ottImage}
            alt={`${name} 파티 생성 성공 이미지`}
            className="mx-auto my-8 w-32 h-32 object-contain"
          />
          <p className="text-2xl font-bold">{name} 파티가 생성됐어요!</p>
          <p className="text-gray-500 mt-2">
            이제 더 저렴한 금액으로 {name}을 즐길 수 있어요
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white font-bold py-2 px-6 mt-4 rounded-lg shadow-md hover:bg-accent transition duration-200"
          >
            홈으로 이동
          </button>
          <div className="pb-8" />
        </main>
      </div>
    );
  }

  const { name } = ottInfo;
  const ottImage = getOttImage(name);

  return (
    <div className="min-h-full flex flex-col items-center bg-gray-100 p-4">
      <main className="w-full max-w-2xl mx-auto mt-4 p-4 pt-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-center">
          파티원과 공유할 {name} 계정을 입력해주세요
        </h2>

        {/* OTT 정보 표시 */}
        <div className="bg-white p-4 rounded-lg mb-6 flex items-center shadow-md">
          <img src={ottImage} alt={name} className="w-20 h-20 object-contain" />
          <div className="ml-4 mt-2 text-primary text-sm">
            <p className="font-bold">{name} 프리미엄 이용권</p>
            <p>구독 중인 계정</p>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="bg-primary text-white p-4 rounded-lg mb-6">
          <h4 className="font-semibold">주의사항</h4>
          <p className="text-sm mt-2">
            {name} ID로 가입한 계정만 공유가 가능합니다.
          </p>
        </div>

        {/* 계정 입력 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="ottAccount"
              className="block text-gray-700 font-semibold mb-2"
            >
              ID
            </label>
            <input
              type="text"
              id="ottAccount"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={`${name} 아이디 입력`}
              value={ottAccount}
              onChange={(e) => setOttAccount(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              PW
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={`${name} 비밀번호 입력`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 체크박스 및 경고 */}
          <div className="mb-4 text-sm font-semibold text-black">
            <p>✔ 공유 가능한 안전한 비밀번호를 사용해주세요.</p>
          </div>

          {/* 계좌 정보 표시 */}
          <div className="bg-white p-4 rounded-lg mb-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              정산 계좌 정보
            </h3>
            {accountInfo ? (
              <div className="flex items-center">
                <img
                  src={getBankImage(accountInfo.bankName)}
                  alt={accountInfo.bankName}
                  className="w-10 h-10 object-contain mr-4"
                />
                <div>
                  <p className="text-sm font-semibold">
                    {accountInfo.bankName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {accountInfo.accountNumber}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="text-primary font-bold ml-auto"
                >
                  변경
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  계좌가 등록되어 있지 않습니다. 먼저 계좌를 등록해주세요.
                </p>
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="text-white bg-primary mb-2 border-2 border-primary py-1 px-4 rounded-lg"
                >
                  계좌 등록하기
                </button>
              </div>
            )}
            {/* 체크박스 및 경고 */}
            <div className="mt-8 mb-4 text-sm text-gray-600">
              <p>✔ 계좌 정보를 입력해야 파티를 생성할 수 있어요.</p>
            </div>
          </div>

          {/* 버튼 */}
          <button
            type="submit"
            className={`w-full py-3 rounded-full shadow-md transition duration-200 ${
              accountInfo
                ? "bg-secondary text-black cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!accountInfo} // 계좌 정보가 없으면 비활성화
          >
            파티 생성하기
          </button>
        </form>
      </main>

      <AccountRegisterModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmitSuccess={handleAccountUpdateSuccess}
      />
    </div>
  );
};

export default AccountRegistration;
