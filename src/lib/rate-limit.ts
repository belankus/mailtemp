import { isIP } from "node:net";
import Redis from "ioredis";

let redis: Promise<Redis> | undefined;

function getRedis() {
  if (!redis) {
    if (!process.env.REDIS_URL) throw new Error("REDIS_URL is required");
    const client = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      enableOfflineQueue: false,
      connectTimeout: 2000,
      commandTimeout: 2000,
      maxRetriesPerRequest: 1,
    });
    client.on("error", () => console.error("Rate limit Redis unavailable"));
    redis = client.connect().then(() => client).catch((error) => {
      client.disconnect();
      redis = undefined;
      throw error;
    });
  }
  return redis;
}

export function getClientIp(headers: Headers) {
  // Only the trusted proxy can reach the app; it overwrites this header.
  const ip = headers.get("x-real-ip")?.trim();
  if (!ip || !isIP(ip)) throw new Error("Missing or invalid client IP");
  if (ip.startsWith("::ffff:") && isIP(ip.slice(7)) === 4) return ip.slice(7);
  return isIP(ip) === 6 ? new URL(`http://[${ip}]`).hostname.slice(1, -1) : ip;
}

// Redis time and one atomic script keep concurrent requests in the same window.
const script = `
local time = redis.call('TIME')
local now = tonumber(time[1]) * 1000 + math.floor(tonumber(time[2]) / 1000)
local window = tonumber(ARGV[1])
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', now - window)
if redis.call('ZCARD', KEYS[1]) >= tonumber(ARGV[2]) then
  local oldest = redis.call('ZRANGE', KEYS[1], 0, 0, 'WITHSCORES')
  return math.max(1, math.ceil((tonumber(oldest[2]) + window - now) / 1000))
end
redis.call('ZADD', KEYS[1], now, ARGV[3])
redis.call('PEXPIRE', KEYS[1], window)
return 0
`;

export async function limitAddressCreation(ip: string) {
  const client = await getRedis();
  return Number(await client.eval(script, 1, `rate-limit:addresses:${ip}`, 3600000, 5, crypto.randomUUID()));
}
