import axios, { AxiosInstance } from "axios";
import { StreamerImpl as Streamer } from "./Streamer";
import { WebhookHandler } from "./WebhookHandler";

type ServerClientConfig = {
  /** Orchestrator's URL */
  url: string;
  apiKey: string;
  secret: string;
};

export class SoupwareClient {
  private axios: AxiosInstance;
  private _streamer: Streamer;
  private _webhook: WebhookHandler;

  constructor(config: ServerClientConfig) {
    this.axios = axios.create({
      baseURL: config.url,
      headers: {
        "SOUPWARE-API-KEY": config.apiKey,
      },
    });

    this._webhook = new WebhookHandler(config.secret);
    this._streamer = new Streamer(this.axios);
  }

  get webhook() {
    return this._webhook;
  }

  get streamer() {
    return this._streamer;
  }
}
