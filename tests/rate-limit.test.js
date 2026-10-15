import { afterAll, expect, test } from "bun:test";
import Redis from "ioredis";
import { getClientIp, limitAddressCreation } from "../src/lib/rate-limit";

test("only accepts the proxy's single IP, not forwarded input", () => {
  expect(() => getClientIp(new Headers({ "x-forwarded-for": "1.2.3.4" }))).toThrow();
  expect(() => getClientIp(new Headers({ "x-real-ip": "1.2.3.4, 5.6.7.8" }))).toThrow();
  expect(getClientIp(new Headers({ "x-real-ip": "1.2.3.4", "x-forwarded-for": "5.6.7.8" }))).toBe("1.2.3.4");
  expect(getClientIp(new Headers({ "x-real-ip": "::ffff:192.0.2.1" }))).toBe("192.0.2.1");
  expect(getClientIp(new Headers({ "x-real-ip": "2001:0DB8:0:0:0:0:0:1" }))).toBe("2001:db8::1");
});

const integration = process.env.TEST_REDIS_URL ? test : test.skip;
const keys = [];
let client;

afterAll(async () => {
  if (client) {
    if (keys.length) await client.del(...keys);
    client.disconnect();
  }
});

integration("atomic limit, separate clients, retry time, expiry and TTL", async () => {
  process.env.REDIS_URL = process.env.TEST_REDIS_URL;
  client = new Redis(process.env.TEST_REDIS_URL);
  const ip = `test-${crypto.randomUUID()}`;
  const other = `test-${crypto.randomUUID()}`;
  const key = `rate-limit:addresses:${ip}`;
  keys.push(key, `rate-limit:addresses:${other}`);
  const results = await Promise.all(Array.from({ length: 20 }, () => limitAddressCreation(ip)));
  expect(results.filter(value => value === 0)).toHaveLength(5);
  expect(results.filter(value => value > 0)).toHaveLength(15);
  expect(Math.max(...results)).toBeLessThanOrEqual(3600);
  expect(await limitAddressCreation(other)).toBe(0);
  expect(await client.pttl(key)).toBeGreaterThan(3500000);
  const now = await client.time();
  const old = Number(now[0]) * 1000 - 3600001;
  const members = await client.zrange(key, 0, -1);
  for (const member of members) await client.zadd(key, old, member);
  expect(await limitAddressCreation(ip)).toBe(0);
  expect(await client.zcard(key)).toBe(1);
});
