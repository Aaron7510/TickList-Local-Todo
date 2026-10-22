# 公开视频制作证据

这些记录说明 2026-10-18 制作与 2026-10-19 定版过程；原数据与本轮整理结果分开，不将历史检查改写为当前新检查。

- [音乐初始参数与音乐代码](music-generation/a-room-to-think0.json)、[浮点母版生成参数](music-generation/a-clean-turbo.json)：保留实际使用链路的参数；相同 seed 不保证生成相同音频。
- [三版配乐信号分析](score/candidate-analysis.json)：A/B/C 的历史比较，不代表后两版也获批准。
- [配乐剪辑与混音记录](score/mix-report.json)：原始音乐包络、让位窗口及电平；source 字段是制作当时的历史名称，不是当前文件入口。
- [最终音效事件表](sfx/sfx-manifest.json)：当前 verify-final.py 实际读取，保留原字节。
- [用户批准原记录](sfx/acceptance.json)：其中本机审阅地址、旧备份和 verification.json 为历史字段，不是当前下载入口。
- [最终技术核验摘要](verification-summary.json)：从原技术记录摘录，记录来源 SHA-256；本轮没有据此新增听音或浏览器验收。

[制作过程](../../../制作过程.md) · [当前工程](../../README.md) · [来源与许可](../../media/recordings/CREDITS.md) · [最终媒体](../../../release/2026-10-19/README.md)

模型下载、重复备份、整页来源和原始脚本等完整原件在本地 archive/2026-10-22-repository-review/ 保存；当前公开 Markdown 不包含旧交付说明的失效入口。
