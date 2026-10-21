# TickList · 新原创配乐交付（2026-10-18）

**最终状态（2026-10-19）：音乐已确认，本目录为制作中间资产。** 音乐沿用至已批准的自然交互音效版；本目录 MP4 含较早 UI 音效，不作为公开正片。公开文件名与封面见 [定版登记](../../../定版登记.md)。

[打开本地审阅播放器](http://localhost:3011/)

| 文件 | 用途 |
| --- | --- |
| [配乐视频](TickList-original-score-1080p60.mp4) | 35 秒完整视频，1080p60，含音乐与温润 UI 音效 |
| [独立 BGM · WAV](TickList-original-bgm-35s.wav) | 35 秒 / 48kHz / 24-bit，保留最终混音电平 |
| [独立 BGM · MP3](TickList-original-bgm-35s.mp3) | 便于单独播放 |
| [完整混音 · WAV](TickList-soundtrack-35s.wav) | 与视频对应的完整音频母版 |
| [UI 独立音轨](TickList-ui-35s.wav) | 已有温润交互声的本次剪辑 |
| [当前无声底片](TickList-picture-current-1080p60.mp4) | 含此前恢复图标修复，保留既定画面 |

本轮使用本地音乐模型生成完整器乐配乐，实际尝试三种方向后选择温暖键盘与轻律动一版。没有使用 Runway，也没有下载现成背景曲。三版原始生成请求与结果留在 tools/acestep-cpp/requests；B、C 已淘汰，不作为交付配乐。模型辅助内容描述与测量数据只用于辅助取舍，制作时未由代理进行真人耳机审听；后续用户已明确确认完整视频的听感。

[制作说明与取舍](../../../原创配乐制作记录-2026-10-18.md) · [画面复核](qa/scoring-review-board.png) · [技术核验](verification.json) · [混音记录](mix-report.json) · [文件摘要](SHA256SUMS.txt)

实际成片为 35 秒 / 2100 帧 / 1920×1080 / 60fps，AAC 48kHz 双声道。AAC 实测 −19.51 LUFS / −2.82 dBTP，全流解码通过，与 WAV 对齐偏移为 0 个样本。19 个 UI 事件均有对应信号；原始成片与确认的场景源摘要保持。背景音乐已随最终自然交互音效版获得用户确认，不再等待反馈；本段技术数值仍对应本目录中间版本。

finish_score.py 记录本轮音乐剪辑与混音；verify_score.py 核对实际交付。重复制作请先另存输出目录，避免覆盖本轮审阅版。preview_server.py 只监听 127.0.0.1:3011，提供本机审阅。

[本轮制作备份](TickList-score-production-backup-2026-10-18.zip)保留场景源、配乐生成条件与结果、混音/核验资料和最终音轨；不重复打包多 GB 模型。已使用模型的下载地址与 SHA-256 见 verified-models.json，[文档修改前快照](../../../history/2026-10-18-original-score-before/README.md)原位保留。
