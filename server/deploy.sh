#!/bin/bash

# 后端服务快速部署脚本
# 用于本地测试部署流程

set -e

echo "========================================="
echo "  后端服务快速部署脚本"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Node.js
echo -e "${YELLOW}[1/6] 检查 Node.js 环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未安装 Node.js，请先安装 Node.js 18.x${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js 版本: $NODE_VERSION${NC}"

# 检查 pnpm
echo -e "${YELLOW}[2/6] 检查 pnpm...${NC}"
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  未安装 pnpm，正在安装...${NC}"
    npm install -g pnpm
fi
PNPM_VERSION=$(pnpm -v)
echo -e "${GREEN}✅ pnpm 版本: $PNPM_VERSION${NC}"

# 检查环境变量文件
echo -e "${YELLOW}[3/6] 检查环境变量配置...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}⚠️  未找到 .env 文件，从 .env.example 创建...${NC}"
        cp .env.example .env
        echo -e "${RED}❌ 请先编辑 .env 文件，填入正确的 Supabase 配置！${NC}"
        echo -e "${YELLOW}编辑命令: nano .env${NC}"
        exit 1
    else
        echo -e "${RED}❌ 未找到 .env 和 .env.example 文件${NC}"
        exit 1
    fi
fi

# 读取环境变量
source .env
if [ -z "$DATABASE_URL" ] || [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo -e "${RED}❌ .env 文件中缺少必要的环境变量！${NC}"
    echo -e "${YELLOW}请检查以下变量是否配置:${NC}"
    echo "  - DATABASE_URL"
    echo "  - SUPABASE_URL"
    echo "  - SUPABASE_KEY"
    exit 1
fi
echo -e "${GREEN}✅ 环境变量检查通过${NC}"

# 安装依赖
echo -e "${YELLOW}[4/6] 安装依赖...${NC}"
pnpm install --frozen-lockfile
echo -e "${GREEN}✅ 依赖安装完成${NC}"

# 构建项目
echo -e "${YELLOW}[5/6] 构建项目...${NC}"
pnpm build
echo -e "${GREEN}✅ 项目构建完成${NC}"

# 启动服务
echo -e "${YELLOW}[6/6] 启动服务...${NC}"
echo ""
echo "========================================="
echo "  🚀 服务启动中..."
echo "========================================="
echo ""

# 使用 PM2 启动（如果已安装），否则使用 node
if command -v pm2 &> /dev/null; then
    pm2 start dist/main.js --name law-firm-api
    echo -e "${GREEN}✅ 服务已通过 PM2 启动${NC}"
    echo -e "${YELLOW}查看日志: pm2 logs law-firm-api${NC}"
    echo -e "${YELLOW}查看状态: pm2 status${NC}"
else
    echo -e "${YELLOW}⚠️  未安装 PM2，使用 node 启动...${NC}"
    node dist/main.js
fi

echo ""
echo "========================================="
echo -e "${GREEN}  🎉 部署完成！${NC}"
echo "========================================="
echo ""
echo "API 地址: http://localhost:3000"
echo "律师列表: http://localhost:3000/api/lawyers"
echo ""
echo -e "${YELLOW}提示: 按 Ctrl+C 停止服务（如果是 node 方式启动）${NC}"
echo ""
