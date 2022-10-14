import { Axios } from "axios";

export class StreamerImpl {
  client: Axios;

  constructor(client: Axios) {
    this.client = client;
  }

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
  }) {
    return await this.client.post("/streamer", {
      user,
      room,
      permissions,
    });
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
    return await this.client.post("/streamer/producer", params);
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
