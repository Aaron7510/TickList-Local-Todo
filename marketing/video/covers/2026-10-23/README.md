# TickList 视频封面 · 4:3 / 9:16

制作日期：2026-10-23。用户已授权更新至 GitHub。

沿用视频中的正式勾号与 TickList 字标、“把今天，一件件做好。”、Developed by Soren，以及浅灰白／蓝紫渐变和留白。两种比例分别排版，没有拉伸或直接裁切原 16:9 封面。

| 比例 | 尺寸 | 常用 JPG | 无损 PNG |
| --- | --- | --- | --- |
| 4:3 横屏 | 1600×1200 | [下载 JPG](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-Promo-Cover-4x3-1600x1200.jpg) | [下载 PNG](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-Promo-Cover-4x3-1600x1200.png) |
| 9:16 竖屏 | 1080×1920 | [下载 JPG](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-Promo-Cover-9x16-1080x1920.jpg) | [下载 PNG](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-Promo-Cover-9x16-1080x1920.png) |

横屏：品牌、单行标语、署名依次居中。竖屏：标语分为“把今天，／一件件做好。”两行，整体视觉中心稍上移，上下保留留白。

[完整封面包](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-Covers-4x3-9x16-2026-10-23.zip) · [下载校验文件](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-Covers-4x3-9x16-SHA256SUMS.txt) · [设计与输出摘要](cover-manifest.json) · [制作记录](制作记录.md)。

## 源文件与保存

[4:3 SVG](source/TickList-Promo-Cover-4x3-1600x1200.svg) · [9:16 SVG](source/TickList-Promo-Cover-9x16-1080x1920.svg)。

源码仓库保留两份路径化 SVG、构图生成和导出脚本、说明与摘要。JPG / PNG 及 ZIP 通过 Release 单独提供；本地 public/、qa/、backup/ 与打包 ZIP 不提交 Git。封面包内保留四张图片、SVG、脚本和说明。

脚本使用 Pillow、fontTools、Sharp，中文排版使用本机 Microsoft YaHei Bold，署名使用 Segoe UI，正式 Logo 从 assets/brand/logo-light.svg 读取。文字已转为路径，查看 SVG 和导出图无需另行安装字体；没有附带字体文件。重新排版请在新日期目录中制作，原脚本拒绝覆盖已有输出。

原定版 MP4 与 16:9 封面内容和摘要保持不变。制作阶段的本地检查与用户发布授权分别记录。上传核验结果见 [GitHub 同步记录](https://github.com/Aaron7510/TickList-Local-Todo/blob/main/marketing/video/covers/2026-10-23/github-publication.json)，后续修改另存新版本。
