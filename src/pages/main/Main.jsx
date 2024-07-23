import Content from "../../components/Content";
import React from "react";

const Main = () => {
  return (
    <>
      <div className="h-[200vh]">
        <h1 className="text-3xl mb-4">Welcome to the Main Page</h1>
        <p className="text-lg mb-8">
          This is a responsive web page that looks consistent across mobile
          phones, PCs, and tablets.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-200 p-4 rounded">구역1 1</div>
          <div className="bg-gray-200 p-4 rounded">구역2 2</div>
          <div className="bg-gray-200 p-4 rounded">구역33</div>
        </div>
      </div>
    </>
  );
};

export default Main;
