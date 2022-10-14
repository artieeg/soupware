import React from "react";

export interface TextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const TextButton: React.FC<TextButtonProps> = (props) => {
  return (
    <div className="flex h-[6rem] w-[30rem] items-center justify-center rounded-full border-none bg-white text-center align-middle text-[1.8rem] font-bold text-gray-1000 no-underline">
      {props.title}
    </div>
  );
};
