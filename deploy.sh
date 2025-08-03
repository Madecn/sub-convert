#!/bin/bash

# sub-convert Docker部署脚本
# 适用于群晖NAS

echo "🚀 开始部署sub-convert..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

# 检查docker-compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose未安装，请先安装docker-compose"
    exit 1
fi

# 停止现有容器
echo "📦 停止现有容器..."
docker-compose down

# 构建新镜像
echo "🔨 构建Docker镜像..."
docker-compose build --no-cache

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查服务状态
echo "📊 检查服务状态..."
docker-compose ps

# 健康检查
echo "🏥 执行健康检查..."
if curl -f http://localhost:8787/health > /dev/null 2>&1; then
    echo "✅ 服务启动成功！"
    echo "🌐 访问地址: http://localhost:8787"
    echo "📋 API文档: http://localhost:8787"
    echo "🏥 健康检查: http://localhost:8787/health"
else
    echo "❌ 服务启动失败，请检查日志:"
    docker-compose logs --tail=20
fi

echo "📝 查看实时日志: docker-compose logs -f"
echo "🛑 停止服务: docker-compose down" 