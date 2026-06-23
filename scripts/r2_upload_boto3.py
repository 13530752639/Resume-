#!/usr/bin/env python3
"""使用 boto3 将压缩后的 H.264 视频上传到 Cloudflare R2"""
import os
import sys
import time
from pathlib import Path

try:
    import boto3
    from botocore.config import Config
except ImportError:
    print("请先安装 boto3: pip3 install boto3")
    sys.exit(1)

# 配置
COMPRESSED_DIR = "/tmp/video_compress/compressed"
PROJECT_DIR = "/Users/fyq/Documents/trae/Project/08_Project_resume"

# 从 .env.r2 加载
def load_env():
    env = {}
    env_file = os.path.join(PROJECT_DIR, ".env.r2")
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                env[key] = val
    return env

env_vars = load_env()

# R2 S3 客户端
s3 = boto3.client(
    "s3",
    endpoint_url=f"https://{env_vars['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com",
    aws_access_key_id=env_vars["R2_ACCESS_KEY_ID"],
    aws_secret_access_key=env_vars["R2_SECRET_ACCESS_KEY"],
    region_name="auto",
    config=Config(
        retries={"max_attempts": 3},
        connect_timeout=30,
        read_timeout=300,
    ),
)

BUCKET = env_vars["R2_BUCKET"]

# 文件 → 分类映射
VIDEO_MAP = {
    "天宫DISCO.mp4": "aigc",
    "《何以为家》.mp4": "aigc",
    "古诗词夸父逐日.mp4": "aigc",
    "AI复活天文学家.mp4": "aigc",
    "2025中国航天日.mp4": "aigc",
    "纪录片 《半边天》.mp4": "documentary",
    "时光放映师_副本.mp4": "documentary",
    "周礼平烈士.mp4": "special",
    "潮州韩韵.mp4": "special",
    "哈佛大学中美峰会《未尽之风》导演.mp4": "commercial",
    "央视视频《逐梦》.mp4": "commercial",
    "《抖肩舞》.mp4": "media",
    "《汕大街拍》.mp4": "media",
    "《南澳旅行》.mp4": "media",
    "《独居在家》.mp4": "media",
    "《民大初雪》.mp4": "media",
    "《我用潮汕话做报道》.mp4": "media",
    "《五一诉苦歌》.mp4": "media",
    "《墙》.mp4": "media",
}

def fmt_size(n):
    for u in ["B", "KB", "MB", "GB"]:
        if n < 1024:
            return f"{n:.1f} {u}"
        n /= 1024
    return f"{n:.1f} TB"

def main():
    total = len(VIDEO_MAP)
    success = 0
    failed = []
    total_bytes = 0

    for i, (fname, category) in enumerate(VIDEO_MAP.items(), 1):
        local_path = os.path.join(COMPRESSED_DIR, fname)
        if not os.path.exists(local_path):
            # 模糊匹配
            found = None
            for f in os.listdir(COMPRESSED_DIR):
                simplified = lambda s: s.replace("《","").replace("》","").replace(" ","").replace("半","")
                if simplified(fname) in simplified(f) or simplified(f) in simplified(fname):
                    found = f
                    break
            if found:
                local_path = os.path.join(COMPRESSED_DIR, found)
            else:
                failed.append((fname, "文件不存在"))
                continue

        file_size = os.path.getsize(local_path)
        remote_key = f"{category}/{fname}"
        print(f"[{i}/{total}] {fname} ({fmt_size(file_size)}) → {remote_key}", flush=True)

        try:
            start = time.time()
            s3.upload_file(
                local_path, BUCKET, remote_key,
                ExtraArgs={"ContentType": "video/mp4"}
            )
            elapsed = time.time() - start
            speed = file_size / elapsed if elapsed > 0 else 0
            success += 1
            total_bytes += file_size
            print(f"  ✅ 完成 ({elapsed:.0f}s, {fmt_size(speed)}/s)", flush=True)
        except Exception as e:
            failed.append((fname, str(e)))
            print(f"  ❌ 失败: {e}", flush=True)

    print(f"\n{'='*50}")
    print(f"完成：{total} 个视频，成功 {success} 个，总上传 {fmt_size(total_bytes)}")
    if failed:
        print(f"失败 {len(failed)} 个：")
        for name, err in failed:
            print(f"  - {name}: {err}")

if __name__ == "__main__":
    main()
