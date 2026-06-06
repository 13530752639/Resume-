# GitHub 推送问题排查与解决方案

> 生成日期：2026-06-06  
> 适用环境：macOS 15.5 + Vercel 自动部署 + 哇哇VPN（Shadowsocks）

---

## 一、环境概述

| 项目 | 详情 |
|------|------|
| 操作系统 | macOS 15.5 (24F74) |
| Git 远程 | `https://github.com/13530752639/Resume-.git` |
| 认证方式 | HTTPS（凭据助手：`gh auth git-credential`） |
| GitHub CLI | 已登录（Token 范围：gist, read:org, repo, workflow） |
| SSH 密钥 | **未配置** |
| VPN 客户端 | 哇哇VPN（Shadowsocks-local，SOCKS5 127.0.0.1:12345） |
| 代理配置 | PAC 模式（http://127.0.0.1:12344/gfwlist.pac） |
| 网络出口 | 中国电信 AS4134（163data 骨干网） |
| IDE | Trae CN（含 `GIT_ASKPASS` 钩子） |
| 防火墙 | 已关闭 |

---

## 二、已发生的问题及频次

在本项目开发过程中（27 个 Git 提交），共遇到以下推送问题：

| # | 错误信息 | 出现次数 | 根因 |
|---|----------|:---:|------|
| 1 | `Failed to connect to github.com port 443: Operation timed out` | 4 次 | VPN SOCKS5 代理对 HTTPS Git 大流量不稳定 |
| 2 | `Recv failure: Operation timed out` | 2 次 | 图片文件过大（117MB），VPN 连接中断 |
| 3 | `Permission denied (publickey)` | 1 次 | SSH 密钥未配置，切换到 SSH 远程失败 |
| 4 | `The authenticity of host 'github.com (127.0.0.1)' can't be established` | 1 次 | SSH 主机密钥未加入 known_hosts |
| 5 | MCP `Permission Denied: Resource not accessible by personal access token` | 1 次 | GitHub Token 授权范围不足（仅读权限） |

---

## 三、根因分析

### 3.1 网络层：VPN 代理与 GitHub 的路由冲突

```
用户 → 哇哇VPN (SOCKS5 127.0.0.1:12345) → SS服务器(113.46.227.50:11400) → GitHub (20.205.243.166)
```

**问题**：
- PAC 规则中 GitHub 未被明确加入任何路由规则，可能走 DIRECT（被 GFW 干扰）或走 VPN（代理服务器带宽有限）
- 当走 DIRECT 时，GFW 对 GitHub HTTPS 443 端口存在间歇性阻断，导致 `i/o timeout`
- 当走 VPN 时，Shadowsocks 单服务器对 100MB+ 大文件上传支持不佳，TCP 连接容易超时断开
- `curl` 测试通过但 `git push` 失败，因为 curl 仅发送 HTTP HEAD（少量数据），而 `git push` 需要持续传输大量数据

**证据**：
- `curl -sI https://github.com` 返回 HTTP 200（秒级响应）
- `git push origin main` 携带 117MB 图片时：**75 秒后超时**
- traceroute 经过中国电信骨干网（163data），第 4 跳后可能进入国际出口拥堵

### 3.2 认证层：GIT_ASKPASS 与 gh 凭据助手的冲突

```
Trae IDE GIT_ASKPASS ←→ gh auth git-credential ←→ GitHub API Token
```

**问题**：
- Trae IDE 设置了 `GIT_ASKPASS` 环境变量，指向 `/Applications/Trae CN.app/.../askpass.sh`
- 当 `gh auth git-credential` 需要交互或刷新 Token 时，`GIT_ASKPASS` 的沙箱限制可能导致凭据获取失败
- 该 IDE 的 askpass 脚本是为 IDE 内置 Git 操作设计的，与命令行 Git 存在隔离

**证据**：直接 `git push` 经常卡在认证阶段，但通过 `git -c credential.helper="!gh auth git-credential"` 显式指定凭据助手则成功。

### 3.3 配置层：SSH 密钥缺失

- `~/.ssh/` 目录在本次会话前不存在
- 系统 **从未生成过** SSH 密钥对（`id_ed25519` / `id_rsa`）
- 本项目全程依赖 HTTPS + Token 认证
- SSH 方式在 GitHub 大文件传输中更稳定（使用 Git 原生协议，不受 HTTP 超时限制）

### 3.4 应用层：大文件传输的物理限制

| 文件集 | 大小 | 推送结果 |
|--------|------|----------|
| 人像摄影 26 张 | ~117MB | ❌ 超时（需手动重推） |
| 新闻摄影 18 张 | ~159MB | ❌ 超时（需手动重推） |
| 专题摄影 17 张 | ~13MB | ✅ 成功 |
| 代码文件 | <100KB | ✅ 始终成功 |
| 学术图片 tiaozhanbei.jpg | 515KB | ✅ 成功 |

**规律**：单次推送总大小 > 50MB 时失败率接近 100%，< 10MB 时成功率 100%。

### 3.5 工具层：MCP Token 权限不足

- 项目配置的 GitHub MCP Token 仅有 **读权限**（`gist`, `read:org`, `repo`, `workflow`）
- 无法通过 MCP API 直接写入仓库文件
- 这是 Token 权限设计问题，非 bug

---

## 四、解决方案

### 4.1 【推荐】配置 SSH 密钥（一劳永逸）

SSH 协议使用 Git 原生传输，绕过 HTTPS 的代理和超时问题，是 GitHub 大文件推送的最佳方案。

```bash
# 步骤 1：生成 SSH 密钥
ssh-keygen -t ed25519 -C "fyq@Dragon-2.local"
# 全程回车使用默认路径，建议设置密码短语（可选）

# 步骤 2：复制公钥
cat ~/.ssh/id_ed25519.pub

# 步骤 3：打开浏览器，访问 https://github.com/settings/keys
# 点击 "New SSH Key"，粘贴上一步输出的公钥内容，保存

# 步骤 4：切换项目远程地址
cd /Users/fyq/Documents/trae/Project/08_Project_resume
git remote set-url origin git@github.com:13530752639/Resume-.git

# 步骤 5：测试连接
ssh -T git@github.com
# 应输出: Hi 13530752639! You've authenticated successfully...

# 步骤 6：推送
git push origin main
```

**优势**：
- 不受 HTTP 代理干扰，使用 Git 原生协议（端口 22）
- 大文件传输稳定，支持断点续传
- 不需要每次输入密码或 Token
- Vercel 部署通过 GitHub App 连接，不受影响

### 4.2 【备选】确保 gh CLI 凭据助手正常工作

当 SSH 不可用时，当前环境的 HTTPS 方案也能工作，但需注意以下几点：

```bash
# 确认 gh 已登录
gh auth status

# 若未登录或 Token 过期
gh auth login --web
# 选择 GitHub.com → HTTPS → Login with a web browser

# 确保 Git 凭据助手配置正确
git config --global credential.https://github.com.helper '!/opt/homebrew/bin/gh auth git-credential'

# 推送时显式指定凭据助手（绕过 GIT_ASKPASS 干扰）
git -c credential.helper="!gh auth git-credential" push origin main
```

### 4.3 【应急】大文件分批推送

当遇到大文件推送超时时，将图片资源分批提交：

```bash
# 分小批添加图片（每批 < 50MB）
git add public/images/portrait/"油画少女"/A{1..6}.JPG
git commit -m "feat: 油画少女 第1批（6张）"
git push

git add public/images/portrait/"油画少女"/A{7..12}.JPG
git commit -m "feat: 油画少女 第2批（6张）"
git push

# 重复直至所有图片推送完成
```

### 4.4 【长期】图片压缩标准化

在提交到 Git 之前压缩图片，减小单次推送体积：

```bash
# JPEG 压缩至 80% 质量（视觉无损，体积减少 40-60%）
# 需要安装 ImageMagick: brew install imagemagick

# 批量压缩单个目录
mogrify -quality 80 -resize "2048>" public/images/portrait/"油画少女"/*.JPG

# PNG 转 JPEG（大幅减小体积）
magick input.png -quality 85 output.jpg
```

### 4.5 【环境级】检查 VPN 路由配置

当前 PAC 文件中对 GitHub 的路由处理不明确。建议：

- **方案 A**：在 哇哇VPN 中将 GitHub 加入"全局代理"列表，确保走 VPN 通道
- **方案 B**：推送时临时切换 VPN 为全局模式（而非 PAC 自动模式）
- **方案 C**：推送时临时关闭 VPN，使用直连（若当前网络 GitHub 可达）

### 4.6 【环境级】MCP Token 升级

若需要通过 MCP API 推送代码（替代 git push），需要生成一个有 **写入权限** 的 Token：

1. 访问 https://github.com/settings/tokens
2. 生成新的 Personal Access Token (classic)
3. 勾选 `repo`（完整仓库访问权限）和 `workflow`
4. 在 MCP 配置中替换当前 Token

---

## 五、推送故障快速诊断流程

按顺序执行以下命令，定位问题：

```bash
# 1. DNS 可达性
dscacheutil -q host -a name github.com

# 2. HTTPS 连通性
curl -sI https://github.com --connect-timeout 5

# 3. SSH 连通性
ssh -T git@github.com

# 4. Git 认证状态
gh auth status

# 5. Git 远程配置
git remote -v

# 6. 当前代理状态
scutil --proxy | grep -E "HTTP|SOCKS|ProxyAutoConfig"

# 7. 尝试推送（小文件测试）
git push origin main --dry-run
```

根据输出判断问题层级，对照第四节选择对应方案。

---

## 六、总结

| 问题类型 | 推荐方案 | 优先级 |
|----------|----------|:---:|
| 大文件推送超时 | 配置 SSH 密钥 | 🔴 高 |
| GIT_ASKPASS 冲突 | `git -c credential.helper` 显式指定 | 🟡 中 |
| VPN 路由不稳定 | 推送时切换 VPN 全局模式 | 🟡 中 |
| 图片过大 | 提交前压缩图片 | 🟢 低 |
| MCP 无写权限 | 生成含 `repo` 权限的新 Token | 🟢 低 |

**核心原则**：SSH 密钥配置是解决 GitHub 推送问题的根本性方案。一旦配置完成，后续所有推送操作将不再受网络波动、代理切换、凭据过期等因素影响。
