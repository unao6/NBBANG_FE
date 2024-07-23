const Container = ({ children }) => {
  return (
    <div className="max-h-screen">
      <main
        className="w-full max-w-[540px] mx-auto"
        style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 8px 36px" }}
      >
        {children}
      </main>
    </div>
  );
};

export default Container;
