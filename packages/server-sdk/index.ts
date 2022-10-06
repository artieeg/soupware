import axios, { AxiosInstance } from "axios";

type ServerClientConfig = {
  /** Orchestrator's URL */
  url: string;
  apiKey: string;
};

export class SoupwareClient {
  private apiKey: string;
  private axios: AxiosInstance;

  constructor(config: ServerClientConfig) {
    this.axios = axios.create({
      baseURL: config.url,
      headers: {
        "SOUPWARE-API-KEY": config.apiKey,
      },
    });
  }
}
