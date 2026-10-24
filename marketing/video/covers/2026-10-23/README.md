# TickList 视频封面 · 4:3 / 9:16

制作与同步日期：2026-10-23。**新增封面素材只同步进仓库。**

沿用视频的正式 Logo、蓝紫渐变、“把今天，一件件做好。”和 Developed by Soren。横版标语单行居中，竖版标语分为两行，分别排版。

| 比例 | 尺寸 | JPG | PNG |
| --- | --- | --- | --- |
| 4:3 横屏 | 1600×1200 | [查看 JPG](public/TickList-Promo-Cover-4x3-1600x1200.jpg) | [查看 PNG](public/TickList-Promo-Cover-4x3-1600x1200.png) |
| 9:16 竖屏 | 1080×1920 | [查看 JPG](public/TickList-Promo-Cover-9x16-1080x1920.jpg) | [查看 PNG](public/TickList-Promo-Cover-9x16-1080x1920.png) |

public/ 的四张图片已纳入 Git，可在仓库直接浏览和下载。[图片摘要](SHA256SUMS.txt) · [同步核验](github-publication.json) · [制作记录](制作记录.md)。

[4:3 SVG](source/TickList-Promo-Cover-4x3-1600x1200.svg) · [9:16 SVG](source/TickList-Promo-Cover-9x16-1080x1920.svg)。

SVG、制作及导出脚本和说明也在仓库中。文字已转路径，没有附带字体文件。脚本使用 Pillow、fontTools 和 Sharp；重新排版请另存目录，脚本拒绝覆盖已有输出。qa/、backup/ 和 ZIP 压缩备份继续保留本地，不进入 Git。

此前新增至 Release 的封面、封面包及配套校验附件均已按用户要求撤下。v0.1.0 Release 保持原有五份附件及原发布正文；原视频和 16:9 封面不变。历史分发记录与撤下文件保存在本地备份，当前以仓库 public/ 图片为准。

## 重新导出与重建

[完整重建说明](../重建说明.md)区分两种操作：导出现有 SVG 不需要字体或原视频；从文字重建需要 Windows 字体、Python / Sharp 环境，以及从正式 Release 恢复的原 MP4 和 16:9 JPG。3:4 重建还需保留仓库已有的 4:3 / 9:16 图片。所有结果另存到空的本地目录，具体命令与摘要核对见说明。

当前图片只使用本目录的 [SHA256SUMS.txt](SHA256SUMS.txt) 校验。此前引用撤下 ZIP 的旧分发校验文件已归档至本地备份；历史附件名称仍保留在同步记录中用于追溯。
