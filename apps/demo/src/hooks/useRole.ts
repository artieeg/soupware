import { useRouter } from "next/router";

export const useRole = () => {
  const router = useRouter();

  return (router.query.role as string) ?? "viewer";
};
