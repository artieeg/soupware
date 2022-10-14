export type WebhookName =
  | "producer-created"
  | "producer-deleted"
  | "audio-levels";

export type WebhookAudioLevels = {
  levels: Record<string, Record<string, number>>;
};

export type WebhookNewProducer = {
  consumers: {
    consumerParameters: any[];
    user: string;
  }[];
};

export type WebhookPayload = WebhookNewProducer | WebhookAudioLevels;

export type WebhookEvent<T extends WebhookPayload> = {
  name: WebhookName;
  payload: T;
};
