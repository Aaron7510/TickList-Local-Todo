# TickList 最终视频最小工程

2026-10-19 批准的 MP4、封面、规格、摘要及原验收记录保存在 [定版交付](../release/2026-10-19/README.md)。此次清理只调整工程入口与路径，没有重制、覆盖或重新批准媒体。

## 保留结构

- `src/`：最终画面及编辑场景。StageOne → StageTwo → StageThree → StageFour 是当前完整画面的依赖链，保留原文件内容；不属于可删除的阶段废案。
- `public/audio/final-mix.wav`：批准正片的原始混音，逐字节迁移；完整预览现在使用它。
- `public/brand/`：正式品牌素材；场景中的内嵌 Logo 与主产品 SVG 摘要一致。
- `media/music/`：选定 A 版浮点原始演奏与批准 BGM，不依赖已清除的音乐模型。
- `media/stems/`、`media/takes/`：最终音效、打字、操作分轨及 16 个片段。
- `media/recordings/`：实际使用的三份录音 MP3、原来源页面及来源/许可记录。
- `media/comparison/`：配乐混音所需 UI 输入、自然音效脚本所需旧 UI 对照。保留是因为当前脚本仍读取它们。
- `evidence/2026-10-19/`：原制作、验收、生成参数及原脚本证据。其内部旧路径是历史记录，不作为当前运行入口；请使用[现行证据索引](evidence/2026-10-19/README.md)。
- `scripts/`：迁移后的制作、混音和只读校验入口。
- `out/`：以后修改的临时输出目录，不存放定版文件。

完整素材摘要见 [asset-manifest.json](media/asset-manifest.json)。逐项迁移和删除清单只保存在本地 `../cleanup/2026-10-19/`。另留一份经过 CRC 和每项 SHA-256 验证的必要工程恢复 ZIP，位于项目根 `archive/video-cleanup-2026-10-19/`。

## 安装与检查

从 Git 单独检出不包含 WAV/MP3、定版 MP4 或封面。先按 [上传范围](../../../docs/release/上传范围说明.md) 的必要离线素材清单恢复 `media/` 和 `public/audio/final-mix.wav`，并按定版登记提供两份媒体；再运行以下命令。素材尚未提供公共下载地址，应向工程持有人取得，不能仅运行 npm ci 就宣称制作工程完整可复现。普通 TickList 网页不依赖这些视频素材。

node_modules 已在工程检查之后删除。保持既有 package-lock.json 和依赖范围，重新编辑前在此目录执行：

```powershell
npm.cmd ci
python -m pip install -r requirements.txt
npm.cmd run check
npm.cmd run verify:final
npm.cmd run dev
```

需要 Python 3.12 及 NumPy；当前实测版本写在 requirements.txt。Node 与 Remotion 使用原锁定依赖。`verify:final` 无需 node_modules 即可检查媒体摘要、素材、分轨相加与音效事件。`verify:media` 还需要 ffmpeg/ffprobe（重新安装依赖或设置 FFMPEG/FFPROBE），会完整解码已有媒体，不重建视频。

完整时间轴为 TickListFinalFilm（35秒、1080p60，使用批准混音）；TickListStageFour 为相同画面的无声时间轴。保留开头、截止时间、完成、备份和片尾的独立编辑入口；废弃试听与旧样片入口已移除。

## 以后修改

- `npm.cmd run render:silent` 或 `render:edit` 只输出到 `out/edit/`，Remotion 禁止覆盖已有输出。此次没有运行渲染命令。
- `npm.cmd run mix:sfx -- out/my-sfx`：从保留的真实录音与 BGM 重建新音效/混音，只允许新的 out 子目录。
- `npm.cmd run mix:score -- out/my-score`：对保留的 A 版演奏执行原有音乐整形与混音，使用必要的 UI 输入；不是重新调用音乐模型。
- `python scripts/verify-score.py out/my-score`：检查新配乐分轨。
- `npm.cmd run finish:edit -- --silent out/edit/silent.mp4 --output out/my-film`：封装新视频与指定混音，保留原片；可用 `--mix` 选择新混音。
- `sync:logo` 仅在有意更新正式品牌后使用，会改变内嵌字形源；本次未执行。

已选音乐原件、分轨和录音都属于必要离线素材，不能靠 seed、提示词或源码替代。上传工具会把它们与 Git 源码分开列清单。清理验证与原用户验收分别记录；此次未重新制作全片，不能据此宣称全部制作流程已完整复现。
