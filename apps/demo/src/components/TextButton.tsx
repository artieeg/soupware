import React from "react";

export interface TextButtonProps
  extends React.ButtonHTMLAttributes<HTMLDivElement> {}

export const TextButton: React.FC<TextButtonProps> = (props) => {
  return (
    <div
      {...props}
      className="flex h-[6rem] w-[30rem] select-none items-center justify-center rounded-full border-none bg-white text-center align-middle text-[1.8rem] font-bold text-gray-1000 no-underline hover:cursor-pointer"
    >
      {props.title}
    </div>
  );
};
