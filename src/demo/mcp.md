---
title: MCP 集成
icon: plug
order: 8
author: TheBlind
date: 2026-08-26
category:
  - 使用指南
tag:
  - MCP
  - AI
  - 使用指南
star: true
---

# T-Shell MCP 集成

T-Shell 安装包已经内置本地 `stdio` MCP Server。支持 MCP 的 AI 客户端可以通过它读取 T-Shell 中保存的会话，并在你明确开启权限后执行 SSH 命令、上传或下载文件，以及操作 T-Shell GUI 中已经打开的共享终端。

本文以 macOS 和 Codex 为例。其他支持本地 `stdio` MCP 的客户端可以使用同一个可执行文件。

## 功能与工具

完成本文的完整配置后，T-Shell MCP 会提供以下 10 个工具：

| 工具 | 用途 | 所需条件 |
| --- | --- | --- |
| `tshell_list_sessions` | 列出 T-Shell 中保存的会话 | 无额外权限开关 |
| `tshell_get_session` | 读取指定会话的信息 | 无额外权限开关 |
| `tshell_exec` | 通过保存的会话执行独立命令 | `--allow-exec`，目前仅支持 SSH |
| `tshell_upload_file` | 将本地文件上传到 SSH 主机 | `--allow-file-upload`，本地文件须位于可读根目录中 |
| `tshell_download_file` | 从 SSH 主机下载文件到本地 | `--allow-file-download`，目标位置须位于可写根目录中 |
| `tshell_shared_list_terminals` | 列出 GUI 中已经打开的共享终端 | T-Shell GUI 正在运行 |
| `tshell_shared_read_terminal` | 读取共享终端当前内容 | 目标终端已经打开 |
| `tshell_shared_read_tail` | 读取共享终端末尾内容 | 目标终端已经打开 |
| `tshell_shared_send_input` | 向共享终端发送输入 | `--allow-shared-input` |
| `tshell_shared_resize_terminal` | 调整共享终端尺寸 | `--allow-shared-input` |

`--allow-read-root` 和 `--allow-write-root` 分别限定 MCP 可以读取和写入的本地目录，防止文件传输访问未授权路径。`--allow-shared-input` 可以操作 T-Shell GUI 中已经打开的 Telnet 终端。`tshell_exec` 使用独立的命令执行通道，目前仅支持 SSH，不会继承 GUI 终端当前的目录、环境变量或后台任务。

## 1. 验证安装包中的 MCP Server

macOS 默认安装位置：

```text
/Applications/T-Shell.app/Contents/MacOS/tshell-mcp
```

先验证可执行文件：

```bash
/Applications/T-Shell.app/Contents/MacOS/tshell-mcp --version
```

看到类似 `tshell-mcp 0.1.0` 的输出即表示可执行文件可用。直接运行且不带参数时，进程会等待 MCP 客户端通过标准输入发送请求，因此不要用这种方式判断它是否卡住。

::: tip 使用安装包内的 sidecar
其他 AI 客户端或 agent 应优先使用 T-Shell 安装包内的 `tshell-mcp`。不要引用源码仓库里的 `target/release`，以免应用版本与 MCP Server 版本不一致。
:::

## 2. 配置 Codex

编辑 `~/.codex/config.toml`。如果文件中已经存在 `[mcp_servers.tshell]`，请更新原有配置，不要再创建同名配置表。

```toml
[mcp_servers.tshell]
command = "/Applications/T-Shell.app/Contents/MacOS/tshell-mcp"
args = [
  "--allow-exec",
  "--allow-shared-input",
  "--allow-file-upload",
  "--allow-read-root",
  "/Users/your-name/Documents",
  "--allow-file-download",
  "--allow-write-root",
  "/Users/your-name/Downloads"
]
```

请把 `your-name` 替换为当前 macOS 用户名，也可以把两个目录改成你希望授权的绝对路径。示例允许 MCP 从 `Documents` 读取待上传文件，并把下载文件写入 `Downloads`。

这份配置同时开启 SSH 命令执行、共享终端输入和文件传输。如果不需要某项写能力，请删除对应的权限开关。`--allow-read-root` 与 `--allow-write-root` 可以重复填写，以授权多个目录。

### 在 Codex 安装界面填写

| 字段 | 内容 |
| --- | --- |
| 名称 | `tshell` |
| 类型 | 本地命令 / `stdio` |
| 启动命令 | `/Applications/T-Shell.app/Contents/MacOS/tshell-mcp` |
| 环境变量 | 留空 |
| 工作目录 | 留空 |

参数按顺序填写：

```text
--allow-exec
--allow-shared-input
--allow-file-upload
--allow-read-root
/Users/your-name/Documents
--allow-file-download
--allow-write-root
/Users/your-name/Downloads
```

同样需要把 `your-name` 替换为当前 macOS 用户名。

## 3. 其他 MCP 客户端

使用 JSON 配置的本地 MCP 客户端可以参考：

```json
{
  "mcpServers": {
    "tshell": {
      "command": "/Applications/T-Shell.app/Contents/MacOS/tshell-mcp",
      "args": [
        "--allow-exec",
        "--allow-shared-input",
        "--allow-file-upload",
        "--allow-read-root",
        "/Users/your-name/Documents",
        "--allow-file-download",
        "--allow-write-root",
        "/Users/your-name/Downloads"
      ]
    }
  }
}
```

不同客户端的配置文件位置和最外层字段名可能不同，请以对应客户端的文档为准。传输类型必须选择本地 `stdio`，不要把 `tshell-mcp` 配置成 HTTP 服务。

## 4. 重启并验证

配置完成后，重启 Codex 或新建一个任务。Codex Desktop、CLI 和 IDE 扩展在同一台机器上共享 MCP 配置，通常只需配置一次。

可以先运行：

```bash
codex mcp list
```

在 Codex 终端界面中也可以使用 `/mcp` 查看当前连接的 Server。确认 `tshell` 已加载后，再检查是否暴露了全部 10 个工具：

```text
tshell_list_sessions
tshell_get_session
tshell_exec
tshell_upload_file
tshell_download_file
tshell_shared_list_terminals
tshell_shared_read_terminal
tshell_shared_read_tail
tshell_shared_send_input
tshell_shared_resize_terminal
```

随后可以让 AI 客户端执行以下只读验证：

1. “列出我在 T-Shell 中保存的会话。”
2. “列出当前 T-Shell 的共享终端。”
3. “读取指定共享终端最后 20 行，不要发送任何输入。”

## 5. 复制给其他 agent

将下面的内容复制给需要安装或更新 T-Shell MCP 的 agent，并让它把 `<你的用户名>` 替换为当前 macOS 用户名：

```text
请在当前 macOS 上安装或更新 T-Shell MCP：

1. 使用 T-Shell 安装包中的 MCP 可执行文件：
   /Applications/T-Shell.app/Contents/MacOS/tshell-mcp

2. 先验证：
   /Applications/T-Shell.app/Contents/MacOS/tshell-mcp --version

3. 在 ~/.codex/config.toml 中新增或更新配置，不要创建重复的 [mcp_servers.tshell]：

[mcp_servers.tshell]
command = "/Applications/T-Shell.app/Contents/MacOS/tshell-mcp"
args = [
  "--allow-exec",
  "--allow-shared-input",
  "--allow-file-upload",
  "--allow-read-root",
  "/Users/<你的用户名>/Documents",
  "--allow-file-download",
  "--allow-write-root",
  "/Users/<你的用户名>/Downloads"
]

4. 不要传递主机地址、密码、私钥或登录凭据。
5. 配置完成后提醒我重启 Codex 或新建任务。
6. 重启后验证 tshell MCP 是否暴露以下 10 个工具：
   tshell_list_sessions
   tshell_get_session
   tshell_exec
   tshell_upload_file
   tshell_download_file
   tshell_shared_list_terminals
   tshell_shared_read_terminal
   tshell_shared_read_tail
   tshell_shared_send_input
   tshell_shared_resize_terminal
7. 不要引用源码仓库的 target/release；始终优先使用安装包里的 sidecar。
```

## 6. 权限与安全

- 不要在 MCP 配置或命令参数中传递主机地址、用户名、密码、私钥或其他登录凭据。`tshell-mcp` 会读取 T-Shell 已保存的会话。
- `--allow-exec` 允许 AI 客户端在远程 SSH 主机上执行命令；不需要时应移除此参数。
- `--allow-shared-input` 允许 AI 客户端改变 GUI 终端状态，包括向已经打开的 Telnet 终端发送输入；不需要时应移除此参数。
- `--allow-file-upload` 开启上传工具；`--allow-read-root` 限定允许读取的本地根目录。两者必须配合使用。
- `--allow-file-download` 开启下载工具；`--allow-write-root` 限定允许写入的本地根目录。两者必须配合使用。
- 读写根目录应尽量具体，不要直接授权整个用户目录或磁盘根目录。
- 首次连接未知 SSH 主机或主机密钥发生变化时，应在 T-Shell GUI 中人工确认。
- 启用写能力后，先要求 AI 读取会话或终端状态，再明确指定要执行或发送的内容。

## 常见问题

### 找不到 `tshell-mcp`

确认已经安装最新版 T-Shell，并检查应用是否位于 `/Applications/T-Shell.app`。如果安装在其他位置，请把配置中的 `command` 改成实际的 sidecar 绝对路径。

### 找不到会话或 `local.db`

先启动一次 T-Shell 并保存至少一个会话，然后确认 `--data-dir` 指向包含 `local.db` 的目录。

### 没有 `tshell_exec`

确认 `args` 中包含 `--allow-exec`，然后重启 Codex 或新建任务。`tshell_exec` 目前仅支持 SSH 会话。

### 无法读取或操作共享终端

确认 T-Shell GUI 正在运行，并且目标终端已经打开。发送输入或调整终端大小还需要 `--allow-shared-input`。

### 无法上传或下载文件

上传需要同时配置 `--allow-file-upload` 和至少一个 `--allow-read-root`；待上传文件必须位于授权目录中。下载需要同时配置 `--allow-file-download` 和至少一个 `--allow-write-root`；本地目标路径必须位于授权目录中。

### 修改配置后没有生效

检查 `config.toml` 中是否存在重复的 `[mcp_servers.tshell]`，运行 `codex mcp list` 查看状态，然后重启 Codex 或新建任务。

Codex 配置格式依据 [OpenAI 官方 MCP 文档](https://developers.openai.com/codex/mcp)。
