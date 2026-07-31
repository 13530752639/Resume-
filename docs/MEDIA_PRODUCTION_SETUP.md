# 生产媒体域名配置

网站代码已支持通过 `VITE_MEDIA_URL` 切换视频源。正式环境应使用绑定到 Cloudflare R2 的自定义域名，避免继续依赖仅用于开发用途、可能限流的 `r2.dev` 地址。

## 推荐配置

1. 在 Cloudflare R2 中打开当前视频 Bucket，选择“设置 → 自定义域”。
2. 绑定 `media.zhangzelong.top`，等待证书状态变为“有效”。
3. R2 CORS 至少允许网站域名 `https://www.zhangzelong.top` 和方法 `GET`、`HEAD`。
4. 在 Vercel 项目的 Production 环境变量中设置：

   ```text
   VITE_MEDIA_URL=https://media.zhangzelong.top
   ```

5. 重新构建并部署网站。不要把 R2 密钥写入 Vercel 的前端变量或提交到仓库。

## 缓存建议

在 Cloudflare 为 `media.zhangzelong.top/*` 设置缓存规则：

- Browser TTL：1 天或遵循源站
- Edge TTL：30 天
- Cache eligibility：Eligible for cache
- 保留 `Range` 请求，MP4 需要能返回 `206 Partial Content`

视频文件名若内容发生变化，建议换新文件名或增加版本路径，避免长缓存继续命中旧文件。

## 上线前验证

项目根目录执行：

```bash
MEDIA_URL=https://media.zhangzelong.top npm run verify:media
npm run check
```

也可以抽查响应头：

```bash
curl -I 'https://media.zhangzelong.top/aigc/%E5%A4%A9%E5%AE%ABDISCO.mp4'
curl -sS -D - -o /dev/null -H 'Range: bytes=0-1023' \
  'https://media.zhangzelong.top/aigc/%E5%A4%A9%E5%AE%ABDISCO.mp4'
```

第二条命令应返回 `206`，并包含 `Content-Range` 和正确的 `Content-Type: video/mp4`。

## 回退行为

如果没有设置 `VITE_MEDIA_URL`，网站暂时回退到现有 `r2.dev` 地址，保证代码上线后仍能播放。自定义域生效后应立即设置生产环境变量并重新部署。
