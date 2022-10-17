import React from "react";

export interface UserCircleProps {
  media?: MediaStream;
}

export const UserCircle: React.FC<UserCircleProps> = ({ media }) => {
  if (media) {
    return (
      <video
        className="flex-1 overflow-hidden rounded-[2rem] bg-gray-1100 object-cover"
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
    return <div className="flex-1 rounded-[2rem] bg-gray-1100"></div>;
  }
};
