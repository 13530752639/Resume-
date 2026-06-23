#!/bin/bash
# 批量视频压缩脚本
# H.265 CRF 23, 1920p, AAC 128k

R2_BASE="https://pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev"
TEMP_DIR="/tmp/video_compress"
COMPRESSED_DIR="$TEMP_DIR/compressed"
LOG_FILE="$TEMP_DIR/compress.log"

mkdir -p "$COMPRESSED_DIR"

VIDEOS=(
  "aigc/天宫DISCO.mp4"
  "aigc/《何以为家》.mp4"
  "aigc/古诗词夸父逐日.mp4"
  "aigc/AI复活天文学家.mp4"
  "aigc/2025中国航天日.mp4"
  "documentary/纪录片 《半边天》.mp4"
  "documentary/时光放映师_副本.mp4"
  "special/周礼平烈士.mp4"
  "special/潮州韩韵.mp4"
  "commercial/哈佛大学中美峰会《未尽之风》导演.mp4"
  "commercial/央视视频《逐梦》.mp4"
  "media/《抖肩舞》.mp4"
  "media/《汕大街拍》.mp4"
  "media/《南澳旅行》.mp4"
  "media/《独居在家》.mp4"
  "media/《民大初雪》.mp4"
  "media/《我用潮汕话做报道》.mp4"
  "media/《五一诉苦歌》.mp4"
  "media/《墙》.mp4"
)

TOTAL=${#VIDEOS[@]}
CURRENT=0
SKIP=0
COMPRESSED=0

# 计算已完成数量
for f in "$COMPRESSED_DIR"/*.mp4; do
  [ -f "$f" ] && SKIP=$((SKIP+1))
done

echo "==========================================" | tee "$LOG_FILE"
echo "  视频批量压缩 (H.264 CRF 23 1920p)" | tee -a "$LOG_FILE"
echo "  共 $TOTAL 个视频" | tee -a "$LOG_FILE"
echo "==========================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

for VIDEO in "${VIDEOS[@]}"; do
  CURRENT=$((CURRENT + 1))
  FILENAME=$(basename "$VIDEO")
  DOWNLOAD_PATH="$TEMP_DIR/$FILENAME"
  COMPRESSED_PATH="$COMPRESSED_DIR/$FILENAME"
  
  # 跳过已压缩的
  if [ -f "$COMPRESSED_PATH" ]; then
    echo "[$CURRENT/$TOTAL] $FILENAME — 已存在，跳过" | tee -a "$LOG_FILE"
    continue
  fi
  
  # URL编码
  ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$VIDEO'))")
  DOWNLOAD_URL="$R2_BASE/$ENCODED"
  
  echo "[$CURRENT/$TOTAL] $FILENAME" | tee -a "$LOG_FILE"
  
  # 下载
  echo "  下载中..." | tee -a "$LOG_FILE"
  curl -fSL --connect-timeout 60 --max-time 600 -o "$DOWNLOAD_PATH" "$DOWNLOAD_URL" 2>>"$LOG_FILE"
  
  if [ ! -f "$DOWNLOAD_PATH" ] || [ ! -s "$DOWNLOAD_PATH" ]; then
    echo "  ❌ 下载失败" | tee -a "$LOG_FILE"
    continue
  fi
  
  ORIG_SIZE=$(du -h "$DOWNLOAD_PATH" | cut -f1)
  echo "  原始: $ORIG_SIZE" | tee -a "$LOG_FILE"
  
  # 压缩
  echo "  压缩中..." | tee -a "$LOG_FILE"
  
  ffmpeg -i "$DOWNLOAD_PATH" \
    -c:v libx264 -crf 23 -preset fast \
    -vf "scale=1920:-2" \
    -c:a aac -b:a 128k -movflags +faststart \
    -y "$COMPRESSED_PATH" 2>>"$LOG_FILE"
  
  NEW_SIZE=$(du -h "$COMPRESSED_PATH" | cut -f1)
  COMPRESSED=$((COMPRESSED+1))
  echo "  ✅ 压缩后: $NEW_SIZE" | tee -a "$LOG_FILE"
  echo "" | tee -a "$LOG_FILE"
  
  # 删除原始下载文件
  rm -f "$DOWNLOAD_PATH"
done

echo "==========================================" | tee -a "$LOG_FILE"
echo "  完成！共压缩 $COMPRESSED 个视频" | tee -a "$LOG_FILE"
echo "  输出目录: $COMPRESSED_DIR" | tee -a "$LOG_FILE"
echo "==========================================" | tee -a "$LOG_FILE"
echo ""
echo "--- 压缩结果 ---" | tee -a "$LOG_FILE"
for f in "$COMPRESSED_DIR"/*.mp4; do
  ls -lh "$f" | awk '{printf "%-50s %s\n", $NF, $5}' | tee -a "$LOG_FILE"
done
