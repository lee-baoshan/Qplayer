# Qplayer

> P2P streaming media player — LAN & Global Radar, magnet links, BitTorrent

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](#license)
[![Platform](https://img.shields.io/badge/Platform-Windows-lightgrey)](https://github.com/lee-baoshan/Q-Player/releases)
[![Releases](https://img.shields.io/github/v/release/lee-baoshan/Q-Player)](https://github.com/lee-baoshan/Q-Player/releases)
[![Stars](https://img.shields.io/github/stars/lee-baoshan/Q-Player?style=social)](https://github.com/lee-baoshan/Q-Player/stargazers)

**[中文文档](README_zh.md)** · [Download](https://github.com/lee-baoshan/Q-Player/releases) · [Report Bug](https://github.com/lee-baoshan/Q-Player/issues) · [Request Feature](https://github.com/lee-baoshan/Q-Player/issues)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **P2P Streaming** | libtorrent engine — sequential download with head/tail priority, play while downloading |
| **Magnet Links** | Paste `magnet:?xt=...` and play instantly |
| **LAN Radar** | Discover peers on the same network via UDP broadcast — zero DHT delay |
| **Global Radar** | DHT-based global peer discovery + optional Cloudflare Workers hot list |
| **All Formats** | mpv decoding for mkv/mp4/webm/avi/rmvb; non-native formats via FFmpeg transcoding |
| **Instant Replay** | Completed downloads indexed locally — reopens without P2P |
| **Auto-Seeding** | Continues uploading silently after source switch or restart |
| **Dark / Light Theme** | One-click toggle, persisted |
| **Subtitles** | Auto-scan, drag-and-drop, style editor |
| **Color Correction** | Real-time saturation / contrast / brightness / gamma / sharpness / white balance |

---

## 📦 Download & Install

**No Python required.** Download the pre-built package from Releases and run directly.

➡️ **[Latest Release](https://github.com/lee-baoshan/Q-Player/releases/latest)**

### Requirements

- Windows 10 / 11 x64
- `libmpv-2.dll` in the same folder as `Qplayer.exe` (see [libs/README.md](libs/README.md))
- Optional: [FFmpeg](https://ffmpeg.org/download.html) for rmvb/flv transcoding
- Optional: [aria2c](https://aria2.github.io) for download acceleration

### Installation

1. Download `Qplayer-vX.X.X-windows-x64.zip` from Releases
2. Unzip to any folder
3. Place `libmpv-2.dll` in the same folder as `Qplayer.exe` (see [libs/README.md](libs/README.md))
4. Run `Qplayer.exe`

---

## 🌐 Global Radar

Both **LAN Radar** and **Global Radar** work **out of the box** — zero configuration needed.

- **LAN Radar**: instantly discovers Qplayer peers on your local network via UDP broadcast
- **Global Radar**: automatically syncs with a shared hot-list from all Qplayer users worldwide via DHT + cloud aggregation

---

## 🔌 Engine HTTP API

The embedded engine exposes a local API on `http://127.0.0.1:8800`.  
Third-party integrations (media center plugins, scripts, etc.) can use this interface.

📖 **[Full API Documentation](docs/API.md)**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/add` | POST | Add source `{"source": "magnet:..."}` |
| `/api/status` | GET | Download & seeding status |
| `/api/radar` | GET | LAN + Global radar snapshot |
| `/api/stop` | POST | Stop current download |
| `/stream/<index>` | GET | Media stream (Range supported) |

---

## ❤️ Support

If Qplayer is useful to you, consider sponsoring development:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-ff5e5b?logo=ko-fi&logoColor=white)](https://ko-fi.com/qplayer)
[![GitHub Sponsors](https://img.shields.io/badge/GitHub-Sponsor-ea4aaa?logo=github&logoColor=white)](https://github.com/sponsors/lee-baoshan)

---

## 📄 License

**Source Code**: The core engine and UI source code are proprietary and not distributed with this repository.

**Binaries**: Pre-built releases are provided for personal, non-commercial use. See [LICENSE](LICENSE) for full terms.

**Cloudflare Worker** (`cloudflare/`): MIT — deploy freely.

**Third-party components** used in the binary distribution:

| Component | License |
|-----------|---------|
| libmpv | LGPL-2.1+ |
| libtorrent | BSD-3-Clause |
| PySide6 | LGPL-3.0 |
| FFmpeg (optional) | LGPL-2.1+ |

**Content disclaimer**: This software does not host, index, or distribute copyrighted content. Users are solely responsible for their use.
