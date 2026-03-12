# Vercel 部署完成检查清单

## ✅ 已完成

1. ✅ 注册 Supabase 账号
2. ✅ 创建 Supabase 项目（law-firm-app）
3. ✅ 初始化数据库表
4. ✅ 获取 Supabase 配置信息
5. ✅ 创建 GitHub 仓库（H1103-HH/law-firm-app）
6. ✅ 推送代码到 GitHub
7. ✅ 在 Vercel 导入项目
8. ✅ Vercel 自动识别 NestJS 框架
9. ✅ Root Directory 设置为 `server`

## 🔄 进行中

- 用户正在 Vercel 添加环境变量

## ⏳ 待完成

1. 添加 4 个环境变量
2. 点击 Deploy
3. 等待部署完成
4. 获取 Vercel 域名
5. 测试 API 接口
6. 配置小程序

## 📋 环境变量列表

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `COZE_SUPABASE_URL` | `https://xcadxajiavehzzhqahd.supabase.co` |
| `COZE_SUPABASE_ANON_KEY` | `sb_publishable_hziG-j8sakwGk0bC3ptotQ_QsVk4` |
| `DATABASE_URL` | `postgresql://postgres:gaoxinjing2000@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres` |

## 🚀 下一步操作

1. 在 Vercel Environment Variables 部分添加上述 4 个变量
2. 点击 Deploy 按钮
3. 等待 2-3 分钟
4. 部署成功后，告诉用户域名并测试 API
