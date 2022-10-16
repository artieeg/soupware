import { Axios } from "axios";

export class Consumer {
  constructor(private client: Axios) {}

  async create({ user, room }: { user: string; room: string }): Promise<{
    transportConnectParams: { transportOptions: any; routerRtpParameters: any };
    mediaPermissionToken: string;
  }> {
    return (await this.client.post("/viewer", { user, room })).data;
  }

  async connect(params: { mediaPermissionToken: string; dtlsParameters: any }) {
    return await this.client.put("/viewer", {
      mediaPermissionToken: params.mediaPermissionToken,
      dtls: params.dtlsParameters,
    });
  }

  async consume(params: {
    mediaPermissionToken: string;
    rtpCapabilities: any;
  }) {
    return (await this.client.post("/viewer/consumer", params)).data
      .consumerParameters as { consumerParameters: any }[];
  }

  async close(params: { user: string; room: string }) {
    return await this.client.delete("/viewer", { data: params });
  }
}
