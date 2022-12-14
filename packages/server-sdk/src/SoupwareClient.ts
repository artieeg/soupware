import axios, { AxiosInstance } from "axios";
import { Consumer } from "./Consumer";
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
  private _consumer: Consumer;
  private _webhook: WebhookHandler;

  constructor(config: ServerClientConfig) {
    this.axios = axios.create({
      baseURL: config.url,
      headers: {
        "SOUPWARE-API-KEY": config.apiKey,
      },
    });

    this._webhook = new WebhookHandler(config.secret);
    this._consumer = new Consumer(this.axios);
    this._streamer = new Streamer(this.axios);
  }

  get webhook() {
    return this._webhook;
  }

  get streamer() {
    return this._streamer;
  }

  get consumer() {
    return this._consumer;
  }
}
