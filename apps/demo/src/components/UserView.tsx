import React from "react";

export interface UserViewProps {
  media?: MediaStream;
}

export const UserView: React.FC<UserViewProps> = ({ media }) => {
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
