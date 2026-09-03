# logs/ — AI Coding 日志目录

存放你在开发中与 AI 工具的对话日志，和作品代码一并提交。

## 目录结构

```text
logs/
└── saber8899110-arch/           # GitHub 用户名
    ├── manifest.json            # 会话清单
    └── <date>/                  # 日期 YYYY-MM-DD
        └── <tool>__<sid>.jsonl  # 一个会话一个文件（工具名与 session id 用 __ 连接）
```

- `<tool>`：`claude-code` / `opencode` / `codex` / `kiro`
- 每个 `.jsonl` 每行一个事件，由组委会提供的日志归集工具导出，**只提交 JSONL 本身**。

## 日志字段说明

每条日志包含以下字段：

| 字段 | 说明 |
|------|------|
| `text` | 与 AI 的对话正文 |
| `thinking` | AI 的思考过程 |
| `tool_name` | 工具名称（read/edit/bash 等） |
| `input` | 工具输入 |
| `output` | 工具输出 |
| `model` | 所用模型名称 |
| `tokens_in` | 输入 token 数 |
| `tokens_out` | 输出 token 数 |
| `seq` | 会话内递增序号 |

## 提交步骤

日志在会话结束时自动写入本地 `logs/`，但**不会自动执行 `git push`**。需要手动提交：

```bash
# 1. 添加日志
git add logs/

# 2. 提交（使用 -s 签名）
git commit -s -m "logs: sync AI sessions"

# 3. 推送到远程
git push
```

## 重要注意事项

1. **自动采集**：日志通过安装的 hook 自动采集，无需手动操作
2. **隐私保护**：仅在 openvela 工作区内（存在 `.repo/`）的操作才会被采集
3. **禁止修改**：修改日志内容被视为**作弊**
4. **工具限制**：只有 Claude Code、OpenCode、Codex CLI 的对话计入有效工时

## 验证工具

```bash
# 验证日志完整性（检测序号断档或内容篡改）
validate-log.py logs/

# 可视化查看日志内容
render-log.py logs/

# 健康检查
verify-setup.sh
```

## 历史补导

如需补导安装 hook 前的 Claude Code 历史对话：

```bash
contest-snapshot --backfill
```

该命令会自动扫描 `~/.claude/projects/` 下的 transcript，跳过已采集的，不会产生重复。

---

导出与提交的完整步骤、字段定义见[《AI Coding 日志归集与提交手册》](https://github.com/open-vela/docs/blob/dev-ai-contest-2026/zh-cn/contest_2026/ai_coding_log_guide.md)。
