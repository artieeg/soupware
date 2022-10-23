import { useState } from "react";
import { User } from "../types";
import { trpc } from "../utils/trpc";
import { useRoomId } from "./useRoomId";

export function useRoomParticipants() {
  const room = useRoomId();

  const [users, setUsers] = useState<User[]>([]);

  trpc.room.onNewUser.useSubscription(
    { room },
    {
      onData: (user) => {
        setUsers((prev) => [...prev, user]);
      },
    }
  );

  return users;
}
