# Qplayer Engine HTTP API

The embedded engine daemon listens on `http://127.0.0.1:8800` by default.  
The port is auto-selected to avoid conflicts — check the actual port from the application logs at `~/.qplayer/logs/qplayer.log`.

All request/response bodies are JSON (`Content-Type: application/json`).

---

## Endpoints

### `POST /api/add`

Add a resource for streaming. The engine fetches metadata, prioritizes head/tail pieces, and returns a stream URL immediately.

**Request**
```json
{
  "source": "magnet:?xt=urn:btih:...",
  "known_peers": ["192.168.1.5", "192.168.1.6:6881"]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | string | ✅ | Magnet link or `.torrent` file path |
| `known_peers` | string[] | ❌ | Known peer IPs (LAN Radar direct-connect) |

**Response** — success
```json
{
  "play_mode": "stream",
  "media_index": 0,
  "files": [
    { "index": 0, "path": "video.mkv", "size": 1073741824 }
  ]
}
```

**Response** — local cache hit (previously completed download)
```json
{
  "play_mode": "local",
  "local_path": "C:\\Users\\...\\Videos\\Qplay Media\\video.mkv",
  "media_index": 0,
  "files": [...]
}
```

| `play_mode` | Meaning |
|-------------|---------|
| `stream` | Stream from `/stream/<media_index>` while downloading |
| `direct` | Direct playback (mp4/m4v/webm, no proxy needed) |
| `local` | Already fully downloaded — play local file directly |

**Error codes**

| HTTP | Meaning |
|------|---------|
| 409 | Another `add` is in progress — wait and retry |
| 504 | Metadata timeout — magnet has no active peers |
| 400 | Invalid `source` field |

---

### `GET /api/status`

Poll download and seeding status. Call at ~1s intervals during playback.

**Response**
```json
{
  "state": "downloading",
  "progress": 0.1234,
  "download_rate": 512000,
  "upload_rate": 128000,
  "num_peers": 12,
  "num_seeds": 3,
  "media_index": 0,
  "play_mode": "stream",
  "media_progress": 0.0892,
  "media_size": 1073741824,
  "seeding_count": 2,
  "seeding_upload_rate": 65536
}
```

| Field | Description |
|-------|-------------|
| `state` | libtorrent state string (`downloading`, `seeding`, `finished`, etc.) |
| `progress` | Overall torrent progress (0–1) |
| `media_progress` | Media file progress (0–1), more accurate for multi-file torrents |
| `download_rate` | Bytes/sec download |
| `upload_rate` | Bytes/sec upload |
| `seeding_count` | Number of torrents in the background seed pool |

**Special states**

| `state` | Meaning |
|---------|---------|
| `idle` | No active torrent |
| `waiting_metadata` | Fetching metadata from DHT/tracker |

---

### `GET /api/radar`

Get LAN and Global radar snapshot.

**Response**
```json
{
  "enabled": true,
  "self": { "node_id": "a1b2c3d4e5f6", "nick": "qplayer-a1b2" },
  "neighbor_count": 2,
  "neighbors": [
    {
      "node_id": "...",
      "nick": "qplayer-xxxx",
      "ip": "192.168.1.10",
      "shared": ["abc123...", "def456..."],
      "names": { "abc123...": "Movie.mkv" },
      "last_seen": 1723165200.0
    }
  ],
  "hot_resources": [
    { "infohash": "abc123...", "shared_by": 2, "name": "Movie.mkv" }
  ],
  "global_enabled": true,
  "global_hot": [
    {
      "infohash": "xyz789...",
      "shared_by": 47,
      "name": "Documentary.mkv",
      "source": "global",
      "peers": ["1.2.3.4", "5.6.7.8"]
    }
  ]
}
```

**To play a radar resource directly** — POST to `/api/add` with the infohash as a magnet link and the peer IPs as `known_peers`:
```json
{
  "source": "magnet:?xt=urn:btih:<infohash>",
  "known_peers": ["192.168.1.10"]
}
```

---

### `GET /api/files`

List files in the current torrent.

**Response**
```json
{
  "files": [
    { "index": 0, "path": "video.mkv", "size": 1073741824 },
    { "index": 1, "path": "subtitles.srt", "size": 45678 }
  ],
  "media_index": 0
}
```

---

### `POST /api/seek`

Prioritize download from a specific byte offset (called when the user seeks in the player).

**Request**
```json
{ "offset": 536870912 }
```

**Response**
```json
{ "ok": true, "offset": 536870912 }
```

---

### `POST /api/stop`

Stop the current download. The torrent moves to the background seed pool.

**Response**
```json
{ "ok": true }
```

---

### `POST /api/seed`

Enable or disable seeding (upload rate control).

**Request**
```json
{ "enabled": false }
```

**Response**
```json
{ "ok": true, "seeding_enabled": false }
```

---

### `GET /api/discovery`

Get Hybrid discovery layer report (tracker vs DHT health stats).

**Response**
```json
{
  "faster": "dht",
  "sources": {
    "tracker": {
      "name": "tracker",
      "first_peer_ms": 1234.5,
      "replies": 3,
      "peers_seen": 47,
      "health": 0.82,
      "fresh": true
    },
    "dht": {
      "name": "dht",
      "first_peer_ms": 800.0,
      "replies": 12,
      "peers_seen": 200,
      "health": 1.24,
      "fresh": true
    }
  }
}
```

---

### `GET /stream/<file_index>`

Stream a file from the active torrent. Supports HTTP Range requests for seeking.

**Headers (optional)**
```
Range: bytes=536870912-
```

**Response** — `200 OK` (full) or `206 Partial Content` (range)

The engine blocks until the requested piece is downloaded, up to a 30-second timeout.  
For non-native formats (not mp4/webm), the response may be a `302` redirect to `/hls/<index>/playlist.m3u8`.

---

### `GET /hls/<file_index>/playlist.m3u8`

HLS manifest for transcoded streams (FFmpeg required).

### `GET /hls/<file_index>/<segment.ts>`

HLS transport stream segment.

### `GET /hls/<file_index>/remux`

Fragmented MP4 output for remux-eligible files (h264 in non-mp4 container).  
Supports Range requests.

---

## Integration Example

```python
import requests

BASE = "http://127.0.0.1:8800"

# Add a magnet link
resp = requests.post(f"{BASE}/api/add", json={
    "source": "magnet:?xt=urn:btih:abc123..."
}, timeout=150)
data = resp.json()

stream_url = f"{BASE}/stream/{data['media_index']}"
print(f"Play: {stream_url}")

# Poll status
import time
while True:
    s = requests.get(f"{BASE}/api/status").json()
    print(f"  {s['state']} {s.get('media_progress', 0)*100:.1f}% "
          f"↓{s['download_rate']/1024:.0f}kB/s peers={s['num_peers']}")
    if s.get('media_progress', 0) >= 1.0:
        print("Download complete!")
        break
    time.sleep(1)
```
