import './Main.css';

import React from "react";

const Main = () => {
  return (
    <>
      <div className="h-full w-full flex items-center justify-center overflow-hidden relative">
        <div className="floating-background"></div>
        <div className="floating-element animate-float" style={{ top: '10%', left: '10%' }}>
          <img src={`${process.env.PUBLIC_URL}/assets/imgs/nbbang.png`} alt="Bread" className="floating-image" />
        </div>
        <div className="floating-element animate-float" style={{ top: '30%', left: '30%' }}>
          <img src={`${process.env.PUBLIC_URL}/assets/imgs/nbbang.png`} alt="Bread" className="floating-image" />
        </div>
        <div className="floating-element animate-float" style={{ top: '50%', left: '50%' }}>
          <img src={`${process.env.PUBLIC_URL}/assets/imgs/nbbang.png`} alt="Bread" className="floating-image" />
        </div>
        <div className="floating-element animate-float" style={{ top: '70%', left: '70%' }}>
          <img src={`${process.env.PUBLIC_URL}/assets/imgs/nbbang.png`} alt="Bread" className="floating-image" />
        </div>
        <div className="floating-element animate-float" style={{ top: '90%', left: '90%' }}>
          <img src={`${process.env.PUBLIC_URL}/assets/imgs/nbbang.png`} alt="Bread" className="floating-image" />
        </div>
      </div>
    </>
  );
};

export default Main;
