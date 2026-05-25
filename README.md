# 🎬 张泽龙 - 影视导演个人作品集网站

## 项目概述

这是一个为影视导演张泽龙打造的专业级个人作品集展示平台，采用现代化的电影工业风设计，深色主题配合科技蓝/电影橙双强调色，完美呈现导演的AIGC创作作品与实拍影像作品。

## ✨ 核心特性

### 🎨 设计亮点
- **电影工业风格**：深邃黑色主色调 + 胶片颗粒纹理
- **双主题色系统**：科技蓝（AIGC区域）+ 电影橙（实拍影像区域）
- **专业字体搭配**：Playfair Display（标题）+ Inter（正文）
- **玻璃拟态效果**：半透明卡片 + 模糊背景
- **丰富动效**：Framer Motion 驱动的流畅动画

### 🎬 功能模块
1. **响应式导航栏**
   - 固定顶部，滚动时自动切换样式
   - 移动端汉堡菜单 + 侧边抽屉
   - 平滑锚点滚动 + 自动高亮当前区域

2. **简介展示区（Hero Section）**
   - 全屏高度英雄区，大标题设计
   - 个人信息、教育背景、专业技能标签
   - 联系方式卡片（电话/微信）
   - 职业形象照片展示区

3. **AIGC作品展示区**
   - 响应式网格布局（桌面3列/平板2列/移动1列）
   - 视频缩略图预览 + 悬停播放按钮动画
   - 作品详情弹窗（含视频播放器）
   - 技术参数展示（AI工具、分辨率等）

4. **实拍影像作品展示区**
   - **差异化胶片风格设计**：两侧打孔装饰
   - 旋转胶片卷轴动画效果
   - 拍摄设备信息标签
   - 电影画幅比例装饰元素

5. **自定义视频播放器**
   - 完整控制功能：播放/暂停、进度条、音量调节
   - 全屏支持、播放速度调节（0.5x-2x）
   - 3秒无操作自动隐藏控制栏
   - 加载状态指示器
   - 可自定义主题色（蓝/橙）

6. **页脚区域**
   - 品牌信息、快速导航、联系方式
   - 版权声明

## 🚀 快速开始

### 环境要求
- Node.js >= 16.x
- npm 或 pnpm

### 安装步骤

```bash
# 1. 克隆或下载本项目
cd 08_Project_resume

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器访问 http://localhost:5173
```

### 生产构建

```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

构建后的文件将生成在 `dist/` 目录，可直接部署至任何静态托管服务。

## 📁 项目结构

```
08_Project_resume/
├── public/
│   ├── videos/                    # 视频文件目录
│   │   ├── aigc/                  # AIGC作品视频
│   │   └── real-shot/             # 实拍影像视频
│   └── images/                    # 图片资源
│       ├── avatar.jpg             # 导演职业照（可选）
│       └── thumbnails/            # 作品缩略图
│           ├── aigc/
│           └── real-shot/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx         # 导航栏组件
│   │   ├── sections/
│   │   │   ├── IntroSection.tsx   # 简介区域
│   │   │   ├── AIGCSection.tsx    # AIGC作品区域
│   │   │   └── RealShotSection.tsx# 实拍影像区域
│   │   └── ui/
│   │       └── VideoPlayer.tsx    # 自定义视频播放器
│   ├── data/
│   │   └── works.json             # 作品数据配置文件 ⭐
│   ├── hooks/
│   │   └── useScrollSpy.ts        # 滚动监听Hook
│   ├── store/
│   │   └── useAppStore.ts         # 全局状态管理
│   ├── App.tsx                    # 主应用组件
│   ├── main.jsx                   # 应用入口
│   └── index.css                  # 全局样式
├── index.html                     # HTML模板
├── package.json                   # 项目依赖
├── tailwind.config.js             # Tailwind配置
└── vite.config.ts                 # Vite构建配置
```

## 📝 内容管理指南

### 如何添加新作品

#### 方法一：编辑数据文件（推荐）

打开 `src/data/works.json`，按照以下格式添加新作品：

**AIGC作品示例：**
```json
{
  "id": "aigc-004",
  "title": "你的作品标题",
  "category": "aigc",
  "description": "详细描述（用于详情弹窗）",
  "briefDescription": "简短描述（显示在卡片上，建议50字以内）",
  "videoUrl": "/videos/aigc/your-video.mp4",
  "thumbnailUrl": "/images/thumbnails/aigc/your-thumbnail.jpg",
  "duration": "05:30",
  "createdAt": "2026-01-20",
  "tags": ["标签1", "标签2"],
  "technicalInfo": {
    "resolution": "4K",
    "aiTools": ["Runway", "Midjourney"],
    "postSoftware": "Premiere Pro"
  }
}
```

**实拍作品示例：**
```json
{
  "id": "real-004",
  "title": "你的作品标题",
  "category": "real-shot",
  "description": "详细描述",
  "briefDescription": "简短描述",
  "videoUrl": "/videos/real-shot/your-video.mp4",
  "thumbnailUrl": "/images/thumbnails/real-shot/your-thumbnail.jpg",
  "duration": "10:15",
  "createdAt": "2026-02-01",
  "tags": ["纪录片", "人文"],
  "technicalInfo": {
    "resolution": "4K",
    "cameraEquipment": "Sony FX3",
    "postSoftware": "DaVinci Resolve"
  }
}
```

#### 方法二：准备媒体文件

1. **添加视频文件**
   - AIGC作品：放入 `public/videos/aigc/` 目录
   - 实拍作品：放入 `public/videos/real-shot/` 目录
   - 支持格式：MP4（推荐）、WebM
   
2. **制作缩略图**
   - 尺寸建议：1920x1080px（16:9）
   - 放入 `public/images/thumbnails/对应分类/`
   
3. **更新个人信息**（如需修改）
   - 编辑 `works.json` 中的 `profile` 字段
   - 可修改姓名、教育背景、联系方式等

### 更新流程总结

1. 准备视频和图片素材 → 放入对应目录
2. 编辑 `src/data/works.json` → 添加/修改作品数据
3. 运行 `npm run dev` → 本地预览效果
4. 确认无误后 `npm run build` → 生成生产文件
5. 部署 `dist/` 目录到服务器

## 🎯 设计规范

### 配色方案

| 用途 | 颜色 | 色值 |
|------|------|------|
| 主背景 | 深邃黑 | `#0a0a0a` |
| 卡片背景 | 炭黑 | `#141414` |
| 主文字 | 暖白 | `#f5f5f5` |
| 次文字 | 中性灰 | `#a0a0a0` |
| AIGC主题色 | 科技蓝 | `#00d4ff` |
| 实拍主题色 | 电影橙 | `#ff6b35` |
| 强调色 | 金色 | `#ffd700` |

### 响应式断点

- **桌面端**: ≥1200px (3列网格)
- **平板端**: 768px-1199px (2列网格)
- **移动端**: <768px (单列堆叠)

### 动效参数

- 导航栏过渡：300ms ease-out
- 卡片悬停：250ms ease, 上浮8px
- Section入场：600ms ease-out, 从下方20px
- 播放按钮脉冲：1.5s循环

## 🔧 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式方案**: Tailwind CSS 3
- **动画库**: Framer Motion 11
- **图标库**: Lucide React
- **状态管理**: Zustand 4
- **视频播放**: HTML5 Video API (自定义封装)

## 🌐 部署推荐

### 免费托管平台

1. **Vercel** (推荐)
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Netlify**
   ```bash
   npm i -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **GitHub Pages**
   - 将 `dist/` 目录推送到 `gh-pages` 分支
   - 在仓库设置中启用 GitHub Pages

### 国内托管（推荐视频资源）

- 阿里云 OSS / 腾讯云 COS（CDN加速）
- 又拍云 / 七牛云

## 💡 使用提示

1. **视频优化建议**:
   - 分辨率：1080p 或 4K
   - 编码：H.264 (MP4) 或 VP9 (WebM)
   - 码率：8-15 Mbps (1080p) / 25-50 Mbps (4K)
   
2. **图片优化建议**:
   - 格式：WebP（优先）/ JPG
   - 缩略图尺寸：≤200KB
   - 使用工具：TinyPNG / Squoosh

3. **SEO优化**:
   - 已配置语义化HTML标签
   - 图片已添加 alt 属性
   - 可根据需要添加 meta 标签

4. **性能监控**:
   - 推荐使用 Lighthouse 进行性能测试
   - 目标指标：LCP < 2.5s, FID < 100ms, CLS < 0.1

## 📄 许可证

本项目仅供个人使用，保留所有权利。

---

**作者**: 张泽龙  
**最后更新**: 2026年5月  
**版本**: 1.0.0

🎬 **用影像讲述故事，以创意连接未来！**
