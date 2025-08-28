const { createClient } = require("redis");

const redisOptions = {
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
  },
};

if (process.env.REDIS_PASSWORD) {
  redisOptions.password = process.env.REDIS_PASSWORD;
}

function makeRedisClient() {
  const client = createClient(redisOptions);
  client.on("error", (err) => console.error("Redis Client Error", err));
  return client;
}

module.exports = { makeRedisClient };