import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
redisClient.on("connect", () => console.log(" Redis Connected"));
redisClient.on("error", (err) => console.error(" Redis Error:", err));

await redisClient.connect();

export default redisClient;
