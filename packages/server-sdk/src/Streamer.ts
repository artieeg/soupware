import { Axios } from "axios";
import { CreateStreamerResponse } from "./types";

export class StreamerImpl {
  constructor(private client: Axios) {}

  async create({
    user,
    room,
    permissions,
  }: {
    user: string;
    room: string;
    permissions: {
      audio: boolean;
      video: boolean;
    };
  }): Promise<CreateStreamerResponse> {
    return (
      await this.client.post("/streamer", {
        user,
        room,
        permissions,
      })
    ).data;
  }

  async connect(params: {
    mediaPermissionToken: string;
    dtlsParameters: any;
    rtpCapabilities: any;
  }) {
    return await this.client.put("/streamer", params);
  }

  async produce(params: {
    mediaPermissionToken: string;
    producerOptions: {
      kind: string;
      rtpParameters: any;
      appData: any;
    };
  }) {
    return (await this.client.post("/streamer/producer", params)).data.id;
  }

  async close(params: {
    user: string;
    room: string;
    kinds: {
      audio: boolean;
      video: boolean;
    };
  }) {
    return await this.client.delete("/streamer", { data: params });
  }
}
