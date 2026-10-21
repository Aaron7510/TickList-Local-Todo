# GitHub 上传与发布记录

更新日期：2026-10-21。仓库：Aaron7510/TickList-Local-Todo，默认分支 main。当前保留私有仓库与草稿 Release；整理源码已推送，媒体已由用户手动补入草稿并通过服务器摘要审核；本轮同步实际状态与链接，不公开仓库、不发布 Release、不启用 Pages。

## 已建立的产品发布基准

- v0.1.0 标签已经建立，指向 `98960449fff1aed015aa0ad1963470c5e8fb4e10`。该标签保持不变。文档及视频工程整理提交为 9d6cef1，已进入私有 main。
- [main CI](https://github.com/Aaron7510/TickList-Local-Todo/actions/runs/37800397416)与[标签 CI](https://github.com/Aaron7510/TickList-Local-Todo/actions/runs/37800932681)已通过；这些结果对应产品基准；整理提交 9d6cef1 的[新 CI](https://github.com/Aaron7510/TickList-Local-Todo/actions/runs/39557948638)及干净检出检查、打包也已通过。
- 产品基准 9896044 的干净检出检查和打包已通过，正式文件名的离线包 `TickList-v0.1.0.zip` 已生成并附 `.sha256`，保存在本地 `release-artifacts/`；38 个解压文件齐全，35 项清单摘要一致。
- ZIP SHA-256：`894df9843d897c4e6c475bb70d350f63dd47b17f02ec72abec045dfd53350738`。
- 应用 ZIP、校验文件和中文说明已保存于[现有私有草稿](https://github.com/Aaron7510/TickList-Local-Todo/releases/tag/untagged-120f1e02c48e498c9327)。2026-10-21 再次核对现有五份附件的名称、大小及 SHA-256，均与本地一致，无多余附件。
- Chrome/Edge 的 HTTP 操作、JSON/Markdown 实际下载、恢复、两页冲突与减少动态效果已有通过记录。本地 file 界面由用户人工操作，下载文件逐字段核对。证据日期与范围见[审查记录](../maintenance/代码审查.md)。

产品运行代码没有变化时，保留现有 v0.1.0 标签及应用 ZIP；本轮整理以新提交进入 main，不移动既有标签，不把宣传媒体塞入应用离线包。若运行代码变化，再另行确认版本及验收范围。

## 宣传视频交付

用户已确认画面、配乐和自然交互音效。以下两份媒体已于 2026-10-21 上传至私有草稿，并附媒体校验文件：

| 用途 | 文件名 | 本地位置 |
| --- | --- | --- |
| 宣传正片 | TickList-Promo-35s-1080p60.mp4 | `marketing/video/release/2026-10-19/public/TickList-Promo-35s-1080p60.mp4` |
| 横版封面 | TickList-Promo-Cover-1920x1080.jpg | `marketing/video/release/2026-10-19/public/TickList-Promo-Cover-1920x1080.jpg` |

规格、批准及摘要见[定版登记](../../marketing/video/定版登记.md)。独立 WAV、试听、模型与制作备份不作为宣传附件。实际草稿附件：[宣传片 MP4](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/untagged-120f1e02c48e498c9327/TickList-Promo-35s-1080p60.mp4)、[封面](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/untagged-120f1e02c48e498c9327/TickList-Promo-Cover-1920x1080.jpg)和[媒体校验文件](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/untagged-120f1e02c48e498c9327/TickList-Promo-SHA256SUMS.txt)。链接需要仓库权限，正式发布后需复核并更新为正式地址。

## 已完成与后续步骤

1. 整理源码已提交并推送私有 main（9d6cef1），远端 SHA 一致，该提交 CI 与干净检出检查、打包通过。既有 v0.1.0 标签不移动。
2. 用户已手动上传 MP4、封面及媒体校验文件；API 核对五份草稿附件大小与 SHA-256，均与本地一致。正式公开后的实际下载与播放尚未复验。
3. 本次同步 README、发布说明和视频现行文档中的实际附件入口与状态；文档提交仍需按实际提交确认 CI，不把旧 CI 结果当作新提交结果。
4. 当前草稿地址为[此处](https://github.com/Aaron7510/TickList-Local-Todo/releases/tag/untagged-120f1e02c48e498c9327)。草稿保存或正式发布可能改变附件地址，届时应重新查询并更新链接；原机器验收及历史记录不改写。
5. 公开仓库与发布 Release 继续等待用户执行时确认。正式发布后实际下载应用 ZIP 与校验文件，核对 SHA-256 和解压清单，并复验宣传片和封面访问。当前不执行公开操作。

## 上传范围与许可

已有产品源码保持既定范围；新增视频工程按[上传范围说明](上传范围说明.md)逐文件选择，不整目录提交 marketing。必要离线音频按摘要单独保存与传递；源码单独检出不带完整制作素材，恢复素材后才能使用完整视频时间轴。

archive、dist、release-artifacts、清理明细、内部验收截图、环境配置、真实任务备份和历史媒体不提交。公开恢复样例为 tests/fixtures/valid-backup.json。

网页运行无需安装依赖。产品 Node 工具只用于检查、预览与打包；视频工程依赖另行安装。CI 权限为 contents: read，只检查和打包，不部署。

保持 todo.list.v3、aaron-todo-backup 和备份版本 1。代码采用 MIT；品牌及素材按[独立说明](../../BRAND-LICENSE.md)处理，不分发字体文件。上传源码不会迁移浏览器清单；无云同步、多页自动合并或手机端适配承诺。

版本文案见[发布说明草稿](v0.1.0说明.md)，视频现行入口见[视频总入口](../../marketing/video/README.md)。
