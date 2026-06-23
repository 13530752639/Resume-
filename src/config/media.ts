/**
 * 媒体资源基础 URL 配置
 *
 * 默认使用 Cloudflare R2 公共 URL。
 * 若要启用阿里云 CDN 加速，在 .env 中设置:
 *   VITE_MEDIA_URL=https://cdn.zhangzelong.top
 *
 * CDN 配置后会回源到 R2，路径结构与 R2 一致。
 */
export const MEDIA_URL =
  import.meta.env.VITE_MEDIA_URL ||
  'https://pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev'
