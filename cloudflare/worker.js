/**
 * Qplayer 全球雷达 — Cloudflare Workers + KV
 *
 * 部署步骤（完全免费）：
 *   1. 注册 Cloudflare 账号（免费）
 *   2. 创建 Workers KV 命名空间，名称 "RADAR_KV"
 *   3. 创建 Worker，绑定 KV，粘贴此代码
 *   4. 把 Worker URL 填入 Qplayer 设置 → 全球雷达 URL
 *
 * 免费额度（绰绰有余）：
 *   Workers: 100,000 req/天
 *   KV read: 100,000/天  KV write: 1,000/天
 *   全球 CDN 节点，延迟 <50ms
 *
 * API：
 *   POST /report   { shared: [infohash...], names: {infohash: name} }
 *   GET  /hot      → { hot: [{infohash, shared_by, name, peers}...] }
 *   GET  /health   → { ok: true }
 *
 * KV 数据格式：
 *   key "hot"  → JSON 热榜快照（每 60s 重建一次）
 *   key "node:{id}" → 节点上报数据，TTL=300s
 */

// ── 配置 ──────────────────────────────────────────────────────────────────────
const HOT_LIMIT      = 50;    // 热榜条目数
const NODE_TTL       = 300;   // 节点数据 TTL（秒），超时自动清除
const HOT_CACHE_TTL  = 60;    // 热榜缓存 TTL（秒）
const MAX_SHARED     = 50;    // 单节点最多上报的 infohash 数
const RATE_LIMIT_WIN = 60;    // 限速窗口（秒）
const RATE_LIMIT_MAX = 10;    // 单 IP 每窗口最多请求次数

// ── CORS Headers ──────────────────────────────────────────────────────────────
const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

// ── 简单 IP 限速（用 KV 存计数，仅 write 配额允许时才检查） ─────────────────
async function rateLimited(ip, kv) {
  const key = `rl:${ip}`;
  try {
    const val = await kv.get(key);
    const count = val ? parseInt(val) : 0;
    if (count >= RATE_LIMIT_MAX) return true;
    // 异步写，不阻塞主流程
    kv.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WIN }).catch(() => {});
    return false;
  } catch {
    return false;  // KV 出错时放行，不因限速逻辑阻断正常请求
  }
}

// ── 主处理逻辑 ────────────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url    = new URL(request.url);
    const path   = url.pathname;
    const ip     = request.headers.get("CF-Connecting-IP") || "unknown";
    const kv     = env.RADAR_KV;  // 绑定的 KV 命名空间

    // ── GET /health ──────────────────────────────────────────────────────────
    if (path === "/health" && request.method === "GET") {
      return json({ ok: true, ts: Date.now() });
    }

    // ── GET /hot ─────────────────────────────────────────────────────────────
    if (path === "/hot" && request.method === "GET") {
      try {
        const cached = await kv.get("hot", { type: "json" });
        if (cached && cached.ts && Date.now() - cached.ts < HOT_CACHE_TTL * 1000) {
          return json({ hot: cached.hot, cached: true });
        }
        // 重建热榜（扫描所有 node: 键）
        const hot = await buildHot(kv);
        // 异步更新缓存
        kv.put("hot", JSON.stringify({ hot, ts: Date.now() }), {
          expirationTtl: HOT_CACHE_TTL * 3,
        }).catch(() => {});
        return json({ hot });
      } catch (e) {
        return json({ hot: [], error: String(e) }, 200);
      }
    }

    // ── POST /report ─────────────────────────────────────────────────────────
    if (path === "/report" && request.method === "POST") {
      // 限速：防刷
      if (await rateLimited(ip, kv)) {
        return json({ error: "rate limited" }, 429);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "invalid json" }, 400);
      }

      const shared = Array.isArray(body.shared) ? body.shared : [];
      const names  = (body.names && typeof body.names === "object") ? body.names : {};

      // 校验 infohash 格式（40位或64位十六进制）
      const valid = shared
        .filter(ih => typeof ih === "string" && /^[0-9a-f]{40,64}$/i.test(ih))
        .slice(0, MAX_SHARED)
        .map(ih => ih.toLowerCase());

      if (valid.length === 0) {
        return json({ ok: true, accepted: 0 });
      }

      // 生成节点 ID（基于 IP，不存储原始 IP）
      const nodeId = await hashIp(ip);
      const nodeData = {
        shared: valid,
        names:  Object.fromEntries(
          valid
            .filter(ih => names[ih] && typeof names[ih] === "string")
            .map(ih => [ih, String(names[ih]).slice(0, 128)])
        ),
        ts: Date.now(),
      };

      try {
        await kv.put(`node:${nodeId}`, JSON.stringify(nodeData), {
          expirationTtl: NODE_TTL,
        });
        // 使热榜缓存失效，触发下次重建
        kv.delete("hot").catch(() => {});
      } catch (e) {
        return json({ error: String(e) }, 500);
      }

      return json({ ok: true, accepted: valid.length });
    }

    return json({ error: "not found" }, 404);
  },
};

// ── 重建热榜（扫描 KV 中所有 node: 键） ──────────────────────────────────────
async function buildHot(kv) {
  // list() 返回最多 1000 个键（免费版上限）
  const list = await kv.list({ prefix: "node:" });
  const counts = {};  // infohash -> { count, names: Set, peers: Set }

  const fetches = list.keys.map(async ({ name }) => {
    try {
      const data = await kv.get(name, { type: "json" });
      if (!data || !Array.isArray(data.shared)) return;
      for (const ih of data.shared) {
        if (!counts[ih]) counts[ih] = { count: 0, name: "", ts: 0 };
        counts[ih].count++;
        counts[ih].ts = Math.max(counts[ih].ts, data.ts || 0);
        if (!counts[ih].name && data.names?.[ih]) {
          counts[ih].name = data.names[ih];
        }
      }
    } catch {}
  });

  // 并发拉取（最多 50 个，避免超时）
  await Promise.all(fetches.slice(0, 50));

  const hot = Object.entries(counts)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, HOT_LIMIT)
    .map(([infohash, { count, name }]) => ({
      infohash,
      shared_by: count,
      name,
      source: "global",
    }));

  return hot;
}

// ── IP 哈希（不存储原始 IP，保护隐私） ───────────────────────────────────────
async function hashIp(ip) {
  const data = new TextEncoder().encode(ip + ":qplayer-salt-2026");
  const buf  = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .slice(0, 8)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
