import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export function useUserMedia() {
  const router = useRouter();

  const userMedia = useQuery(
    ["user-media"],
    () =>
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      }),
    {
      enabled: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return {
    media: userMedia.data,
    loading: userMedia.isLoading,
  };
}
