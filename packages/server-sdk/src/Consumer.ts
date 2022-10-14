import { Axios } from "axios";

export class Consumer {
  constructor(private client: Axios) {}

  async create({ user, room }: { user: string; room: string }) {
    return await this.client.post("/consumer", { user, room });
  }

  async connect(params: { mediaPermissionToken: string; dtlsParameters: any }) {
    return await this.client.put("/consumer", params);
  }

  async consume(params: {
    mediaPermissionToken: string;
    rtpCapabilities: any;
  }) {
    return await this.client.post("/consumer/consume", params);
  }

  async close(params: { user: string; room: string }) {
    return await this.client.delete("/consumer", { data: params });
  }
}
