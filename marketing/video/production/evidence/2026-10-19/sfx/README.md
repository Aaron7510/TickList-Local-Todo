# TickList · 自然交互音效版（2026-10-18）

**已通过用户验收。** 用户于 2026-10-18 确认：“视频已通过”。[验收记录](acceptance.json)固定本版成片的文件名与摘要。

**2026-10-19 已完成最终定版。** 公开上传请使用 [TickList-Promo-35s-1080p60.mp4](../../../release/2026-10-19/public/TickList-Promo-35s-1080p60.mp4) 和 [TickList-Promo-Cover-1920x1080.jpg](../../../release/2026-10-19/public/TickList-Promo-Cover-1920x1080.jpg)，详见 [定版登记](../../../定版登记.md)。本目录原 MP4 保留为批准来源，与固定名称的公开正片逐字节一致。背景音乐与交互音效均为最终确认。

[打开新旧视频与音效对照](http://localhost:3012/) · [完整优化记录](../../../交互音效优化记录-2026-10-18.md)

| 文件 | 内容 |
| --- | --- |
| [新版完整视频](TickList-natural-ui-1080p60.mp4) | 35 秒 / 1080p60，仅替换交互音效 |
| [独立音效 WAV](TickList-natural-ui-35s.wav) | 35 秒、与成片相同电平，包含打字与操作 |
| [打字音轨](TickList-typing-35s.wav) | 六次开头输入加一次日期变更，使用七段不同实录 |
| [操作音轨](TickList-controls-35s.wav) | 添加、截止时间、完成、筛选、设置与备份 |
| [完整混音 WAV](TickList-natural-ui-mix-35s.wav) | 保持已满意的 BGM，叠加新音效 |
| [未修改的背景音乐](TickList-bgm-unchanged-35s.wav) | 与已满意版本逐字节一致 |
| [原版独立音效](TickList-ui-before-35s.wav) | 保留对照 |
| [原版完整视频](../score-2026-10-18/TickList-original-score-1080p60.mp4) | 原文件保留，未覆盖 |

独立 WAV 均为 48kHz / 双声道 / 24-bit。新版采用真实笔记本和指尖录音剪辑，不再使用旧正弦波 Click。素材为 CC0，实际下载格式、作者、链接和处理见 [来源与许可](sources/CREDITS.md)。每个动作的独立成品片段在 takes/。

原画面视频流、BGM 文件和全部场景源摘要保持。实测 AAC 为 −19.52 LUFS / −2.77dBTP，无削波；音频与 WAV 母版偏移 0 个样本，音效起点距画面动作最多约 7.65ms。完整检查见 [verification.json](verification.json)，处理与事件表见 [sfx-manifest.json](sfx-manifest.json)。用户验收已通过；制作阶段的工具检查与试听能力限制仍在核验文件中保留，未改写为工具完成主观听音。

本目录的 generate_natural_sfx.py 与 verify_natural_sfx.py 记录本轮制作与验证。生成脚本会拒绝覆盖已存在的成品；需要再制时请另存输出目录。preview_server.py 仅监听 127.0.0.1:3012，保留 3011 原版播放器。

[制作备份](TickList-natural-sfx-backup-2026-10-18.zip)包含原版与新版媒体、实录源、片段、脚本、许可与检查记录；[修改前文档](../../../history/2026-10-18-natural-sfx-before/README.md)另存。

[验收补充备份](TickList-video-acceptance-2026-10-18.zip)保存本次批准记录、更新后的说明与验收前文档。原制作备份保持原文件，媒体内容未变。
