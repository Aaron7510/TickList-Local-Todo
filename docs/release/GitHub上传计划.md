# GitHub 上传与发布记录

更新日期：2026-10-23。仓库：[Aaron7510/TickList-Local-Todo](https://github.com/Aaron7510/TickList-Local-Todo)，默认分支 main。仓库已公开（API 确认 visibility: public），v0.1.0 仍为草稿，Pages 未启用。

## 应用发布基准

- v0.1.0 保持指向 98960449fff1aed015aa0ad1963470c5e8fb4e10，不随文档整理移动。
- 应用基准的 [main CI](https://github.com/Aaron7510/TickList-Local-Todo/actions/runs/37800397416) 和[标签 CI](https://github.com/Aaron7510/TickList-Local-Todo/actions/runs/37800932681)通过。
- 本次公开前 main 为 d0d04b8460c17031443f76a591e44fbf899ff32e，[该提交 CI](https://github.com/Aaron7510/TickList-Local-Todo/actions/runs/39805332066)通过；本次状态同步提交仍应核对自身 CI。
- 离线 ZIP 为 157487 字节，SHA-256 为 894df9843d897c4e6c475bb70d350f63dd47b17f02ec72abec045dfd53350738；解压 38 个文件、35 项摘要已在原发布验收中核对。
- Chrome/Edge 的 HTTP 与 file 下载恢复验收见[审查摘要](../maintenance/代码审查.md)。

## 当前发布状态

[维护者 v0.1.0 草稿（需管理权限）](https://github.com/Aaron7510/TickList-Local-Todo/releases/tag/untagged-120f1e02c48e498c9327)，Release ID 为 406984592。2026-10-23 API 确认 draft: true、published_at: null；普通访客尚不可访问该草稿或附件。公开入口为[版本页面](https://github.com/Aaron7510/TickList-Local-Todo/releases)。

| 附件 | 字节数 |
| --- | ---: |
| TickList-v0.1.0.zip | 157487 |
| TickList-v0.1.0.zip.sha256 | 86 |
| TickList-Promo-35s-1080p60.mp4 | 5952035 |
| TickList-Promo-Cover-1920x1080.jpg | 138123 |
| TickList-Promo-SHA256SUMS.txt | 198 |

2026-10-22 发布前核对：五份附件的名称、大小和服务器摘要与本地一致。该结论不是正式附件实际下载或播放验收。

## 本次资料整理

用户选择执行文档收束与可追溯归档，并公开视频制作过程。公开内容包括最终画面源码、当前制作脚本、配乐选择、音效来源与处理、必要参数及最终验收摘要；模型下载、重复备份、旧播放器说明和未选字体候选移至本地档案。详见[执行记录](仓库整理记录-2026-10-22.md)和[上传范围](上传范围说明.md)。

原定公开时间为 2026-10-22 北京时间 22:50，当时因 Windows 网页工具无法可靠识别目标 URL 未执行。2026-10-23 用户手动将仓库设为 Public，本轮经 GitHub API 确认。源码和视频制作资料现已公开，Release 尚未发布。

## 后续发布

1. 完成本次状态同步提交并确认对应 CI。
2. 发布现有 v0.1.0 草稿；保留现有标签、应用 ZIP 和五份附件，不启用 Pages。
3. 重新读取正式 Release 和附件 URL，更新 README 与当前文档。
4. 实际下载应用 ZIP、校验文件和媒体附件，核对摘要、解压内容及两页面入口，并复验视频和封面访问。
5. 将实际验收结果记录、推送，并确认新提交 CI。

网页工具要求执行时确认时，应当场取得确认；无法可靠识别目标 URL 时由用户手动完成公开与发布，不绕过限制。
