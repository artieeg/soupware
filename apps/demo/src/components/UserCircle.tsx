import React from "react";

export interface UserCircleProps {
  media?: MediaStream;
}

export const UserCircle: React.FC<UserCircleProps> = ({ media }) => {
  if (media) {
    return (
      <video
        className="h-[15rem] w-[15rem] rounded-full object-cover"
        autoPlay
        playsInline
        muted
        ref={(ref) => {
          if (ref && media) {
            ref.srcObject = media;
          }
        }}
      />
    );
  } else {
    return <div className="h-[15rem] w-[15rem] rounded-full bg-brand-0"></div>;
  }
};
