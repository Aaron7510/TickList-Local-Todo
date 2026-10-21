# GitHub 上传与发布记录

更新日期：2026-10-19。仓库：Aaron7510/TickList-Local-Todo，默认分支 main。当前保留私有仓库与草稿 Release；本轮修正文档及上传检查，不公开仓库、不发布 Release、不启用 Pages。

## 已建立的产品发布基准

- v0.1.0 标签已经建立，指向 `98960449fff1aed015aa0ad1963470c5e8fb4e10`。2026-10-19 上轮核对的远端 main 也指向该提交。
- [main CI](https://github.com/Aaron7510/TickList-Local-Todo/actions/runs/37800397416)与[标签 CI](https://github.com/Aaron7510/TickList-Local-Todo/actions/runs/37800932681)已通过；这些结果对应产品基准，不代表尚未推送的整理变更已通过远端检查。
- 该提交的干净检出检查和打包已通过，正式文件名的离线包 `TickList-v0.1.0.zip` 已生成并附 `.sha256`，保存在本地 `release-artifacts/`；38 个解压文件齐全，35 项清单摘要一致。
- ZIP SHA-256：`894df9843d897c4e6c475bb70d350f63dd47b17f02ec72abec045dfd53350738`。
- 应用 ZIP、校验文件和中文说明已保存于[现有私有草稿](https://github.com/Aaron7510/TickList-Local-Todo/releases/tag/untagged-720894771b50de9aa52c)。附件上传摘要已在 2026-10-08 核对；下次更新草稿时再次核对实际附件。
- Chrome/Edge 的 HTTP 操作、JSON/Markdown 实际下载、恢复、两页冲突与减少动态效果已有通过记录。本地 file 界面由用户人工操作，下载文件逐字段核对。证据日期与范围见[审查记录](../maintenance/代码审查.md)。

产品运行代码没有变化时，保留现有 v0.1.0 标签及应用 ZIP；本轮整理以新提交进入 main，不移动既有标签，不把宣传媒体塞入应用离线包。若运行代码变化，再另行确认版本及验收范围。

## 宣传视频交付

用户已确认画面、配乐和自然交互音效。仅以下两份文件作为公开宣传附件，当前本地已定版、尚未上传：

| 用途 | 文件名 | 本地位置 |
| --- | --- | --- |
| 宣传正片 | TickList-Promo-35s-1080p60.mp4 | `marketing/video/release/2026-10-19/public/TickList-Promo-35s-1080p60.mp4` |
| 横版封面 | TickList-Promo-Cover-1920x1080.jpg | `marketing/video/release/2026-10-19/public/TickList-Promo-Cover-1920x1080.jpg` |

规格、批准及摘要见[定版登记](../../marketing/video/定版登记.md)。独立 WAV、试听、模型与制作备份不作为宣传附件。当前没有媒体在线地址，不把本地路径写成 GitHub 可点击下载链接。

## 下一次私有上传的顺序

1. 运行 `npm run check` 和 `node tools/prepare-upload.js --write`。检查必须通过；报告分别列出当前 Markdown 引用和保留原字节的历史交付记录。修复后再生成白名单，文件改变后不得沿用旧摘要。
2. 按本地 `docs/release/upload-allowlist.txt` 显式暂存源码与文档，审阅完整差异和 `git diff --cached --check`，提交后推送私有 main，核对远端 SHA 和该新提交的 Actions 结果。
3. 核对现有草稿中的应用 ZIP 与校验文件；再添加上述定版 MP4、封面及其媒体摘要文件，核对上传后的名称和摘要。
4. 以实际附件地址补充 README 的观看入口与封面，保留两张原生 SVG。正式发布后使用正式版本地址，不能继续使用失效的草稿附件地址。
5. 公开仓库与发布 Release 需要用户执行时确认。正式发布后实际下载应用附件，核对 ZIP SHA-256 与解压清单，并检查视频和封面访问。当前不执行这些公开操作。

## 上传范围与许可

已有产品源码保持既定范围；新增视频工程按[上传范围说明](上传范围说明.md)逐文件选择，不整目录提交 marketing。必要离线音频按摘要单独保存与传递；源码单独检出不带完整制作素材，恢复素材后才能使用完整视频时间轴。

archive、dist、release-artifacts、清理明细、内部验收截图、环境配置、真实任务备份和历史媒体不提交。公开恢复样例为 tests/fixtures/valid-backup.json。

网页运行无需安装依赖。产品 Node 工具只用于检查、预览与打包；视频工程依赖另行安装。CI 权限为 contents: read，只检查和打包，不部署。

保持 todo.list.v3、aaron-todo-backup 和备份版本 1。代码采用 MIT；品牌及素材按[独立说明](../../BRAND-LICENSE.md)处理，不分发字体文件。上传源码不会迁移浏览器清单；无云同步、多页自动合并或手机端适配承诺。

版本文案见[发布说明草稿](v0.1.0说明.md)，视频现行入口见[视频总入口](../../marketing/video/README.md)。
