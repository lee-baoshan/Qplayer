# libs/ — 运行时二进制依赖

此目录存放 **不随源码分发** 的运行时动态库。  
`.gitignore` 已将这些文件排除在版本控制之外。

---

## libmpv-2.dll（Windows 必须）

`libmpv-2.dll` 是 Qplayer 播放视频所必需的 mpv 媒体播放器动态库。

### 获取方式

**方式一（推荐）：从 mpv 官方 Windows 构建下载**

1. 前往 <https://sourceforge.net/projects/mpv-player-windows/files/libmpv/>
2. 下载最新的 `mpv-dev-x86_64-*.7z`（64 位）
3. 解压，将 `libmpv-2.dll` 复制到本目录

**方式二：使用 winget**

```powershell
winget install mpv
# 安装后在 mpv 安装目录找到 libmpv-2.dll 并复制到此处
```

**方式三：scoop**

```powershell
scoop install mpv
# 安装后在 ~/.scoop/apps/mpv/current/ 找到 libmpv-2.dll
```

### 版本要求

- 最低版本：mpv 0.35（`libmpv-2.dll`，API 版本 ≥ 2.0）
- 推荐版本：mpv 最新稳定版

### 放置位置

```
Qplayer/
├── libs/
│   └── libmpv-2.dll   ← 放在这里
├── engine/
├── desktop/
...
```

---

## FFmpeg（可选，全格式转码用）

`ffmpeg.exe` 和 `ffprobe.exe` 用于非 mp4/webm 格式的实时转码（rmvb、flv、avi 等）。  
若不安装，mp4/mkv/webm 格式仍可正常播放；其他格式将无法使用转码路径。

### 获取方式

```powershell
winget install ffmpeg
# 或
scoop install ffmpeg
```

安装后确保 `ffmpeg` 和 `ffprobe` 在 PATH 中可调用。

---

## aria2c（可选，P2P 补速用）

`aria2c.exe` 用于在 P2P 节点不足时自动补速下载。  
若不安装，P2P 功能仍可用，只是冷启动可能较慢。

```powershell
winget install aria2
```
