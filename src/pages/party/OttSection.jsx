import React, { useEffect, useState } from "react";
import { getAllOtt } from "../../api/ott/ottApi.js";

const OttSelection = () => {
  const [ottList, setOttList] = useState([]);
  const [selectedOtt, setSelectedOtt] = useState(null);

  useEffect(() => {
    getAllOtt()
      .then((response) => setOttList(response.data))
      .catch((error) => console.error("Error fetching OTT data : ", error));
  }, []);

  const getOttImage = (name) => {
    // 로컬에 저장된 이미지나 CDN에서 이미지 가져오기
    switch (name) {
      case "디즈니플러스":
        return "/assets/imgs/disney.png"; // 로컬 이미지 경로 예시
      case "ChatGPT":
        return "/assets/imgs/ChatGPT.png";
      case "티빙":
        return "/assets/imgs/tving.png";
      default:
        return "/assets/imgs/nbbang.png";
    }
  };

  const handleOttClick = (ott) => {
    setSelectedOtt(ott);
  };

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
          <div className="mt-4 p-4 bg-white rounded-lg shadow-lg text-center w-full">
            <h3 className="text-blue-500 font-semibold">{selectedOtt.name} 프리미엄</h3>
            <p className="text-gray-700">월 {selectedOtt.price.toLocaleString()}원</p>
            <p className="text-green-500 text-xl font-bold">
              {Math.floor(selectedOtt.price / selectedOtt.capacity).toLocaleString()}원
            </p>
            <button className="mt-4 bg-green-500 text-white py-2 px-8 rounded-full shadow-lg">
              다음
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default OttSelection;
