import React from "react";

export const AppLayout: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <main
      className={`container flex  min-h-screen min-w-full flex-col bg-gray-1000 ${
        className ?? ""
      }`}
    >
      {children}
    </main>
  );
};
