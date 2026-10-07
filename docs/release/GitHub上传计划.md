# GitHub 上传与发布记录

日期：2026-10-07。目标：Aaron7510/ticklist，main 分支。用户已确定先私有后公开、MIT 代码许可，优先源码与离线下载包；本次不启用 Pages。

## 当前完成项

- 修复大于5 MiB的合法备份无法恢复问题，并增加取消、保存失败、成功恢复及双语回归。
- 修复12个字体候选辅助标题；完善实际备份文件名和生成产物的忽略规则。
- 增加根目录 LICENSE 与 BRAND-LICENSE.md，下载包包含两份说明并记录其摘要。
- npm run check 通过；npm run package 打包35个运行及许可文件，各文件SHA-256通过核对。
- 内置浏览器真实JSON下载、刚下载文件恢复及刷新核对通过；实际Markdown的完成标记、说明及日期通过检查。
- 已创建空的私有仓库 https://github.com/Aaron7510/ticklist，当前账户具备管理及推送权限。
- Git作者仅在本仓库设置为Soren，使用GitHub隐私邮箱；不修改全局配置。

## 正式公开前仍需完成

1. Chrome与Edge的file/HTTP使用、真实下载恢复、指定桌面尺寸及实际减少动态效果验收。内置浏览器无法替代该矩阵；file://自动访问被平台安全策略拒绝，需人工验证独立示例副本。
2. 审阅暂存清单及差异，提交并推送私有main；核对远端SHA并确认GitHub Actions成功。
3. 从该提交建立干净检出，再运行检查、打包和完整摘要验证；生成候选ZIP及SHA-256，解压复验。
4. 上述条件全部满足后，在最终验证提交上创建v0.1.0标签及草稿Release，附正式ZIP、摘要与中文发布说明。
5. 核对内容和附件后将仓库公开、发布Release，再下载正式附件验证。不通过验收时保留私有候选，无正式标签。

## 上传内容

显式提交 .gitignore、.gitattributes、.github、package.json、README.md、LICENSE、BRAND-LICENSE.md、两个HTML、assets、brand、tests、tools、docs和marketing。archive、dist、release-artifacts、内部验收截图、环境配置及真实任务备份不提交。公开恢复样例仅保留 tests/fixtures/valid-backup.json。

工具无需 npm install；GitHub检查流程仅有 contents: read，不自动部署。源码仓库与离线发布包分别维护，生成目录不作为源码提交。数据键todo.list.v3、备份标识aaron-todo-backup及版本1保持兼容。

品牌保持勾号与Segoe UI Bold固定字标；不分发字体文件，也不把代码MIT视为品牌或第三方字体授权。详见 [品牌与素材说明](../../BRAND-LICENSE.md)。

## 发布物及边界

候选包为本地 release-artifacts/TickList-v0.1.0-candidate.zip；正式验收通过后才生成 TickList-v0.1.0.zip。附件含运行资产、许可说明、使用说明和release-manifest.json，不含维护源码、历史素材或真实任务。

版本功能与使用边界见 [发布说明草稿](v0.1.0说明.md)，验收证据见 [代码审查](../maintenance/代码审查.md)。上传代码不迁移当前浏览器数据；更换访问地址前需备份并在新入口恢复。无云同步、多页自动合并或手机端适配承诺。
