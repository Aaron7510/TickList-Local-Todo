# TickList 视频封面 · 3:4

制作与同步日期：2026-10-23。**新增封面素材只同步进仓库。**

1200×1600，沿用正式 Logo、蓝紫渐变、双行“把今天，一件件做好。”与 Developed by Soren，按 3:4 单独调整位置与留白。

- [JPG · 1200×1600](public/TickList-Promo-Cover-3x4-1200x1600.jpg)
- [PNG · 1200×1600](public/TickList-Promo-Cover-3x4-1200x1600.png)
- [SVG 源设计](source/TickList-Promo-Cover-3x4-1200x1600.svg) · [图片摘要](SHA256SUMS.txt)
- [设计与检查记录](cover-manifest.json) · [仓库同步核验](github-publication.json)

public/ 图片已纳入 Git，远端文件字节和本地摘要一致。source/ 保留 SVG、生成与导出脚本，文字已转路径，没有附带字体文件。重新设计请另存目录，脚本拒绝覆盖已有输出。

此前新增至 Release 的 3:4 JPG、PNG、封面包及校验附件已按用户要求撤下。图片与源文件只在仓库分发；压缩备份、qa/ 和 backup/ 保留本地。v0.1.0 Release 的原有五份附件及正文保持原内容。

## 重新导出与重建

[完整重建说明](../重建说明.md)区分两种操作：导出现有 SVG 不需要字体或原视频；从文字重建需要 Windows 字体、Python / Sharp 环境，以及从正式 Release 恢复的原 MP4 和 16:9 JPG。3:4 重建还需保留仓库已有的 4:3 / 9:16 图片。所有结果另存到空的本地目录，具体命令与摘要核对见说明。

当前图片只使用本目录的 [SHA256SUMS.txt](SHA256SUMS.txt) 校验。此前引用撤下 ZIP 的旧分发校验文件已归档至本地备份；历史附件名称仍保留在同步记录中用于追溯。
