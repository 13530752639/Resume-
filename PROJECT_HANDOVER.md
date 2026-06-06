# 张泽龙影视导演作品集网站 — 项目交接文档

> **生成时间**：2026-06-04  
> **项目负责人**：张泽龙  
> **技术栈**：React 18 + TypeScript + Vite 5 + Tailwind CSS 3 + Framer Motion 11 + Zustand 4  
> **部署平台**：Vercel（自动 CI/CD，绑定 GitHub 仓库）  
> **视频/存储**：Cloudflare R2（S3 兼容对象存储）  
> **域名**：`www.zhangzelong.top`（阿里云购买，A 记录指向 Vercel IP `216.198.79.1`）  
> **GitHub**：`https://github.com/13530752639/Resume-.git`

---

## 一、项目核心规则

### 1.1 导航架构（Zustand 状态管理）

所有页面路由由 `src/store/useAppStore.ts` 中的 `currentLevel` 状态控制：

```
home → about → video-works / photo-works / media-works / academic-works → work-detail
```

- 页面切换由 `App.tsx` 的 `AnimatePresence mode="wait"` + `motion.div` 驱动
- **全局过渡动画 0.7s 淡入淡出**（`pageVariants`）
- 各子模块内部动画统一为 **0.35s**
- 所有页面宽度：`min-h-screen overflow-x-hidden`

### 1.2 交互规范

| 规则 | 详情 |
|------|------|
| 回流逻辑 | 所有子页面必须支持返回上层，按钮统一样式：`rounded-full bg-black/60 backdrop-blur-sm border border-white/10` |
| 导航栏 | 右上角导航链接格式 `返回首页｜影像作品｜摄影作品｜自媒体作品｜学术作品`，"返回首页"为白色 |
| 滚动防抖 | 所有滚轮切换场景使用 `useScrollDebounce` hook，冷却 800ms，阈值 30px |
| 视频播放 | 默认静音自动播放，点击进入正式播放器（播放/暂停/进度条/倍速/音量），4 秒无操作自动隐藏控件 |
| 响应式 | 所有文字/布局使用 `text-sm md:text-base lg:text-lg` 等 tailwind 响应式类 |

### 1.3 图片/资源路径

- **公共资源**：位于 `public/` 目录，代码中引用时不带 `public/` 前缀
- **中文文件名**：**严格禁止使用含中文的文件名**（Vercel CDN 会导致编码异常 404），已创建 `street-cover.png` 替代 `封面_副本.png`
- **图片压缩**：所有街拍摄影图片已用 ffmpeg 压缩至 `max 2000px, q:v 3`，总大小从 988MB → 46MB

### 1.4 构建与部署

```bash
npm run dev       # 本地开发
npm run build     # 构建（Vite）
npm run preview   # 预览构建产物
```

- Vercel 自动检测 GitHub 推送并构建部署
- SPA 路由重写配置在 `vercel.json`
- 构建输出目录：`dist/`
- **禁止在 public/ 放置大文件或不相关目录**（曾因 `public/videos 2/` 8.7GB 目录导致构建失败）

---

## 二、已完成内容

### 2.1 页面架构（6 个一级页面）

| 页面 | 组件文件 | 功能状态 |
|------|----------|----------|
| 首页 | `HomeSection.tsx` | 背景图淡入 0.8s、作品集标题、"探索"按钮跳转 about |
| 自我介绍 | `AboutSection.tsx` | 白底、左侧纯文字四面板折叠（滚轮切换）、右侧肖像、个人简介/教育/联系方式 |
| 影像作品 | `WorksCategorySection.tsx` | AIGC/纪录片/专题片/宣传片 四分类、全屏播放器、滚轮切换、序号跳转 |
| 摄影作品 | `WorksCategorySection.tsx` | 街头摄影(→StreetPhotoModule)/人像摄影(→PortraitPhotoModule)/新闻摄影/专题摄影 |
| 自媒体作品 | `WorksCategorySection.tsx` | 视频全屏播放、滚轮切换、序号跳转 |
| 学术作品 | `AcademicSection.tsx` | 黑底暖光、3 篇论文（左图右文）、滚轮切换、序号跳转 |

### 2.2 街头摄影模块（StreetPhotoModule.tsx）— 四级钻取

```
Level 0: 三选项按钮（城市/村落/公园）横向排列 → 白底黑字圆角胶囊
Level 1: 背景图 70% 不透明度 + 居中英文标题 → 点击进入
Level 2: 左图(42%) + 右文(58%) 介绍页 → 点击任意位置进入画廊
Level 3: 暖黄色板块标题(13%) + Masonry 瀑布流图片(87%) + 白灰分隔线
```

**主题数据**（`src/data/streetPhotos.ts`）：
- 城市：山东(18张)、汕头(14张)、深圳(9张)
- 村落：梅径村(20张)、南澳(8张)、十一合艺术村(10张)、中秋节(11张)
- 公园：礐石公园(12张)、神仙里(5张)

**关键修复历史**：
- 画廊点击失效：`stopPropagation` 层级错误 → 改为仅导航栏区阻止冒泡
- 返回按钮卡顿：`AnimatePresence 0.6s` → 缩至 0.35s
- 返回按钮失效：闭包 `handleBack` → 改为显式定向函数 `backFromCover/Intro/Gallery`
- 背景图不显示：中文文件名 → 复制为 `street-cover.png`

### 2.3 人像摄影模块（PortraitPhotoModule.tsx）— 三级钻取

与 StreetPhotoModule 相同的三级架构，单一主题"少女"（油画少女 12张 / 自由少女 8张 / 刻板少女 6张）。

### 2.4 全屏播放器（FullscreenPlayer）

`WorksCategorySection.tsx` 内嵌组件，功能：
- **预览模式**：静音背景播放 + 居中标题/英文副标题/描述 + 「点击进入播放器」提示
- **播放器模式**：底部控制栏（播放/暂停、进度条拖拽、音量切换、倍速 0.75x-2x 循环）、4 秒自动隐藏
- **手动跳转**：底部圆形序号按钮 + `当前/总数` 计数
- **退出播放器**：右上角 ✕ 按钮

### 2.5 基础设施建设

- ✅ Cloudflare R2 bucket 创建并配置公开访问（`pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev`）
- ✅ 所有视频资源上传至 R2（S3 API 脚本 `scripts/r2-batch-upload.cjs`）
- ✅ DNS 解析：`www.zhangzelong.top` A 记录 → `216.198.79.1`（Vercel 中国大陆可达 IP）
- ✅ Vercel 自动 SSL 签发
- ✅ SEO meta 标签（index.html）
- ✅ 安全响应头（vercel.json）
- ✅ `.env.r2.example` R2 认证信息模板

---

## 三、遗留待办

### 3.1 高优先级

| # | 任务 | 说明 |
|---|------|------|
| 1 | **人像摄影 PortaitPhotoModule 返回按钮** | 当前 Level 1 封面页的"返回摄影集"调用 `onBack()` 会直接回到摄影分类目录，需确认是否符合预期 |
| 2 | **新闻摄影 / 专题摄影** | 当前仅占位，无图片数据源，需补充 `news` 和 `feature` 分类的图片内容和交互逻辑 |
| 3 | **街头摄影"建议用这张"中文文件名** | `public/images/street/城市/汕头/建议用这张，后面的店有点潮汕的意思.JPG` 中文文件名可能导致 Vercel 404，需重命名 |

### 3.2 中优先级

| # | 任务 | 说明 |
|---|------|------|
| 4 | **自媒体作品分类** | 当前 `isMediaPage` 直接进入全屏播放器（跳过分类选择），分类列表为空。需确认此设计是否符合预期，或是否需补充栏目 |
| 5 | **首页"探索"按钮跳转确认** | 当前跳转至 `about`（自我介绍）。如需跳转其他页面，修改 `HomeSection.tsx` 第 8 行 |
| 6 | **视频加载性能** | 视频引用 Cloudflare R2 URL，需关注首次加载速度和缓冲策略 |

### 3.3 低优先级

| # | 任务 | 说明 |
|---|------|------|
| 7 | **搜索功能** | AboutSection 有 Search 图标但未实现搜索逻辑 |
| 8 | **WorkDetailSection** | 当前路由存在但尚未实现具体内容 |
| 9 | **移动端滑动优化** | 当前滚轮事件在移动端无效，需考虑 touch 事件支持 |

---

## 四、废弃错误方案

| # | 方案 | 失败原因 | 替代方案 |
|---|------|----------|----------|
| 1 | CNAME 记录解析 Vercel | 阿里云配置的 CNAME 值不匹配 Vercel 项目专属值；`76.76.21.21` IP 在中国大陆不可达 | 改用 A 记录指向 `216.198.79.1` |
| 2 | `encodeURI()` 中文文件名 | 浏览器/Vercel 对双层编码处理不一致 | 直接重命名为纯英文文件名 |
| 3 | CSS Grid 固定 1:1 裁切图片 | 所有照片被强制正方形，竖/横构图信息丢失 | 改用 CSS `columns` masonry 瀑布流 + `h-auto object-contain` |
| 4 | 单层 `handleBack` 闭包导航 | AnimatePresence 渲染时序导致 level 值不同步 | 改用三个独立显式定向函数 |
| 5 | `<nav>` 包裹 + `stopPropagation` | 按钮嵌套过深，事件冒泡路径不可预测 | 返回按钮改为 absolute/fixed 定位，直接挂载在容器上 |
| 6 | `useRef` scrollDebounce 带 `enabled` 参数 | `enabled` 变化导致 `handler` 引用变化，事件监听器重复绑定 | 改为在调用处控制是否挂载 hook |
| 7 | `AnimatePresence mode="wait"` + 0.6s duration | 退出动画阻塞下一层渲染，造成严重卡顿感 | 所有内部动画统一缩至 0.35s |

---

## 五、项目文件结构（核心）

```
src/
├── App.tsx                    # 路由 + 全局过渡动画
├── main.jsx                   # 入口
├── store/
│   └── useAppStore.ts         # Zustand 状态管理
├── data/
│   ├── categories.json        # 视频/图片作品数据
│   ├── works.json             # 作品集元数据
│   ├── streetPhotos.ts        # 街头摄影 3 主题 × 多板块 图片路径
│   └── portraitPhotos.ts      # 人像摄影 1 主题 × 3 板块 图片路径
├── components/
│   ├── sections/
│   │   ├── HomeSection.tsx         # 首页
│   │   ├── AboutSection.tsx        # 自我介绍
│   │   ├── WorksCategorySection.tsx # 作品分类 + 全屏播放器
│   │   ├── WorkDetailSection.tsx   # 作品详情（占位）
│   │   ├── AcademicSection.tsx     # 学术作品
│   │   ├── StreetPhotoModule.tsx   # 街头摄影四级钻取
│   │   └── PortraitPhotoModule.tsx # 人像摄影三级钻取
│   └── ui/
│       └── VideoPlayer.tsx         # 旧版播放器（可能已不再使用）
public/
├── covers/web/Webp/          # 首页/页面背景（JPG/WebP）
├── covers/web/PNG/           # PNG 背景（含 street-cover.png）
├── images/street/            # 街头摄影 116 张（已压缩、已推送）
├── images/portrait/          # 人像摄影
├── academic/                 # 学术论文图片
├── videos/                   # 本地视频（已迁移至 R2）
└── r2-local-test/            # 本地 R2 测试目录（不提交 Git）
scripts/
├── r2-upload.cjs             # R2 单文件上传
└── r2-batch-upload.cjs       # R2 批量上传
```

---

## 六、任务交接文案

**背景**：本项目为用户（张泽龙）搭建的专业影视导演作品集网站，包含首页、自我介绍、影像作品、摄影作品、自媒体作品、学术作品六大板块。网站已成功上线 `www.zhangzelong.top`，通过 GitHub + Vercel 实现自动部署，视频资源托管于 Cloudflare R2。

**当前状态**：
- 6 个一级页面全部可用
- 街头摄影模块（StreetPhotoModule）四级钻取已完成并经过多轮修复稳定运行
- 人像摄影模块（PortraitPhotoModule）三级钻取已完成（与 StreetPhotoModule 同架构）
- 全屏播放器功能完整（预览+正式播放+控件的双模式）
- 滚动防抖 800ms + 手动序号跳转已全局应用

**关键注意事项**：
1. **中文文件名绝对禁止** — 已有一条遗留（"建议用这张"），需尽快重命名
2. **返回按钮架构** — 必须使用显式定向函数（`backFromXxx`）而非闭包判断
3. **所有过渡动画统一 0.35s** — 不经确认不随意延长
4. **GitHub Token** — 已配置SSH密钥认证，推送时需确保网络可达 GitHub
5. **图片路径** — `public/` 内资源代码引用不带 `public/` 前缀

**后续重点**：
- 完成新闻摄影、专题摄影两个栏目的内容填充
- 处理街头摄影中的中文文件名图片
- 确认自媒体作品页面的分类交互逻辑
- 移动端 touch 事件支持
