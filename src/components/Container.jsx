const Container = ({ children }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <main
        className="flex-grow w-full max-w-[540px] mx-auto flex flex-col overflow-hidden"
        style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 8px 36px" }}
      >
        {children}
      </main>
    </div>
  );
};

export default Container;
