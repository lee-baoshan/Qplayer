# Qplayer

> P2P 边下边播播放器 — 局域网+全球雷达，支持磁力链接、BitTorrent

[![License: Proprietary](https://img.shields.io/badge/License-专有-red.svg)](#license)
[![Platform](https://img.shields.io/badge/Platform-Windows-lightgrey)](https://github.com/lee-baoshan/Qplayer/releases)
[![Releases](https://img.shields.io/github/v/release/lee-baoshan/Qplayer)](https://github.com/lee-baoshan/Qplayer/releases)
[![Stars](https://img.shields.io/github/stars/lee-baoshan/Qplayer?style=social)](https://github.com/lee-baoshan/Qplayer/stargazers)

**[English](README.md)** · [下载](https://github.com/lee-baoshan/Qplayer/releases) · [反馈问题](https://github.com/lee-baoshan/Qplayer/issues) · [功能建议](https://github.com/lee-baoshan/Qplayer/issues)

---

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| **P2P 边下边播** | libtorrent 引擎，顺序下载 + 头尾优先，打开即播 |
| **磁力链接** | 粘贴 `magnet:?xt=...` 直接播放 |
| **局域网雷达** | UDP 广播即时发现同网段的 Qplayer 节点，零 DHT 延迟 |
| **全球雷达** | DHT 全球 peer 发现 + 实时同步所有用户的热门资源列表 |
| **全格式播放** | mpv 解码 mkv/mp4/webm/avi/rmvb；非原生格式 FFmpeg 转码 |
| **本地秒开** | 已下载资源自动索引，重复打开无需重新 P2P |
| **自动做种** | 换源/重启后继续上传，后台无感 |
| **暗/亮主题** | 一键切换，持久化 |
| **字幕** | 自动扫描、拖放加载、样式编辑器 |
| **色彩校正** | 饱和度/对比度/亮度/gamma/锐化/色温实时调节 |

---

## 📦 下载安装

**无需 Python。** 从 Releases 下载预构建包，解压即用。

➡️ **[最新版本下载](https://github.com/lee-baoshan/Qplayer/releases/latest)**

### 系统要求

- Windows 10 / 11 x64
- `libmpv-2.dll`（与 `Qplayer.exe` 放在同一目录，见 [libs/README.md](libs/README.md)）
- 可选：[FFmpeg](https://ffmpeg.org/download.html)（rmvb/flv 等格式转码）
- 可选：[aria2c](https://aria2.github.io)（下载加速）

### 安装步骤

1. 从 Releases 下载 `Qplayer-vX.X.X-windows-x64.zip`
2. 解压到任意目录
3. 将 `libmpv-2.dll` 放入 `Qplayer.exe` 所在目录（见 [libs/README.md](libs/README.md)）
4. 运行 `Qplayer.exe`

---

## 🌐 全球雷达

**局域网雷达**和**全球雷达**均**开箱即用**，无需任何配置。

- **局域网雷达**：通过 UDP 广播即时发现同网段的 Qplayer 节点
- **全球雷达**：自动与全球所有 Qplayer 用户同步实时热门资源列表

---

## ❤️ 支持项目

如果 Qplayer 对你有帮助，欢迎赞助：

[![Ko-fi](https://img.shields.io/badge/Ko--fi-支持一下-ff5e5b?logo=ko-fi&logoColor=white)](https://ko-fi.com/qplayer)
[![GitHub Sponsors](https://img.shields.io/badge/GitHub-赞助-ea4aaa?logo=github&logoColor=white)](https://github.com/sponsors/lee-baoshan)
[![爱发电](https://img.shields.io/badge/爱发电-支持-946ce6)](https://afdian.com)

---

## 📄 许可证

**二进制程序**：预构建版本供个人非商业使用，详见 [LICENSE](LICENSE)。

**第三方组件**：

| 组件 | 许可证 |
|------|--------|
| libmpv | LGPL-2.1+ |
| libtorrent | BSD-3-Clause |
| PySide6 | LGPL-3.0 |
| FFmpeg（可选）| LGPL-2.1+ |

**内容免责声明**：本软件不提供、不存储、不索引任何受版权保护的内容，用户自行承担使用责任。
