#!/bin/bash

# cd 到脚本所在的目录
cd "$(dirname "$0")"

echo "开始编译和打包插件, 当前目录: $(pwd)"

# 删除旧的编译产物
rm -rf ./dist

# 编译TypeScript代码
npm run build

PLUGIN_DIR="/data/zqf/T20250206_obsidian_head_mark/.obsidian/plugins/myplugin/"

# 清除目标插件目录中的旧文件
rm -rf "$PLUGIN_DIR"/*

mkdir -p "$PLUGIN_DIR"
cp -r dist/* "$PLUGIN_DIR"
cp manifest.json "$PLUGIN_DIR"

echo "编译和打包完成"
