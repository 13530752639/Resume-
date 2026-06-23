# 阿里云 CDN 回源 Cloudflare R2 配置指南

> 适用项目：`www.zhangzelong.top` 导演作品集网站  
> 目标：将视频/图片资源通过阿里云 CDN 国内节点加速，解决 R2 跨境加载慢的问题

---

## 前置条件

1. ✅ 域名 `zhangzelong.top` 在阿里云购买并完成实名认证
2. ⚠️ 域名需要 **ICP 备案**（工信部备案号），否则阿里云 CDN 无法为大陆节点提供服务
   - 如果尚未备案：登录 [阿里云备案系统](https://beian.aliyun.com/) 提交申请，通常需 15-20 个工作日
   - 如果已备案：直接进入下一步

---

## 第一步：添加 CDN 加速域名

1. 登录 [阿里云 CDN 控制台](https://cdn.console.aliyun.com/)
2. 点击 **添加域名**
3. 填写配置：

| 配置项 | 值 |
|--------|-----|
| **加速域名** | `cdn.zhangzelong.top`（推荐） |
| **业务类型** | 图片小文件 |
| **加速区域** | 仅中国大陆 |
| **源站信息** | 填写如下 ↓ |

**源站配置：**
| 配置项 | 值 |
|--------|-----|
| 源站类型 | OSS 域名 / 自有源 |
| 源站地址 | `pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev` |
| 端口 | 443（HTTPS） |
| 回源协议 | 协议跟随（或 HTTPS） |

4. 点击 **下一步**

---

## 第二步：配置 CNAME 解析

1. CDN 添加成功后，系统会分配一个 **CNAME 值**（如 `cdn.zhangzelong.top.w.kunlunca.com`）
2. 登录 [阿里云 DNS 解析控制台](https://dns.console.aliyun.com/)
3. 选择域名 `zhangzelong.top`
4. **添加记录**：

| 配置项 | 值 |
|--------|-----|
| 记录类型 | CNAME |
| 主机记录 | `cdn` |
| 记录值 | CDN 控制台分配的 CNAME 值 |
| TTL | 600（默认） |

5. 保存，等待 DNS 解析生效（通常 10 分钟内）

---

## 第三步：配置 HTTPS 证书

1. 在 CDN 控制台 → 域名管理 → 选择 `cdn.zhangzelong.top`
2. 点击 **HTTPS 配置**
3. 开启 **HTTPS 安全加速**
4. 证书选择：
   - **推荐**：使用阿里云 **免费证书**（自动申请、自动续期）
   - 或手动上传现有证书
5. 保存配置

---

## 第四步：配置缓存策略

在 CDN 控制台 → 缓存配置中，建议如下规则：

| 路径 | 缓存时间 | 说明 |
|------|---------|------|
| `*.mp4` | 30 天 | 视频文件改动少，长缓存 |
| `*.jpg, *.png, *.webp` | 7 天 | 图片中等缓存 |
| `*.js, *.css` | 30 天 | 前端资源（如果也用 CDN） |
| `*` | 1 天 | 默认 |

---

## 第五步：配置回源 Host 和 Range 回源

> ⚠️ 关键：R2 是 S3 兼容存储，必须正确配置回源 Host

1. CDN 控制台 → 回源配置 → **回源 HOST**
2. 设置为：`pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev`

3. **开启 Range 回源**（视频拖拽进度条必需）
   - 回源配置 → Range 回源 → 开启

---

## 第六步：配置跨域（CORS）

由于网站前端在 Vercel（`www.zhangzelong.top`），视频通过 CDN（`cdn.zhangzelong.top`），需要配置跨域：

1. CDN 控制台 → 回源配置 → **自定义回源 HTTP 头**
2. 添加以下响应头（阿里云 CDN 可配置回源时携带的请求头）：

实际上，因为您使用 R2 作为源站，需要先在 **Cloudflare R2** 端配置 CORS：
```json
[
  {
    "AllowedOrigins": ["https://www.zhangzelong.top"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

在 Cloudflare Dashboard → R2 → `tare` bucket → Settings → CORS 中添加。

---

## 第七步：更新项目并部署

1. 在项目根目录创建 `.env` 文件：
```bash
VITE_MEDIA_URL=https://cdn.zhangzelong.top
```

2. 本地测试：
```bash
npm run dev
```

3. 构建并部署：
```bash
npm run build
# 推送到 GitHub → Vercel 自动部署
```

---

## 费用预估

| 项目 | 月费估算 |
|------|---------|
| CDN 流量（假设 50GB/月） | ≈ ¥12/月（¥0.24/GB） |
| CDN 请求数 | 基本免费 |
| HTTPS 请求 | 前 1000 万次免费 |
| R2 存储（1.5 GB） | 免费（10GB 内免费） |

**月费总计：约 ¥12-20**，远低于重编码所有视频的时间成本。

---

## 验证方法

配置完成后，验证 CDN 是否生效：

```bash
# 直接访问 R2（跨境，慢）
curl -sI https://pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev/covers/compressed/fengmian-new.jpg | grep -E 'x-cache|cf-cache-status'

# 通过 CDN 访问（国内，快）
curl -sI https://cdn.zhangzelong.top/covers/compressed/fengmian-new.jpg
```

对比响应头中的 `x-cache` 相关字段。首次访问为 MISS（回源），再次访问为 HIT（命中缓存）。

---

## 故障排查

| 问题 | 可能原因 | 解决方法 |
|------|---------|---------|
| CDN 返回 404 | 回源 Host 配置错误 | 确认回源 Host 为 `pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev` |
| 视频无法拖拽 | Range 回源未开启 | 回源配置中开启 Range 回源 |
| HTTPS 证书错误 | 证书未配置或过期 | 使用阿里云免费证书自动续期 |
| 跨域报错 | R2 CORS 未配置 | 在 Cloudflare R2 中配置 CORS |
| 如果未备案 | CDN 选择"全球（含中国大陆以外）"暂用 | 尽快完成 ICP 备案 |
