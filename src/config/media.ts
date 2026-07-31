/**
 * 媒体资源基础 URL 配置。
 *
 * 生产环境应通过 VITE_MEDIA_URL 指向绑定 R2 的自定义域名，例如：
 *   VITE_MEDIA_URL=https://media.zhangzelong.top
 *
 * r2.dev 只保留为尚未完成自定义域名配置时的兼容回退。
 */
export const LEGACY_MEDIA_URL =
  'https://pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev'

export const MEDIA_URL = (
  import.meta.env.VITE_MEDIA_URL?.trim() || LEGACY_MEDIA_URL
).replace(/\/+$/, '')

/**
 * 将 R2 内的对象路径解析到当前媒体域名。
 * 同时兼容旧数据中写死的 r2.dev 完整地址，方便无停机迁移。
 */
export function resolveMediaUrl(value: string): string {
  if (!value) return ''

  if (value.startsWith(LEGACY_MEDIA_URL)) {
    return `${MEDIA_URL}${value.slice(LEGACY_MEDIA_URL.length)}`
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  return `${MEDIA_URL}/${value.replace(/^\/+/, '')}`
}
