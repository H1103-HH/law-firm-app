# 后端服务部署指南

本指南将帮助你将 NestJS 后端服务部署到生产环境。

## 前置条件

- 一个云服务器（阿里云、腾讯云、华为云等）或 Vercel 账号
- 一个域名（需要 ICP 备案）
- Supabase 数据库账号
- Node.js 环境（如果是云服务器部署）

---

## 方案一：Vercel 部署（推荐 - 最简单）

Vercel 是一个现代化的部署平台，支持 NestJS 应用，免费额度足够使用。

### 步骤 1：准备 Vercel 配置文件

在 `server` 目录下创建 `vercel.json` 文件：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/dist/main.js"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_KEY": "@supabase_key"
  }
}
```

### 步骤 2：创建 package.json 脚本

修改 `server/package.json`，确保包含构建脚本：

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "vercel-build": "pnpm build"
  }
}
```

### 步骤 3：在 Vercel 控制台配置环境变量

1. 登录 [Vercel](https://vercel.com/)
2. 点击 "Add New Project"
3. 导入你的 GitHub 仓库或上传代码
4. 在 Environment Variables 中添加：

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
NODE_ENV=production
```

### 步骤 4：部署

1. 点击 "Deploy" 按钮
2. 等待部署完成（约 2-3 分钟）
3. Vercel 会自动分配一个域名，如 `https://your-api.vercel.app`

### 步骤 5：绑定自定义域名（可选）

1. 在 Vercel 项目设置中，点击 "Domains"
2. 添加你的域名（如 `api.example.com`）
3. 按照提示在域名解析中添加 CNAME 记录

---

## 方案二：云服务器部署（如阿里云、腾讯云）

适合需要更多控制权和自定义配置的场景。

### 步骤 1：购买云服务器

推荐配置：
- CPU：2 核
- 内存：2GB 或 4GB
- 系统：Ubuntu 20.04 / 22.04 LTS
- 带宽：1Mbps 或更高

### 步骤 2：安装 Node.js 和 PM2

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2（进程管理器）
sudo npm install -g pm2

# 验证安装
node -v
npm -v
pm2 -v
```

### 步骤 3：上传代码到服务器

```bash
# 在本地打包代码
cd /workspace/projects
tar -czf server.tar.gz server/

# 上传到服务器（替换你的服务器 IP）
scp server.tar.gz root@your-server-ip:/root/

# 在服务器上解压
ssh root@your-server-ip
cd /root
tar -xzf server.tar.gz
cd server
```

### 步骤 4：安装依赖并构建

```bash
# 安装 pnpm
npm install -g pnpm

# 安装依赖
pnpm install

# 构建项目
pnpm build
```

### 步骤 5：创建环境变量文件

在服务器上创建 `.env` 文件：

```bash
nano .env
```

添加以下内容：

```bash
NODE_ENV=production

# Supabase 配置
DATABASE_URL=postgresql://user:password@host:5432/dbname
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# 端口配置（默认 3000）
PORT=3000
```

### 步骤 6：使用 PM2 启动服务

```bash
# 启动服务
pm2 start dist/main.js --name law-firm-api

# 查看状态
pm2 status

# 查看日志
pm2 logs law-firm-api

# 设置开机自启
pm2 startup
pm2 save
```

### 步骤 7：配置 Nginx 反向代理

```bash
# 安装 Nginx
sudo apt install -y nginx

# 创建配置文件
sudo nano /etc/nginx/sites-available/law-firm-api
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name api.example.com;  # 替换为你的域名

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

启用配置并重启 Nginx：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/law-firm-api /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 步骤 8：配置 SSL 证书（HTTPS）

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d api.example.com

# 自动续期
sudo certbot renew --dry-run
```

### 步骤 9：配置防火墙

```bash
# 允许 HTTP 和 HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# 只开放必要的端口（3000 不对外开放，通过 Nginx 代理）
```

---

## 方案三：Docker 部署

适合需要容器化部署的场景。

### 步骤 1：创建 Dockerfile

在 `server` 目录下创建 `Dockerfile`：

```dockerfile
# 使用 Node.js 18 作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建项目
RUN pnpm build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["pnpm", "start:prod"]
```

### 步骤 2：创建 .dockerignore

在 `server` 目录下创建 `.dockerignore`：

```
node_modules
dist
.env
.git
*.md
```

### 步骤 3：构建并运行 Docker 容器

```bash
# 构建镜像
docker build -t law-firm-api:latest .

# 运行容器
docker run -d \
  --name law-firm-api \
  -p 3000:3000 \
  --restart always \
  -e DATABASE_URL="postgresql://..." \
  -e SUPABASE_URL="https://..." \
  -e SUPABASE_KEY="..." \
  law-firm-api:latest

# 查看日志
docker logs -f law-firm-api
```

### 步骤 4：使用 Docker Compose（推荐）

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  api:
    build: .
    container_name: law-firm-api
    ports:
      - "3000:3000"
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      SUPABASE_URL: ${SUPABASE_URL}
      SUPABASE_KEY: ${SUPABASE_KEY}
    env_file:
      - .env
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

运行：

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

## 环境变量说明

所有部署方案都需要配置以下环境变量：

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `DATABASE_URL` | PostgreSQL 数据库连接字符串 | Supabase 项目设置 |
| `SUPABASE_URL` | Supabase 项目 URL | Supabase 项目设置 |
| `SUPABASE_KEY` | Supabase anon/public key | Supabase 项目设置 |
| `NODE_ENV` | 运行环境 | 设置为 `production` |
| `PORT` | 服务端口 | 默认 `3000` |

### 如何获取 Supabase 配置

1. 登录 [Supabase](https://supabase.com/)
2. 进入你的项目
3. 点击 "Settings" -> "API"
4. 复制以下信息：
   - Project URL（`SUPABASE_URL`）
   - anon/public key（`SUPABASE_KEY`）
   - Connection string（`DATABASE_URL`）

---

## 部署后验证

### 1. 检查服务状态

```bash
# Vercel：访问 Vercel 控制台查看部署日志
# 云服务器：pm2 status
# Docker：docker ps
```

### 2. 测试 API 接口

```bash
# 测试律师列表接口
curl https://your-api-domain.com/api/lawyers

# 测试单个律师详情
curl https://your-api-domain.com/api/lawyers/1
```

### 3. 配置小程序域名

参考 `PRODUCTION_CONFIG.md` 文件，在微信小程序后台配置 request 合法域名。

---

## 更新部署

### Vercel 自动部署

- 推送代码到 GitHub，Vercel 会自动部署新版本

### 云服务器更新

```bash
# SSH 连接到服务器
ssh root@your-server-ip

# 拉取最新代码
cd /root/server
git pull

# 安装新依赖（如果有的话）
pnpm install

# 重新构建
pnpm build

# 重启服务
pm2 restart law-firm-api
```

### Docker 更新

```bash
# 拉取最新代码
git pull

# 重新构建镜像
docker build -t law-firm-api:latest .

# 停止旧容器并启动新容器
docker-compose down
docker-compose up -d
```

---

## 监控和日志

### PM2 监控

```bash
# 实时监控
pm2 monit

# 查看日志
pm2 logs law-firm-api

# 查看错误日志
pm2 logs law-firm-api --err
```

### Docker 日志

```bash
# 查看容器日志
docker logs -f law-firm-api

# 查看最近 100 行日志
docker logs --tail 100 law-firm-api
```

---

## 常见问题

### 问题 1：端口被占用

```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 PID
```

### 问题 2：数据库连接失败

- 检查 `DATABASE_URL` 是否正确
- 检查 Supabase 项目是否正常运行
- 检查防火墙是否允许数据库端口

### 问题 3：Nginx 502 Bad Gateway

- 检查后端服务是否正常运行
- 检查 Nginx 配置中的代理地址是否正确
- 查看 Nginx 错误日志：`sudo tail -f /var/log/nginx/error.log`

---

## 推荐部署方案

根据你的需求，我推荐以下方案：

1. **快速测试**：使用 Vercel（免费、简单、快速）
2. **生产环境**：使用云服务器 + Nginx + PM2（稳定、可控）
3. **容器化**：使用 Docker + 云服务器（便于扩展和管理）

---

## 需要帮助？

如果在部署过程中遇到问题，请检查：
1. 环境变量是否正确配置
2. 数据库连接是否正常
3. 防火墙规则是否正确
4. SSL 证书是否有效

部署完成后，请记得：
1. 在微信小程序后台配置 request 合法域名
2. 更新小程序代码中的 `PROJECT_DOMAIN` 环境变量
3. 重新构建并上传小程序
