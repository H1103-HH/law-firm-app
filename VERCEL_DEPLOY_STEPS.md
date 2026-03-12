# Vercel 部署步骤（简单版）

## 📋 部署前准备

你的配置信息已准备好：
- ✅ COZE_SUPABASE_URL
- ✅ COZE_SUPABASE_ANON_KEY
- ✅ DATABASE_URL

---

## 🚀 部署步骤

### 第 1 步：创建 GitHub 仓库（5 分钟）

1. 访问 [https://github.com](https://github.com)
2. 登录你的账号（如果没有账号，先注册，免费）
3. 点击右上角 **"+"** 按钮
4. 选择 **"New repository"**
5. 填写信息：
   - Repository name: `law-firm-app`
   - Description: `律师事务所名片小程序后端服务`
   - 选择 **Public**（公开）
6. 点击 **"Create repository"**

---

### 第 2 步：推送代码到 GitHub（2 分钟）

创建仓库后，GitHub 会给你一些命令。复制并执行：

```bash
# 在项目根目录执行
cd /workspace/projects

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/law-firm-app.git

# 推送代码
git branch -M main
git push -u origin main
```

**示例**：
```bash
git remote add origin https://github.com/zhangsan/law-firm-app.git
git push -u origin main
```

---

### 第 3 步：在 Vercel 上部署（5 分钟）

1. 访问 [https://vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 **"Add New Project"**
4. 在 "Import Git Repository" 中找到你的 `law-firm-app` 仓库
5. 点击 **"Import"**

---

### 第 4 步：配置 Vercel 项目（3 分钟）

导入后，配置以下信息：

**Framework Preset**: 选择 "Other"

**Root Directory**: 输入 `server`

**Build Command**: 输入 `pnpm build`

**Output Directory**: 输入 `dist`

**Environment Variables**（环境变量）:

点击 "Environment Variables" 部分，添加以下变量：

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `COZE_SUPABASE_URL` | `https://xcadxajiavehzzhqahd.supabase.co` |
| `COZE_SUPABASE_ANON_KEY` | `sb_publishable_hziG-j8sakwGk0bC3ptotQ_QsVk4` |
| `DATABASE_URL` | `postgresql://postgres:gaoxinjing2000@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres` |

---

### 第 5 步：部署（2-3 分钟）

点击 **"Deploy"** 按钮，等待 2-3 分钟。

**成功标志**：
- 看到 "Congratulations!" 页面
- 显示一个部署成功的链接，例如：`https://law-firm-app-xxxxx.vercel.app`

---

## ✅ 部署完成后

### 1. 测试 API

复制 Vercel 给你的域名，在浏览器中访问：

```
https://你的域名.vercel.app/api/lawyers
```

应该看到 JSON 格式的律师列表数据。

### 2. 获取你的 API 地址

Vercel 给你的域名就是你的后端 API 地址，例如：

```
https://law-firm-app-abc123.vercel.app
```

### 3. 配置小程序

在小程序根目录创建 `.env.local` 文件：

```bash
PROJECT_DOMAIN=https://law-firm-app-abc123.vercel.app
```

### 4. 重新构建小程序

```bash
pnpm build:weapp
```

---

## 🎯 快速参考

### 你的配置信息

```
COZE_SUPABASE_URL = https://xcadxajiavehzzhqahd.supabase.co
COZE_SUPABASE_ANON_KEY = sb_publishable_hziG-j8sakwGk0bC3ptotQ_QsVk4
DATABASE_URL = postgresql://postgres:gaoxinjing2000@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

### 推送命令（替换 YOUR_USERNAME）

```bash
git remote add origin https://github.com/YOUR_USERNAME/law-firm-app.git
git push -u origin main
```

### 测试 API

```bash
curl https://你的域名.vercel.app/api/lawyers
```

---

## ❓ 遇到问题？

### 问题 1：推送失败

**解决**：检查 GitHub 仓库地址是否正确，确保你已登录 GitHub。

### 问题 2：Vercel 构建失败

**解决**：
- 检查环境变量是否正确填写
- 确认 Root Directory 是 `server`
- 确认 Build Command 是 `pnpm build`

### 问题 3：API 返回 500 错误

**解决**：
- 检查 DATABASE_URL 中的密码是否正确
- 在 Vercel 控制台查看部署日志

---

## 🎉 完成后

部署完成后，告诉我：
1. Vercel 给你的域名
2. API 测试是否成功

我会帮你配置小程序！🚀
