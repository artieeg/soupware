import { WebhookPayload } from "@soupware/shared";
import * as crypto from "crypto";

export class WebhookHandler {
  constructor(private secret: string) {}

  handle<T extends WebhookPayload>({
    event,
    signature,
  }: {
    event: T;
    signature: string;
  }): T {
    const evt = JSON.stringify(event);

    // Verify signature
    const hmac = crypto.createHmac("sha256", this.secret);
    hmac.update(evt);
    const expectedSignature = hmac.digest("hex");

    if (signature !== expectedSignature) {
      throw new Error("Invalid signature");
    }

    return event;
  }
}
