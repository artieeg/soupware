import { useQuery } from "@tanstack/react-query";

export function useUserMedia() {
  const userMedia = useQuery(
    ["user-media"],
    () => navigator.mediaDevices.getUserMedia({ video: true, audio: true }),
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
