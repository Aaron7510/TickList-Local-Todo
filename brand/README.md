# TickList 品牌设计

产品名称：TickList。开发者：Soren。主品牌文案：把今天，一件件做好。

品牌图形的项目内展示与分发范围见 [品牌与素材说明](../BRAND-LICENSE.md)；代码采用 [MIT](../LICENSE)。路径化的固定字标不包含字体文件，也不授予第三方字体分发权。

核心为打勾图形，代表待办被完成。标志采用圆角方块与圆润勾号；用户已选定 02：Segoe UI Bold 为正式字标字体。所有 SVG 字标均为路径，展示与重建正式资产不依赖字体安装。无角色设定。

直接打开 `preview.html` 查看品牌展示、深浅背景、小尺寸和一次性勾号绘制动画。

预览页保留六种字体对比，默认显示已定稿的 Segoe UI Bold。点击其他选项仅切换预览，不改变正式页面；正式清单、首页、深浅色与单色组合、现行 PNG 均使用 Segoe UI Bold。

候选字标位于 `font-options/`，已转换为 SVG 路径，浏览时无需安装字体。`build-font-options.ps1` 从本机已安装的 Windows 字体生成这些预览，不分发字体文件。

## 资产

资产位于 `../assets/brand/`，应用可直接引用，无运行依赖。

| 文件 | 用途 |
| --- | --- |
| icon.svg | 主图标，蓝紫渐变底块 |
| icon-solid.svg | 实心蓝底版本，适合小尺寸 |
| icon-mono-dark.svg / icon-mono-light.svg | 单色图标，适配浅色 / 深色背景 |
| tick-blue.svg / tick-white.svg | 透明底独立勾号，用于较大宣传画面 |
| logo-light.svg / logo-dark.svg | 图标与 TickList 字标组合，适配浅色 / 深色背景 |
| logo-mono-dark.svg / logo-mono-light.svg | 单色品牌组合 |
| favicon.svg / favicon.ico / favicon-16.png / favicon-32.png | 浏览器图标，16 px 版本单独调整笔画 |
| icon-512.png / icon-1024.png | 主图标，透明圆角外区域 |
| apple-touch-icon.png | 180 px 触屏书签图标 |
| logo-light.png / logo-dark.png | 透明背景品牌组合 |
| product-promo.svg | landing 专用矢量宣传界面，1440 × 929，清单宽度占 38%，三条示例任务 |
| product-promo-en.svg | 同尺寸英文宣传界面，随 landing 的语言选择切换 |

## 使用规范

- 主色 #4F6EF7，辅助紫色 #8473F5。绿色 #22A06B 用于任务完成反馈。
- 图标圆角半径为边长的 18/64；主勾号在 64 单位画布中使用 7 单位笔画。
- 图标四周至少留出边长 1/4 的净空；组合标志至少留出图标边长 1/4 的净空。
- 16 px 使用专门的 favicon 版本；24 px 使用实心蓝底；32 px 以上可使用主渐变版本。
- 保持原始比例，不旋转、拉伸或给勾号增加额外装饰。深色背景使用 logo-dark，避免深色字标不可见。
- 开发者使用“Developed by Soren”或“由 Soren 开发”，作为次级信息放在页脚、设置或视频片尾。
- 动画只在触发时绘制一次勾号；尊重系统减少动态效果的设置。

`build-assets.js` 是可复现的 SVG 源文件生成入口，读取已保存的 `wordmark-segoe-ui.svg` 字形轮廓。运行 `node brand/build-assets.js` 可重建 SVG；PNG 与 ICO 可通过 `render-assets.js` 使用指定的本地图像库生成。

`build-product-visual.js` 直接生成 `product-promo.svg`，复用应用颜色、正式 Logo、颜色模式与设置图标，采用三条公开示例任务。它只调整宣传画面的文字尺寸、间距和取景，不读写任务数据。运行 `node brand/build-product-visual.js` 可重建中文图；运行 `node brand/build-product-visual.js en` 可重建英文图。矢量图可直接用于介绍页，无需截图或二次压缩。

## 数据兼容

README 的两张页面展示图由 `build-readme-visuals.js` 生成。运行 `node brand/build-readme-visuals.js` 可重建 `docs/visuals/landing-zh.svg` 与 `docs/visuals/app-zh.svg`。脚本读取页面文案、应用色值、正式 Logo 与公开任务样例，生成原生 SVG，不包含位图、外部资源或脚本。它们用于静态展示，浏览器实际运行证据仍使用验收记录。

应用更名不改本地任务键 `todo.list.v3` 或既有备份格式 `aaron-todo-backup`；该字符串为旧数据协议标识。页面与导出文件显示 TickList。

历史截图与旧 ZIP 已迁入本地 `archive/2026-10-06/`，不作为当前发布包。字体候选仅用于品牌研究，不包含在网页发布目录 `dist/`。原 Windows 字体的授权仍以对应字体许可为准；发布前应核实字形轮廓分发权，项目代码许可不替代字体许可。
