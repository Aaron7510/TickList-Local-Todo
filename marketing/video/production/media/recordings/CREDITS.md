# 实录音效素材与许可

本轮只使用下列三份真实录音，没有使用音效生成模型或旧振荡器 Click。三份来源页面均明确标注 Creative Commons 0；原始网页及下载音频的摘要记录在 source-manifest.json 和 page-observations.json；网页快照保存在本地档案，不随当前 Git 源码分发。

| 素材 | 作者与原始页面 | 许可 | 本轮用途 |
| --- | --- | --- | --- |
| typing on a laptop keyboard | [supersnd / Freesound 215744](https://freesound.org/people/supersnd/sounds/215744/) | CC0 1.0 | 从不同位置提取七次真实按键接触，其中六次用于开头，另一次用于截止时间输入 |
| finger tap table counter wood various.wav | [kyles / Freesound 452621](https://freesound.org/people/kyles/sounds/452621/) | CC0 1.0 | 不同指尖轻触作为按钮、勾选、筛选、设置与备份的主体 |
| Finger Tap | [pikachu09 / Freesound 204605](https://freesound.org/people/pikachu09/sounds/204605/) | CC0 1.0 | 选取不同接触片段，少量混入部分按钮，补足轻微触感 |

许可原文入口：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。作者页面给出的许可允许复制、修改和用于商业作品；此处保留署名与链接，方便追溯。没有使用需要付费或仅限非商业用途的素材。

本轮下载的是网站公开的 HQ MP3 预览，不是需登录下载的原始 WAV。实际编码由工具读取：键盘为 44.1kHz / 双声道，约 187kbps VBR；Finger Tap 为 44.1kHz / 双声道，约 181kbps VBR；kyles 的轻敲为 48kHz / 单声道，约 132kbps VBR。处理后输出 48kHz / 24-bit WAV，用于编辑与混音；转换格式不会恢复原预览已丢失的信息。

处理包括独立片段裁取、低切、克制的高频与刺耳频段削减、短边界淡入淡出、轻微力度差异和针对动作的音量编排。未通过变调制造假多采样，未添加回声、电子提示音或机械开关声。原录音、处理脚本、每个片段的源时间位置和文件摘要均保留。
