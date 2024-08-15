import React, { useEffect, useState } from "react";

import { getAllOtt } from "../../api/ott/ottApi.js";
import { getOttImage } from "../../components/OttImage.js";
import { subscribeOtt } from "../../api/party/partyApi.js";
import { useNavigate } from "react-router-dom";

const OttSelection = () => {
  const [ottList, setOttList] = useState([]);
  const [selectedOtt, setSelectedOtt] = useState(null);
  const [subscribedOttIds, setSubscribedOttIds] = useState([]); // 유저가 이용 중인 OTT ID 목록
  const navigate = useNavigate();

  useEffect(() => {
    // 전체 OTT 리스트를 가져옴
    getAllOtt()
      .then((response) => setOttList(response.data))
      .catch((error) => console.error("Error fetching OTT data : ", error));

    // 현재 유저가 이용 중인 OTT 서비스 가져오기
    subscribeOtt()
      .then((response) =>
        setSubscribedOttIds(response.data.map((ott) => ott.ottId)),
      )
      .catch((error) =>
        console.error("Error fetching user subscribed OTT data : ", error),
      );
  }, []);

  const handleOttClick = (ott) => {
    setSelectedOtt(ott);
  };

  const handleNextClick = () => {
    if (selectedOtt && !subscribedOttIds.includes(selectedOtt.ottId)) {
      navigate(`/add-party/${selectedOtt.ottId}`); // navigate로 페이지 이동
    }
  };

  const isSubscribedOtt =
    selectedOtt && subscribedOttIds.includes(selectedOtt.ottId);

  return (
    <div className="min-h-full flex flex-col items-center bg-gray-50 p-2">
      <main className="w-full flex flex-col items-center mt-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-4 p-6 bg-white rounded shadow-lg w-full">
          <h2 className="text-lg font-semibold mb-4 text-center">
            이용을 원하는 서비스를 선택하세요
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {ottList.map((ott) => (
              <div
                key={ott.ottId}
                className={`relative flex flex-col items-center p-4 rounded-lg cursor-pointer ${
                  selectedOtt?.ottId === ott.ottId ? "border-2 border-primary" : "bg-white"
                }`}
                onClick={() => handleOttClick(ott)}
              >
                <div className="relative w-full h-12 flex items-center justify-center">
                  <img
                    src={getOttImage(ott.name)}
                    alt={ott.name}
                    className="object-contain h-full"
                  />
                  {selectedOtt?.ottId === ott.ottId && (
                    <div className="absolute top-0 right-0 bg-accent text-white rounded-full w-4 h-4 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </div>
                <span className="text-center mt-2">{ott.name}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedOtt && (
          <div className="mt-6 p-6 bg-white rounded-xl shadow-xl w-full">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <div className="flex flex-col">
                <h3 className="text-xl text-gray-800 font-semibold">
                  {selectedOtt.name}
                </h3>
                <p className="text-sm text-gray-500">
                  정상 가격과 할인가를 확인하세요
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 line-through">
                  월 {selectedOtt.price.toLocaleString()}원
                </p>
                <p className="text-2xl text-accent font-bold">
                  월{" "}
                  {Math.floor(
                    selectedOtt.price / selectedOtt.capacity,
                  ).toLocaleString()}
                  원
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className={`py-3 px-32 rounded-full shadow-md ${
                  isSubscribedOtt
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-primary hover:accent text-white"
                }`}
                onClick={handleNextClick}
                disabled={isSubscribedOtt}
              >
                {isSubscribedOtt ? "이미 이용 중인 서비스입니다" : "다음"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OttSelection;
