import { SoupwareClient } from "@soupware/server";

export const soupware = new SoupwareClient({
  url: "http://localhost:3000",
  apiKey: "1234567890",
  secret: "dev",
});
