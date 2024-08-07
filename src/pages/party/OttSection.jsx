import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 가져오기
import { getAllOtt } from "../../api/ott/ottApi.js";
import { getOttImage } from '../../components/OttImage.js';
import { subscribeOtt } from "../../api/party/partyApi.js";

const OttSelection = () => {
  const [ottList, setOttList] = useState([]);
  const [selectedOtt, setSelectedOtt] = useState(null);
  const [subscribedOttIds, setSubscribedOttIds] = useState([]); // 유저가 이용 중인 OTT ID 목록
  const navigate = useNavigate(); // 여기에서 useNavigate 훅을 사용해 navigate를 초기화

  useEffect(() => {
    // 전체 OTT 리스트를 가져옴
    getAllOtt()
      .then((response) => setOttList(response.data))
      .catch((error) => console.error("Error fetching OTT data : ", error));

    // 현재 유저가 이용 중인 OTT 서비스 가져오기
    subscribeOtt()
      .then((response) => setSubscribedOttIds(response.data.map(ott => ott.ottId)))
      .catch((error) => console.error("Error fetching user subscribed OTT data : ", error));
  }, []);

  const handleOttClick = (ott) => {
    setSelectedOtt(ott);
  };

  const handleNextClick = () => {
    if (selectedOtt && !subscribedOttIds.includes(selectedOtt.ottId)) {
      navigate(`/add-party/${selectedOtt.ottId}`);  // navigate로 페이지 이동
    }
  };

  const isSubscribedOtt = selectedOtt && subscribedOttIds.includes(selectedOtt.ottId);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <main className="w-full flex flex-col items-center mt-8 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">보고싶은 OTT를 선택해주세요</h2>
        <div className="grid grid-cols-3 p-2 bg-white rounded-lg shadow-lg w-full">
          {ottList.map((ott) => (
            <div
              key={ott.ottId}
              className={`relative flex flex-col items-center p-2 rounded-lg cursor-pointer w-40 h-40 ${
                selectedOtt?.ottId === ott.ottId ? "bg-green-100" : "bg-white"
              }`}
              onClick={() => handleOttClick(ott)}
            >
              <img
                src={getOttImage(ott.name)}
                alt={ott.name}
                className="w-16 h-16 mb-2"
              />
              <span className="text-center">{ott.name}</span>
            </div>
          ))}
        </div>

        {selectedOtt && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-lg w-full">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="text-blue-500 font-semibold">{selectedOtt.name}</h3>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-gray-700 line-through">월 {selectedOtt.price.toLocaleString()}원</p>
                <p className="text-black-500 text-xl font-bold">
                  월 {Math.floor(selectedOtt.price / selectedOtt.capacity).toLocaleString()}원
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                className={`mt-4 py-2 px-8 rounded-full shadow-lg w-full ${
                  isSubscribedOtt ? "bg-gray-400 text-gray-600 cursor-not-allowed" : "bg-green-500 text-white"
                }`}
                onClick={handleNextClick}
                disabled={isSubscribedOtt}
              >
                {isSubscribedOtt ? "이용중인 OTT 서비스입니다" : "다음"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OttSelection;