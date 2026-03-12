# 🚀 Render 部署指南

本指南将指导你在 Render 平台上部署律师名片小程序的后端服务。

## 📋 前置要求

- ✅ GitHub 账号
- ✅ Render 账号（如果没有，需要注册）

---

## 🎯 部署步骤

### 第 1 步：注册 Render 账号

1. 访问 Render 官网：**https://render.com**
2. 点击右上角的 **Sign Up**
3. 使用 GitHub 账号登录

> 💡 如果 Render 也无法访问，可以尝试使用 **https://dashboard.render.com** 或通过 **VPN** 访问。

---

### 第 2 步：创建新的 Web Service

1. 登录后，点击顶部导航栏的 **New +**
2. 选择 **Web Service**

---

### 第 3 步：连接 GitHub 仓库

1. 在 **Connect a repository** 部分，找到 `law-firm-app` 仓库
2. 如果没有看到仓库，点击 **Configure account** 授权 Render 访问你的 GitHub
3. 选择 `law-firm-app` 仓库，点击 **Connect**

---

### 第 4 步：配置 Web Service

**基本配置：**

- **Name**: `law-firm-app-server` (可以自定义)
- **Region**: 选择离你最近的区域（如 Singapore）
- **Branch**: `main`

**构建配置：**

- **Runtime**: `Node`
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start:prod`

**实例配置：**

- **Instance Type**: `Free` (免费套餐)
- **Plan**: `Free`

---

### 第 5 步：配置环境变量

在 **Environment Variables** 部分添加以下变量：

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `COZE_SUPABASE_URL` | `https://xcadxajiavehzzhqahd.supabase.co` |
| `COZE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjYWR4YWppYXZlaHp6aHFhaGQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNDUzNzU3OSwiZXhwIjoyMDUwMTEzNTc5fQ.XcVQfP8hK3rX5vY7rP2qK5tL8mN0jD5wG8hJ2kL5mN0` |
| `DATABASE_URL` | `postgresql://postgres:gaoxinjing2000@aws-0-ap-northeast-1.pooler.supabase.co:6543/postgres` |

---

### 第 6 步：高级配置（可选）

点击 **Advanced**，配置以下选项：

**健康检查：**
- **Health Check Path**: `/api/health`
- **Auto-Deploy**: ✅ 勾选（自动部署）

---

### 第 7 步：部署

1. 点击底部的 **Create Web Service** 按钮
2. 等待部署完成（通常需要 3-5 分钟）
3. 部署完成后，状态会显示 **Live**

---

### 第 8 步：获取 API 地址

1. 部署成功后，在项目详情页顶部会显示服务地址
2. 复制 **URL**，例如：`https://law-firm-app-server-xxx.onrender.com`

---

## 🧪 测试 API

### 测试健康检查接口

在浏览器访问：
```
https://<你的-render-域名>/api/health
```

预期返回：
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### 测试律师列表接口

在浏览器访问：
```
https://<你的-render-域名>/api/lawyers
```

预期返回：
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "name": "张三",
      "title": "高级合伙人",
      ...
    }
  ]
}
```

---

## 📱 配置小程序

### 第 9 步：创建 `.env.local` 文件

在项目根目录创建 `.env.local` 文件：

```bash
# 项目根目录
cd /workspace/projects
cat > .env.local << EOF
PROJECT_DOMAIN=https://<你的-render-域名>
EOF
```

---

### 第 10 步：重新构建小程序

```bash
# 构建微信小程序
pnpm build:weapp

# 构建完成后，上传小程序到微信开发者工具
```

---

## 🔐 配置微信小程序后台域名白名单

### 第 11 步：登录微信公众平台

访问：**https://mp.weixin.qq.com**

### 第 12 步：配置服务器域名

1. 进入 **开发管理**
2. 点击 **开发设置**
3. 找到 **服务器域名**
4. 在 **request 合法域名** 中添加：
   ```
   https://<你的-render-域名>
   ```

---

## ✅ 完成检查清单

- [ ] Render 账号创建成功
- [ ] Web Service 创建成功
- [ ] 环境变量配置正确
- [ ] 部署成功，服务在线
- [ ] `/api/health` 接口返回正常
- [ ] `/api/lawyers` 接口返回正常
- [ ] 小程序 `.env.local` 文件已配置
- [ ] 小程序重新构建成功
- [ ] 微信小程序后台域名白名单已配置

---

## 🆘 常见问题

### Q: 部署失败怎么办？

A: 检查以下几点：
1. `package.json` 中的脚本是否正确
2. 环境变量是否配置完整
3. 查看部署日志定位错误

### Q: API 超时怎么办？

A: 检查以下几点：
1. Supabase 数据库连接是否正常
2. 端口配置是否正确（应为 3000）
3. 健康检查路径是否正确（`/api/health`）

### Q: Render 免费套餐有什么限制？

A: Render 免费套餐的限制：
- 512MB RAM
- 0.1 CPU
- 750 小时/月
- 服务空闲 15 分钟后会休眠
- 休眠后首次请求需要 30 秒唤醒

### Q: 如何避免服务休眠？

A: 免费套餐无法避免休眠，但可以：
1. 升级到 Starter 套餐（$7/月）
2. 使用定时任务定期唤醒服务
3. 接受首次请求需要 30 秒唤醒

### Q: 如何查看部署日志？

A: 在 Render 项目详情页，点击 **Logs** 标签页查看实时日志。

---

## 📚 相关文档

- [Render 官方文档](https://render.com/docs)
- [Render Node.js 部署指南](https://render.com/docs/deploy-node-express-app)
- [Render 环境变量配置](https://render.com/docs/environment-variables)

---

## 💡 Render vs Railway 对比

| 特性 | Render | Railway |
|------|--------|---------|
| 免费套餐 | ✅ 有 | ✅ 有 |
| RAM | 512MB | 512MB |
| 休眠策略 | 15 分钟后休眠 | 15 分钟后休眠 |
| 首次唤醒时间 | ~30 秒 | ~30 秒 |
| PostgreSQL | 需要单独创建 | 内置支持 |
| 访问速度 | 国内可能较慢 | 国内可能较慢 |
| 配置难度 | ⭐⭐ 简单 | ⭐⭐⭐ 中等 |

---

## 🎉 完成后

恭喜你！后端服务已成功部署到 Render。

下一步：
1. 确保小程序已配置正确的 `PROJECT_DOMAIN`
2. 重新构建并上传小程序
3. 在微信小程序中测试所有功能

## 💡 如果 Render 也无法访问

如果 Render 网站也无法访问，可以考虑：

1. **使用 VPN** 访问
2. **使用国内云服务**：
   - 腾讯云
   - 阿里云
   - 华为云

3. **继续使用 Vercel**：
   - 尝试使用 Vercel 的国内 CDN
   - 联系 Vercel 技术支持

如果有任何问题，请查看部署日志或联系技术支持。
