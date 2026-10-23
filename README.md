# TickList

今天要做什么，一眼就清楚。把今天，一件件做好。

TickList 是面向电脑端的轻量待办网页：无需注册，任务保存在当前浏览器。使用普通 HTML、CSS 和 JavaScript，没有框架、第三方运行依赖或构建前置步骤。

## 页面展示

### 产品介绍页（Landing）

介绍 TickList 的使用方式与价值，从“开始记录今天”进入清单。

[![TickList 产品介绍页矢量展示](docs/visuals/landing-zh.svg)](docs/visuals/landing-zh.svg)

[查看介绍页 SVG 原图](docs/visuals/landing-zh.svg) · [页面源码](landing.html)

### 清单页（产品界面）

一行记录任务，安排截止时间，查看未完成事项，逐项完成。

按 1440 × 900 桌面实机比例展示：清单宽度 560 px，保留页面原有留白、字号与控件尺寸。

[![TickList 清单页矢量展示](docs/visuals/app-zh.svg)](docs/visuals/app-zh.svg)

[查看清单页 SVG 原图](docs/visuals/app-zh.svg) · [页面源码](index.html)

展示图按现有页面样式绘制为原生 SVG，文字与图形均为矢量，放大不会产生截图像素模糊。图中只使用公开示例任务；这是静态界面展示，实际浏览器验收截图保留在 `docs/screenshots/`。

## 下载与宣传视频

[TickList v0.1.0 已正式发布](https://github.com/Aaron7510/TickList-Local-Todo/releases/tag/v0.1.0)，发布时间为 2026-10-23 北京时间 11:32。

- [下载应用离线 ZIP](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-v0.1.0.zip) · [ZIP 的 SHA-256 校验文件](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-v0.1.0.zip.sha256)
- [下载 35 秒宣传片 MP4](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-Promo-35s-1080p60.mp4) · [下载横版封面](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-Promo-Cover-1920x1080.jpg) · [媒体校验文件](https://github.com/Aaron7510/TickList-Local-Todo/releases/download/v0.1.0/TickList-Promo-SHA256SUMS.txt)
- [阅读宣传视频制作过程](marketing/video/制作过程.md) · [正式附件验收记录](docs/release/正式发布验收-2026-10-23.md)

完整解压应用 ZIP 后打开 landing.html 或 index.html；也可通过 GitHub 的 Code → Download ZIP 获取源码。源码仓库与视频制作过程均已公开。

## 使用

打开 `landing.html` 查看产品介绍，点击“开始记录今天”进入清单；也可以直接打开 `index.html`。移动或分发时，请一起保留两个 HTML 和 `assets/`。

开发预览可安装 Node.js 24 LTS 后，在项目根目录运行：

```text
npm run serve
```

打开终端显示的本地地址，默认端口 4180。无需 `npm install`。Node 只用于检查、预览和打包，网页使用本身不依赖 Node。

## 功能

- 一行添加任务；全部、未完成、已完成筛选。
- 独立鼠标拖动手柄、截止时间弹窗和自动逾期状态。
- 点击任务查看详情，编辑名称和说明；创建时间放在详情内。
- 删除或清除已完成后，可在 10 秒内撤销。
- 设置按“数据”和“导出”分组：JSON 备份、恢复和 Markdown 导出。
- 深浅色模式，中英文切换；介绍页和清单页共用最近的语言选择。
- 保存异常和旧页面编辑冲突提示；内存中的未保存任务仍可备份。

当前版本只开发和维护电脑端。不提供账号、云同步、多设备同步或手机端适配承诺。

## 许可

网页应用代码、通用工具、测试和文字文档采用 [MIT 许可](LICENSE)，Copyright (c) 2026 Soren。视频制作工程另见其[权利说明](marketing/video/production/RIGHTS.md)。品牌图形及截图按 [品牌与素材说明](BRAND-LICENSE.md) 授权随项目展示和分发，不属于代码 MIT 许可范围，也不授予第三方字体分发权。

## 数据与备份

数据保存在当前浏览器的本地存储中，建议定期下载 JSON 备份。清除浏览器数据、更换浏览器或访问地址，可能使原清单无法访问；从本地文件迁到 HTTP 或 GitHub Pages 前，应先备份，再在新地址恢复。Markdown 是阅读文档，不能用来恢复完整数据。

兼容原任务键 `todo.list.v3`，支持 v1/v2 迁移。JSON 协议保持 `aaron-todo-backup`、版本 1；这是历史协议标识，页面产品名仍为 TickList。任务包含 id、text、description、done、deadline、createdAt，名称最多 200 字、说明最多 5000 字。

超过 5 MiB 的 JSON 备份会先提示耗时并询问是否继续，而不会仅因大小被拒绝。恢复还需确认覆盖；格式无效或浏览器无法保存时，当前清单不会被替换。

损坏数据会保留原键并尝试写入 recovery 副本；副本保留失败时禁止覆盖。副本尚无用户恢复入口。多页写入通过“保存前检查上次读取值”防止旧数据覆盖，出现冲突时先备份本页再刷新；尚无自动合并或跨页原子锁，建议一个页面编辑。

## 开发与维护

网页运行无需安装依赖。开发检查和打包使用 Node.js 24：

- npm run check：语法、资源引用及存储、语言、任务流程、介绍页测试。
- npm run package：生成 dist/ 静态目录和文件摘要，包含两个页面、运行资产、许可和使用说明。

| 目录 | 用途 |
| --- | --- |
| assets/ | 页面脚本、样式及运行资产 |
| tests/、tools/ | 自动检查、预览与打包 |
| brand/ | 正式品牌规范与资产生成源 |
| docs/ | 版本说明、最终审查及公开示例 |
| marketing/video/ | 公开的视频制作过程、最终工程和来源记录 |

- [版本记录](CHANGELOG.md) · [当前验收与已知限制](docs/maintenance/代码审查.md)
- [发布记录](docs/release/GitHub上传计划.md) · [v0.1.0 说明](docs/release/v0.1.0说明.md)
- [品牌规范](brand/README.md) · [正式品牌预览](brand/preview.html)
- [宣传视频制作过程](marketing/video/制作过程.md) · [视频编辑工程](marketing/video/production/README.md)

源码仓库与 v0.1.0 Release 均已公开。应用标签基准为 9896044；Pages 未启用，下载后本地使用。
