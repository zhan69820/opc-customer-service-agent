#!/bin/bash

# OPC 客服 Agent 一键部署脚本

set -e

echo "====================================="
echo "  OPC 客服 Agent 一键部署"
echo "====================================="

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

echo "✅ Docker 已安装"

# 检查端口
if lsof -i :3000 &> /dev/null; then
    echo "⚠️  端口 3000 已被占用"
    read -p "是否继续？(y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 创建目录
mkdir -p /opt/opc-customer-service
cd /opt/opc-customer-service

echo "📁 创建项目目录..."

# 下载部署文件（从 GitHub）
echo "📥 下载部署文件..."
curl -sL https://raw.githubusercontent.com/zhan69820/opc-customer-service-agent/main/docker-compose.yml -o docker-compose.yml

# 检查下载是否成功
if [ ! -s docker-compose.yml ]; then
    echo "❌ 下载失败，请检查网络连接"
    exit 1
fi

# 复制环境变量文件
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 请编辑 .env 文件配置 API Key（可选）"
    echo "   nano .env"
fi

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
sleep 5

# 检查状态
if docker ps | grep -q opc-customer-service-app-1; then
    echo ""
    echo "====================================="
    echo "  ✅ 部署成功！"
    echo "====================================="
    echo ""
    echo "访问地址："
    echo "  - 客服聊天: http://你的服务器IP:3000/chat"
    echo "  - 管理后台: http://你的服务器IP:3000/admin"
    echo ""
    echo "管理命令："
    echo "  查看日志: docker-compose logs -f"
    echo "  停止服务: docker-compose down"
    echo "  重启服务: docker-compose restart"
else
    echo "❌ 部署失败，请检查日志"
    docker-compose logs
fi
