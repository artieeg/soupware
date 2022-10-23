import { useRouter } from "next/router";

export const useRoomId = () => {
  const router = useRouter();

  return router.query.room as string;
};
