# 快速部署指南 - 后端服务

本文档提供最快速、最简单的后端服务部署方案。

---

## 🚀 方案一：Vercel 部署（推荐新手）

**优点**：免费、全自动、无需服务器、自动 HTTPS
**时间**：5-10 分钟

### 前置条件

1. GitHub 账号
2. Supabase 账号（已有数据库）

### 步骤

#### 1. 推送代码到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
cd /workspace/projects
git init
git add .
git commit -m "Initial commit"

# 关联远程仓库
git remote add origin https://github.com/your-username/your-repo.git

# 推送代码
git push -u origin main
```

#### 2. 登录 Vercel

1. 访问 [vercel.com](https://vercel.com/)
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"

#### 3. 导入项目

1. 选择你的 GitHub 仓库
2. 点击 "Import"

#### 4. 配置项目

**Framework Preset**: 选择 "Other"

**Root Directory**: 输入 `server`

**Build Command**: 输入 `pnpm build`

**Output Directory**: 输入 `dist`

#### 5. 配置环境变量

在 "Environment Variables" 部分添加以下变量：

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | 你的 Supabase 数据库连接字符串 |
| `SUPABASE_URL` | 你的 Supabase 项目 URL |
| `SUPABASE_KEY` | 你的 Supabase anon key |

**如何获取这些值？**

1. 登录 [Supabase](https://supabase.com/)
2. 进入你的项目
3. 点击左侧 "Settings" → "API"
4. 复制以下信息：
   - **Project URL**: `SUPABASE_URL`
   - **anon public**: `SUPABASE_KEY`
   - **Connection string**: `DATABASE_URL`（选择 "URI" 标签页）

#### 6. 部署

点击 "Deploy" 按钮，等待 2-3 分钟。

#### 7. 获取 API 地址

部署完成后，Vercel 会给你一个域名，例如：
```
https://your-api.vercel.app
```

你的 API 接口地址就是这个域名，例如：
- 律师列表：`https://your-api.vercel.app/api/lawyers`

#### 8. 绑定自定义域名（可选）

1. 在 Vercel 项目页面点击 "Settings" → "Domains"
2. 添加你的域名（如 `api.example.com`）
3. 按照提示在域名解析中添加 CNAME 记录

---

## 🐳 方案二：Docker 部署（推荐有服务器）

**优点**：可自定义、可控性强、一次配置永久使用
**时间**：20-30 分钟

### 前置条件

1. 一台云服务器（阿里云、腾讯云等）
2. 服务器上已安装 Docker 和 Docker Compose
3. 一个域名（已解析到服务器 IP）

### 步骤

#### 1. 准备环境变量文件

在 `server` 目录下创建 `.env` 文件：

```bash
cd /workspace/projects/server
cp .env.example .env
nano .env
```

编辑 `.env` 文件，填入你的 Supabase 配置：

```bash
NODE_ENV=production
PORT=3000

DATABASE_URL=postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

#### 2. 打包并上传代码

```bash
# 在本地打包
cd /workspace/projects
tar -czf server.tar.gz server/

# 上传到服务器（替换 IP）
scp server.tar.gz root@your-server-ip:/root/
```

#### 3. 在服务器上部署

```bash
# SSH 连接服务器
ssh root@your-server-ip

# 解压
cd /root
tar -xzf server.tar.gz
cd server

# 安装 Docker（如果还没有）
curl -fsSL https://get.docker.com | sh
curl -fsSL https://get.docker.com | sh -s -- --version

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

#### 4. 配置 Nginx 反向代理

```bash
# 安装 Nginx
sudo apt update
sudo apt install -y nginx

# 创建配置文件
sudo nano /etc/nginx/sites-available/law-firm-api
```

粘贴以下内容（替换域名）：

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置并重启 Nginx：

```bash
sudo ln -s /etc/nginx/sites-available/law-firm-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. 配置 HTTPS

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d api.example.com

# 按照提示输入邮箱、同意条款

# 自动续期
sudo certbot renew --dry-run
```

---

## ✅ 部署后验证

### 测试 API 接口

```bash
# 测试律师列表
curl https://your-api-domain.com/api/lawyers

# 应该返回类似这样的 JSON：
# {"code":200,"msg":"查询成功","data":[...]}
```

### 配置小程序域名

参考 `PRODUCTION_CONFIG.md`，在微信小程序后台配置：
- **request 合法域名**: `https://your-api-domain.com`

### 更新小程序代码

在项目根目录创建 `.env.local` 文件：

```bash
PROJECT_DOMAIN=https://your-api-domain.com
```

重新构建小程序：

```bash
pnpm build:weapp
```

---

## 📊 部署方案对比

| 方案 | 难度 | 时间 | 费用 | 适用场景 |
|------|------|------|------|----------|
| Vercel | ⭐ | 5-10分钟 | 免费 | 快速测试、小项目 |
| Docker | ⭐⭐⭐ | 20-30分钟 | 服务器费用 | 生产环境、自定义配置 |

---

## 🆘 遇到问题？

### Vercel 部署失败

1. 检查环境变量是否正确
2. 查看部署日志中的错误信息
3. 确保构建命令是 `pnpm build`

### Docker 部署失败

1. 检查 `.env` 文件是否存在且配置正确
2. 查看容器日志：`docker-compose logs -f`
3. 确保端口 3000 未被占用

### API 返回 500 错误

1. 检查数据库连接字符串是否正确
2. 查看服务日志中的详细错误信息
3. 确认 Supabase 数据库正常运行

---

## 🎉 完成！

部署完成后，你的后端服务就可以从公网访问了！

下一步：
1. 配置微信小程序的 request 合法域名
2. 更新小程序代码中的后端地址
3. 重新上传小程序并测试
