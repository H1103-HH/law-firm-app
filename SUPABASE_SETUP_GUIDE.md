# 注册 Supabase 账号并配置数据库完整指南

## 🤔 为什么需要注册自己的 Supabase？

当前你的项目使用的 Supabase 数据库是**开发环境自动注入的临时配置**，存在以下问题：

- ❌ 你不知道账号密码，无法登录控制台管理数据
- ❌ 无法获取完整的数据库连接字符串（DATABASE_URL）
- ❌ 数据可能不稳定，环境重置后数据会丢失
- ❌ 部署到生产环境时无法使用

**解决方法**：注册你自己的 Supabase 账号，创建自己的数据库项目。

---

## ✅ 注册 Supabase 账号（完全免费）

### 步骤 1：访问 Supabase 官网

打开浏览器，访问：[https://supabase.com](https://supabase.com)

### 步骤 2：注册账号

1. 点击右上角 **"Start your project"** 按钮
2. 选择登录方式（推荐使用 GitHub）：
   - **方式 A：使用 GitHub 账号**（推荐）
     - 点击 "Sign in with GitHub"
     - 授权 GitHub 登录
   - **方式 B：使用邮箱注册**
     - 点击 "Sign up with Email"
     - 填写邮箱地址和密码
     - 检查邮箱，点击验证链接

### 步骤 3：创建项目

1. 登录后，进入 Supabase Dashboard
2. 点击 **"New Project"** 按钮
3. 填写项目信息：

   ```
   项目名称（Name）: law-firm-app
   数据库密码（Database Password）: [设置一个强密码，例如：L@wFirm2024!]
   区域（Region）: Northeast Asia (Seoul) [选择离你最近的]
   定价计划（Pricing Plan）: Free [免费版，足够使用]
   ```

4. 点击 **"Create new project"** 按钮
5. 等待项目创建（约 2-3 分钟）

**⚠️ 重要提示**：
- 数据库密码请记住！后面配置时需要用到
- 建议复制密码保存到记事本

---

## 🗄️ 初始化数据库表

### 步骤 1：打开 SQL Editor

1. 项目创建完成后，进入 Dashboard
2. 点击左侧菜单 **"SQL Editor"**
3. 点击 **"New query"** 按钮

### 步骤 2：复制并执行初始化脚本

1. 打开项目中的 `server/migrations/init_database.sql` 文件
2. 复制整个文件内容
3. 粘贴到 SQL Editor 中
4. 点击 **"RUN"** 按钮执行

**脚本会创建以下表**：
- ✅ `users` - 用户表
- ✅ `admins` - 管理员表
- ✅ `lawyers` - 律师信息表
- ✅ `viewed_lawyers` - 浏览记录表
- ✅ `saved_cards` - 收藏名片表
- ✅ `consultations` - 咨询消息表
- ✅ `health_check` - 健康检查表

**还会插入测试数据**：
- 1 个管理员账号（用户名：admin，密码：admin123）
- 3 位示例律师数据

### 步骤 3：验证表创建成功

1. 点击左侧菜单 **"Table Editor"**
2. 你应该能看到所有创建的表
3. 点击任意表（如 `lawyers`）可以查看数据

---

## 🔑 获取配置信息

部署后端服务时需要以下配置，请提前获取并保存到记事本。

### 步骤 1：获取 Project URL 和 anon key

1. 在 Supabase Dashboard 中
2. 点击左侧菜单 **Settings** → **API**
3. 找到以下信息并复制：

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjM...
```

### 步骤 2：获取数据库连接字符串（DATABASE_URL）

1. 在同一个页面（Settings → API）
2. 向下滚动找到 **"Connection string"** 部分
3. 点击 **"URI"** 标签
4. 复制连接字符串：

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxx.supabase.co:5432/postgres
```

**⚠️ 重要**：
- 把 `[YOUR-PASSWORD]` 替换为你创建项目时设置的数据库密码
- 整个连接字符串就是 `DATABASE_URL` 的值

### 步骤 3：保存配置信息

将以下信息保存到记事本（后面部署时需要填写）：

```
COZE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
COZE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:your-password@db.xxxxxxxxxx.supabase.co:5432/postgres
```

---

## 🚀 部署时使用这些配置

### Vercel 部署

在 Vercel 项目设置中，添加以下环境变量：

| Name | Value |
|------|-------|
| `COZE_SUPABASE_URL` | 你保存的 Project URL |
| `COZE_SUPABASE_ANON_KEY` | 你保存的 anon key |
| `DATABASE_URL` | 你保存的数据库连接字符串 |

### Docker 部署

在 `server/.env` 文件中添加：

```bash
COZE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
COZE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:your-password@db.xxxxxxxxxx.supabase.co:5432/postgres
```

### 本地开发

在 `server/.env` 文件中添加相同的配置。

---

## 📊 常用操作

### 查看数据

1. 点击左侧菜单 **"Table Editor"**
2. 选择要查看的表
3. 可以查看、编辑、删除数据

### 执行 SQL

1. 点击左侧菜单 **"SQL Editor"**
2. 点击 "New query"
3. 输入 SQL 语句
4. 点击 "RUN" 执行

### 备份数据

1. 点击左侧菜单 **"Database"**
2. 点击 "Backups"
3. 可以创建定时备份或手动备份

### 查看日志

1. 点击左侧菜单 **"Database"**
2. 点击 "Logs"
3. 查看数据库操作日志

---

## 🔒 安全建议

1. **修改默认管理员密码**
   ```sql
   -- 在 SQL Editor 中执行
   UPDATE admins SET password = '你的新密码' WHERE username = 'admin';
   ```

2. **不要泄露配置信息**
   - 不要将 `DATABASE_URL` 提交到 Git
   - 不要分享 anon key 给不可信的人

3. **设置行级安全策略（RLS）**（可选）
   - 在生产环境中建议配置 RLS
   - 参考 Supabase 官方文档

---

## ❓ 常见问题

### Q1: Supabase 免费版够用吗？

**A**: 完全够用！免费版提供：
- 500MB 数据库存储
- 1GB 文件存储
- 2GB 带宽/月
- 50,000 月活跃用户

对于律师名片小程序来说绰绰有余。

### Q2: 忘记数据库密码怎么办？

**A**: 在 Supabase Dashboard 中：
1. Settings → Database
2. 找到 "Database Password"
3. 点击 "Reset password" 重置

### Q3: 如何删除项目？

**A**:
1. 进入项目设置
2. 点击 "Delete project"
3. 确认删除（此操作不可逆）

### Q4: 数据会丢失吗？

**A**: Supabase 免费版会自动备份：
- 每天自动备份数据库
- 保留 7 天的备份
- 可以随时恢复

---

## ✅ 检查清单

完成以下步骤后，你的 Supabase 就配置好了：

- [ ] 已注册 Supabase 账号
- [ ] 已创建项目（law-firm-app）
- [ ] 已执行数据库初始化脚本（创建了所有表）
- [ ] 已获取 Project URL
- [ ] 已获取 anon key
- [ ] 已获取 DATABASE_URL
- [ ] 已修改默认管理员密码

---

## 🎉 完成！

现在你有了自己的 Supabase 数据库，可以开始部署后端服务了。

**下一步**：
1. 参考 `QUICK_START.md` 选择部署方案
2. 使用上面保存的配置信息填写环境变量
3. 部署后端服务
4. 配置小程序域名

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 Supabase 官方文档：https://supabase.com/docs
2. 检查上面的常见问题部分
3. 确认配置信息是否正确复制

祝你部署顺利！🚀
