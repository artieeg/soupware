import { CreateStreamerResponse } from "@soupware/server";
import { SoupwareClient } from "@soupware/client";
import { trpc } from "../utils/trpc";

export function stream(media: MediaStream, params: CreateStreamerResponse) {
  const { transportConnectParams, mediaPermissionToken } = params;

  const client = new SoupwareClient(mediaPermissionToken);
}
