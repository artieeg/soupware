import { useQuery } from "@tanstack/react-query";

export const useMediaPermissionToken = (direction: "send" | "recv") => {
  const r = useQuery<string>(["media-permission-token", direction]);

  return r.data;
};
