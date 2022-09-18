import axios from "axios";

const URL = process.env.URL || "http://localhost:3000";
axios.defaults.baseURL = URL;

export async function main() {
  const apiTokenResp = await axios.post("/token");

  console.log({ apiToken: apiTokenResp.data.token });
}
