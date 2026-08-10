# Qplayer

> P2P streaming media player — Radar peer discovery, magnet links, BitTorrent, play while downloading

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](#license)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%2F11-lightgrey)](https://github.com/lee-baoshan/Qplayer/releases)
[![Releases](https://img.shields.io/github/v/release/lee-baoshan/Qplayer)](https://github.com/lee-baoshan/Qplayer/releases)
[![Stars](https://img.shields.io/github/stars/lee-baoshan/Qplayer?style=social)](https://github.com/lee-baoshan/Qplayer/stargazers)

**[中文文档](README_zh.md)** · [Download](https://github.com/lee-baoshan/Qplayer/releases) · [Report Bug](https://github.com/lee-baoshan/Qplayer/issues) · [Request Feature](https://github.com/lee-baoshan/Qplayer/issues)

---

![Qplayer Screenshot](assets/screenshot.png)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **P2P Streaming** | Play while downloading — no need to wait for the full file |
| **Magnet Links** | Paste `magnet:?xt=...` and hit Enter, playback starts immediately |
| **Radar** | Automatically discovers nearby and global peers sharing the same content |
| **All Formats** | mkv / mp4 / avi / rmvb and more via mpv + FFmpeg transcoding |
| **Playlist** | Manage multiple torrents, switch between them seamlessly |
| **Instant Replay** | Already downloaded files open instantly without P2P |
| **Auto-Seeding** | Continues uploading after playback, giving back to the network |
| **Subtitles** | Auto-scan, drag-and-drop `.srt` / `.ass`, style editor |
| **Color Correction** | Saturation / contrast / brightness / gamma / sharpness in real time |
| **Dark / Light Theme** | One-click toggle, remembered across sessions |
| **Auto-Update** | Notifies you when a new version is available |
| **Language** | English & Chinese |

---

## 📦 Download & Install

**No Python required.** Download and run directly.

➡️ **[Latest Release](https://github.com/lee-baoshan/Qplayer/releases/latest)**

### Requirements

- Windows 10 / 11 x64
- `libmpv-2.dll` placed in the same folder as `Qplayer.exe` — see [How to get libmpv-2.dll](libs/README.md)
- Optional: [FFmpeg](https://ffmpeg.org/download.html) — for rmvb / flv transcoding (auto-downloaded on first run if missing)
- Optional: [aria2c](https://aria2.github.io) — for download acceleration

### Steps

1. Download `Qplayer-vX.X.X-windows-x64.zip` from Releases
2. Unzip to any folder
3. Place `libmpv-2.dll` in the same folder as `Qplayer.exe`
4. Run `Qplayer.exe`

> **FFmpeg** is optional. If missing, Qplayer will offer to download it automatically on first launch.

---

## 📡 Radar

Radar discovers peers who are sharing the same content — nearby (LAN) and worldwide — and lets you connect directly for faster playback.

- Nearby peers connect instantly via LAN with no DHT delay
- Global peers are discovered automatically via DHT and synced in real time
- No IP addresses or personal information are ever displayed

---

## ❤️ Support

If Qplayer is useful to you, consider sponsoring development:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-ff5e5b?logo=ko-fi&logoColor=white)](https://ko-fi.com/qplayer)
[![GitHub Sponsors](https://img.shields.io/badge/GitHub-Sponsor-ea4aaa?logo=github&logoColor=white)](https://github.com/sponsors/lee-baoshan)

---

## 📄 License

Pre-built releases are for personal, non-commercial use. See [LICENSE](LICENSE) for full terms.

Third-party components in the binary:

| Component | License |
|-----------|---------|
| libmpv | LGPL-2.1+ |
| libtorrent | BSD-3-Clause |
| PySide6 | LGPL-3.0 |
| FFmpeg (optional) | LGPL-2.1+ |

**Content disclaimer**: This software does not host, index, or distribute copyrighted content. Users are solely responsible for their use.
