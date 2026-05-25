# 📁 作品文件目录结构说明

## 📂 完整目录树

```
public/
│
├── videos/                          # 视频文件存储目录
│   ├── aigc/                        # AIGC影像
│   ├── documentary/                 # 纪录片
│   ├── special/                     # 专题片
│   ├── commercial/                  # 宣传片
│   └── media/                       # 自媒体作品
│
├── images/                          # 图片文件存储目录
│   ├── news/                        # 新闻摄影
│   ├── feature/                     # 专题摄影
│   ├── art/                         # 艺术摄影
│   ├── portrait/                    # 人像摄影
│   ├── street/                      # 街拍作品
│   └── media/                       # 自媒体作品
│
└── covers/                          # 封面图存储目录
    ├── video-works/                 # 视频作品封面
    │   ├── aigc/                    # AIGC影像封面
    │   ├── documentary/             # 纪录片封面
    │   ├── special/                 # 专题片封面
    │   ├── commercial/              # 宣传片封面
    │   └── media/                   # 自媒体作品封面
    │
    └── photo-works/                 # 摄影作品封面
        ├── news/                    # 新闻摄影封面
        ├── feature/                 # 专题摄影封面
        ├── art/                     # 艺术摄影封面
        ├── portrait/                # 人像摄影封面
        ├── street/                  # 街拍作品封面
        └── media/                   # 自媒体作品封面
```

## 📋 分类对应关系

### 🎬 影像作品 (video-works)

| 分类ID | 中文名称 | 英文名称 | 文件夹路径 |
|--------|----------|----------|------------|
| aigc | AIGC影像 | AIGC Video | videos/aigc/ |
| documentary | 纪录片 | Documentary | videos/documentary/ |
| special | 专题片 | Special Film | videos/special/ |
| commercial | 宣传片 | Commercial | videos/commercial/ |

### 📸 摄影作品 (photo-works)

| 分类ID | 中文名称 | 英文名称 | 文件夹路径 |
|--------|----------|----------|------------|
| news | 新闻摄影 | News Photography | images/news/ |
| feature | 专题摄影 | Feature Photography | images/feature/ |
| art | 艺术摄影 | Art Photography | images/art/ |
| portrait | 人像摄影 | Portrait Photography | images/portrait/ |
| street | 街拍作品 | Street Photography | images/street/ |

### 📱 自媒体作品 (media-works)

| 分类ID | 中文名称 | 英文名称 | 文件夹路径 |
|--------|----------|----------|------------|
| media | 自媒体作品 | Media Works | videos/media/ 或 images/media/ |

## 📝 文件命名规范

### 视频文件
- **格式**: MP4 (H.264编码)
- **命名**: `作品ID-作品名称.mp4`
- **示例**: `doc-001-city-memories.mp4`

### 图片文件
- **格式**: JPG 或 PNG
- **命名**: `作品ID-作品名称.jpg`
- **示例**: `portrait-001-artist-portrait.jpg`

### 封面图
- **格式**: JPG 或 PNG
- **比例**: 16:9 (推荐 1920x1080)
- **命名**: `作品ID-作品名称-cover.jpg`
- **示例**: `doc-001-city-memories-cover.jpg`

## 🔄 上传流程

### 1️⃣ 上传视频作品
```bash
# 1. 放置视频文件
public/videos/documentary/doc-001-city-memories.mp4

# 2. 放置封面图
public/covers/video-works/documentary/doc-001-city-memories-cover.jpg

# 3. 更新数据文件
编辑 src/data/categories.json
```

### 2️⃣ 上传摄影作品
```bash
# 1. 放置图片文件
public/images/portrait/portrait-001-artist-portrait.jpg

# 2. 放置封面图(可选,如无单独封面则使用原图)
public/covers/photo-works/portrait/portrait-001-artist-portrait-cover.jpg

# 3. 更新数据文件
编辑 src/data/categories.json
```

## ⚠️ 重要提示

1. **文件大小限制**
   - 视频文件: 建议 < 500MB
   - 图片文件: 建议 < 10MB
   - 封面图: 建议 < 500KB

2. **路径引用格式**
   - 视频: `/videos/documentary/doc-001-city-memories.mp4`
   - 图片: `/images/portrait/portrait-001-artist-portrait.jpg`
   - 封面: `/covers/video-works/documentary/doc-001-city-memories-cover.jpg`

3. **ID唯一性**
   - 每个作品的ID必须唯一
   - 建议格式: `分类缩写-编号`
   - 示例: `doc-001`, `portrait-003`, `aigc-005`

4. **文件格式要求**
   - 视频: MP4格式,兼容性最好
   - 图片: JPG格式,加载速度快
   - 封面图: 16:9比例,确保显示效果

## 📞 技术支持

如有疑问,请检查:
1. 文件路径是否正确
2. 文件格式是否符合要求
3. categories.json中的数据是否正确
4. 浏览器控制台是否有错误信息
