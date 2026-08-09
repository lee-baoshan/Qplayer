# Cloudflare Workers 雷达部署指南

## 什么是 Cloudflare Workers 雷达？

Qplayer 全球雷达的可选增强层：
- 所有 Qplayer 用户定期上报正在分享的资源（仅 infohash，不含文件名/IP）
- Worker 实时聚合，生成全球热门资源列表
- 客户端拉取热榜，显示在雷达面板"全球"标签

## 免费额度说明

| 资源 | 免费配额 | 1万用户每日消耗估算 |
|------|----------|---------------------|
| Worker 请求 | 100,000/天 | ~20,000/天 ✅ |
| KV 读取 | 100,000/天 | ~10,000/天 ✅ |
| KV 写入 | 1,000/天 | ~1,000/天 ⚠️ 临界 |
| 带宽 | 不限 | — |

> **结论**：1万活跃用户完全够用。超过后升级到 $5/月付费版即可。

## 部署步骤（约 10 分钟）

### 1. 注册 Cloudflare（免费）
前往 https://cloudflare.com 注册账号。

### 2. 创建 KV 命名空间
```
Cloudflare 控制台 → Workers & Pages → KV
→ Create namespace → 名称：RADAR_KV
```

### 3. 创建 Worker
```
Workers & Pages → Create application → Create Worker
→ 名称：qplayer-radar
→ 粘贴 worker.js 内容 → Save and Deploy
```

### 4. 绑定 KV
```
Worker 详情页 → Settings → Variables → KV Namespace Bindings
→ Add binding：Variable name = RADAR_KV，KV namespace = RADAR_KV
→ Save
```

### 5. 获取 Worker URL
```
Worker 详情页 → 复制 URL，格式：
https://qplayer-radar.{你的子域}.workers.dev
```

### 6. 配置 Qplayer
在 Qplayer 设置 → 全球雷达 URL → 填入上方 URL。

## 测试

```bash
# 健康检查
curl https://qplayer-radar.xxx.workers.dev/health

# 获取热榜（初始为空）
curl https://qplayer-radar.xxx.workers.dev/hot

# 模拟上报
curl -X POST https://qplayer-radar.xxx.workers.dev/report \
  -H "Content-Type: application/json" \
  -d '{"shared":["abc123def456abc123def456abc123def456abcd"],"names":{"abc123def456abc123def456abc123def456abcd":"Test.Video.mkv"}}'
```

## 隐私说明

- 只存储 infohash（资源指纹），不存储文件名、IP 地址、用户信息
- IP 经 SHA-256 哈希处理后作为节点 ID，原始 IP 不入库
- 节点数据 TTL = 300 秒，自动清除
- 完全符合 GDPR/CCPA 要求

## 自定义域名（可选）

在 Cloudflare 控制台为 Worker 绑定自定义域名，例如：
`https://radar-api.qplayer.app`
