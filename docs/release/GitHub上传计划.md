# GitHub 上传与正式发布记录

更新日期：2026-10-23。仓库：[Aaron7510/TickList-Local-Todo](https://github.com/Aaron7510/TickList-Local-Todo)，默认分支 main。仓库已公开，v0.1.0 已正式发布，Pages 未启用。

## 发布结果

- [正式 Release](https://github.com/Aaron7510/TickList-Local-Todo/releases/tag/v0.1.0)：ID 406984592，draft: false，published_at: 2026-10-23T03:32:11Z，即北京时间 2026-10-23 11:32:11。
- v0.1.0 保持指向应用基准 98960449fff1aed015aa0ad1963470c5e8fb4e10。应用 ZIP、视频、封面及两份校验文件未替换。
- 公开前的整理提交 d0d04b8 和状态同步提交 2aab2c0 均通过 CI。本轮正式链接同步提交仍核对自身[检查结果](https://github.com/Aaron7510/TickList-Local-Todo/actions/workflows/check.yml)。
- 用户手动完成仓库公开与现有草稿发布；代理通过 GitHub API 复核，并从正式公开地址实际下载五份附件。

## 正式附件

| 文件 | 字节数 | 下载 |
| --- | ---: | --- |
| TickList-Promo-35s-1080p60.mp4 | 5952035 | [正式附件](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-Promo-35s-1080p60.mp4) |
| TickList-Promo-Cover-1920x1080.jpg | 138123 | [正式附件](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-Promo-Cover-1920x1080.jpg) |
| TickList-Promo-SHA256SUMS.txt | 198 | [正式附件](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-Promo-SHA256SUMS.txt) |
| TickList-v0.1.0.zip | 157487 | [正式附件](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-v0.1.0.zip) |
| TickList-v0.1.0.zip.sha256 | 86 | [正式附件](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-v0.1.0.zip.sha256) |

## 新增封面素材分发（2026-10-23，最终要求）

用户明确要求新增素材只进入仓库。4:3、9:16、3:4 的六张 JPG / PNG 已加入 main 分支对应 public/ 目录，并从 GitHub 返回的实际文件内容核对大小、SHA-256 与 Git blob 摘要。

| 比例 | JPG | PNG |
| --- | --- | --- |
| 4:3 | [仓库 JPG](../../marketing/video/covers/2026-10-23/public/TickList-Promo-Cover-4x3-1600x1200.jpg) | [仓库 PNG](../../marketing/video/covers/2026-10-23/public/TickList-Promo-Cover-4x3-1600x1200.png) |
| 9:16 | [仓库 JPG](../../marketing/video/covers/2026-10-23/public/TickList-Promo-Cover-9x16-1080x1920.jpg) | [仓库 PNG](../../marketing/video/covers/2026-10-23/public/TickList-Promo-Cover-9x16-1080x1920.png) |
| 3:4 | [仓库 JPG](../../marketing/video/covers/2026-10-23-3x4/public/TickList-Promo-Cover-3x4-1200x1600.jpg) | [仓库 PNG](../../marketing/video/covers/2026-10-23-3x4/public/TickList-Promo-Cover-3x4-1200x1600.png) |

此前新增的六个封面图片附件、两个封面包及两个配套校验文件，共十份，已从 Release 撤下；原有五个附件的 ID、大小和摘要均保持。Release 正文与新增封面之前的快照逐字一致，原发布名称、标签和发布时间保留。

[4:3 / 9:16 同步核验](../../marketing/video/covers/2026-10-23/github-publication.json) · [3:4 同步核验](../../marketing/video/covers/2026-10-23-3x4/github-publication.json)。撤下文件、先前发布记录与修改前文档已在本地备份；不重做视频或重新混音。

## 实际复验

五份附件的实际大小与 SHA-256 均符合已批准本地原件和服务器记录；两份下载的校验文本也逐项核对。ZIP CRC、38 个解压文件及 35 项摘要通过；两页入口、本地引用与独立 HTTP 文件访问通过。宣传片实际容器为 35 秒视频轨、2100 帧、1080p60、AAC 双声道 48kHz；JPEG 完整解码与封面目视检查通过。

本轮未重做浏览器交互、file 页面操作、连续播放、主观听审或完整 MP4 解码。应用浏览器证据来自 2026-10-08，成片批准及完整解码证据来自 2026-10-18/19；正式下载文件与这些已批准媒体的摘要相同。详细范围见[正式发布验收](正式发布验收-2026-10-23.md)。

## 源码范围

公开视频制作过程、最终场景和当前脚本、必要参数、来源与验收摘要。内部模型下载、重复备份、旧播放器与字体候选按[整理记录](仓库整理记录-2026-10-22.md)保存在本地档案。

[上传范围](上传范围说明.md) · [应用审查](../maintenance/代码审查.md) · [视频制作过程](../../marketing/video/制作过程.md)

原定公开时间为 2026-10-22 北京时间 22:50，当时网页工具无法可靠识别目标 URL，未执行公开；实际公开与发布由用户于 2026-10-23 完成。历史检查记录不改写为本轮新验收。
