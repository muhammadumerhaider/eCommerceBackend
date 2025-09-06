import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await client.connect();
  console.log("Redis connected");
})();

export default client;