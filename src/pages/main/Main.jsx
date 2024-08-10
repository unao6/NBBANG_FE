import React from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  const handlePaymentClick = () => {
    navigate("/payment");
  };

  return (
    <>
      <div className="h-full">
        <h1 className="text-3xl mb-4">Welcome to the Main Page</h1>
        <p className="text-lg mb-8">
          This is a responsive web page that looks consistent across mobile
          phones, PCs, and tablets.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-200 p-4 rounded">구역1 1</div>
          <div className="bg-gray-200 p-4 rounded">구역2 2</div>
          <div className="bg-gray-200 p-4 rounded">구역3 3</div>
        </div>
        <div className="mt-8">
          <button
            onClick={handlePaymentClick}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            결제하기
          </button>
        </div>
      </div>
    </>
  );
};

export default Main;
