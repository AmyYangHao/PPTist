#!/bin/bash

# 定义路径变量
PROJECT_A="/d/yanghao/PPTist"
PROJECT_B="/d/ly/hi_school_pptist"
TARGET_FOLDERS=("src" "public" "doc") # 要处理的文件夹列表
# 检查源目录是否存在
if [ ! -d "$PROJECT_A" ]; then
  echo "错误：项目A目录不存在 - $PROJECT_A"
  exit 1
fi

# 检查目标目录是否存在
if [ ! -d "$PROJECT_B" ]; then
  echo "错误：项目B目录不存在 - $PROJECT_B"
  exit 1
fi

# 删除B中的目标文件夹
echo "正在清理项目B中的目标文件夹..."
for folder in "${TARGET_FOLDERS[@]}"; do
  if [ -d "$PROJECT_B/$folder" ]; then
    echo "删除 $PROJECT_B/$folder"
    rm -rf "$PROJECT_B/$folder"
  fi
done

# 从A拷贝目标文件夹到B
echo "开始从项目A拷贝到项目B..."
for folder in "${TARGET_FOLDERS[@]}"; do
  if [ -d "$PROJECT_A/$folder" ]; then
    echo "拷贝 $folder 文件夹"
    cp -r "$PROJECT_A/$folder" "$PROJECT_B/"
  else
    echo "警告：项目A中不存在 $folder 文件夹"
  fi
done

echo "操作完成！已处理文件夹: ${TARGET_FOLDERS[@]}"