import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
     ...(isProduction && { tls: true }), // Use TLS only in production
  },
   ...(isProduction && { password: process.env.REDIS_PASSWORD }), // Use password only in production

});
redisClient.on("connect", () => console.log(" Redis Connected"));
redisClient.on("error", (err) => console.error(" Redis Error:", err));

await redisClient.connect();

export default redisClient;
