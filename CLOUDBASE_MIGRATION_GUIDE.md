# 🚀 微信云开发迁移指南

本指南将指导你将律师名片小程序从 Supabase + NestJS 迁移到微信云开发 CloudBase。

## 📋 为什么选择微信云开发？

### 优势

- ✅ **完全免费**（基础版）：每天 2GB 数据库 + 5GB 存储
- ✅ **访问速度快**：国内 CDN，无需担心网络问题
- ✅ **无需配置域名白名单**：微信官方支持，无需申请
- ✅ **部署简单**：微信开发者工具一键部署
- ✅ **完美集成**：与小程序深度集成，开发体验好

### 对比

| 特性 | Supabase + NestJS | 微信云开发 |
|------|------------------|-----------|
| 部署复杂度 | ⭐⭐⭐⭐ 复杂 | ⭐ 简单 |
| 域名白名单 | ❌ 需要配置 | ✅ 不需要 |
| 访问速度 | ❌ 较慢（海外） | ✅ 快速（国内） |
| 费用 | ❌ 需要付费 | ✅ 免费（基础版） |
| 维护成本 | ❌ 高 | ✅ 低 |

---

## 🎯 迁移步骤概览

### 第 1 步：开通微信云开发
### 第 2 步：创建数据库
### 第 3 步：迁移数据
### 第 4 步：创建云函数
### 第 5 步：修改前端代码
### 第 6 步：测试
### 第 7 步：上传小程序

---

## 📖 详细步骤

### 第 1 步：开通微信云开发

1. 打开微信开发者工具
2. 点击顶部导航栏 **云开发**
3. 点击 **开通**（如果还没开通）
4. 选择环境：
   - **环境名称**：`law-firm-app`
   - **基础版**（免费）
5. 点击 **开通**

### 第 2 步：创建数据库

在微信云开发控制台创建以下数据库集合（表）：

#### 1. `lawyers` - 律师信息

```javascript
// 集合结构
{
  _id: String,          // 自动生成
  id: Number,           // 律师 ID
  name: String,         // 姓名
  title: String,        // 职位
  description: String,  // 简介
  avatar: String,       // 头像 URL
  specialties: String,  // 专业领域
  phone: String,        // 电话
  email: String,        // 邮箱
  created_at: Date,     // 创建时间
  updated_at: Date      // 更新时间
}

// 权限设置
{
  "read": true,
  "write": false  // 仅管理员可写
}
```

#### 2. `users` - 用户信息

```javascript
{
  _id: String,
  openid: String,        // 微信 OpenID
  nickname: String,      // 昵称
  avatar: String,        // 头像
  role: String,          // 角色：customer / partner
  created_at: Date,
  updated_at: Date
}

// 权限设置
{
  "read": "doc._openid == auth.openid",  // 只能读取自己的数据
  "write": "doc._openid == auth.openid"
}
```

#### 3. `consultations` - 咨询记录

```javascript
{
  _id: String,
  user_id: String,       // 用户 ID
  lawyer_id: Number,     // 律师 ID
  user_name: String,     // 用户姓名
  phone: String,         // 电话
  message: String,       // 咨询内容
  status: String,        // 状态：pending / replied
  reply: String,         // 回复内容
  created_at: Date,
  updated_at: Date
}

// 权限设置
{
  "read": true,
  "write": true
}
```

#### 4. `admin` - 管理员

```javascript
{
  _id: String,
  username: String,      // 用户名
  password: String,      // 密码（加密）
  created_at: Date
}

// 权限设置
{
  "read": true,
  "write": false  // 仅管理员可写
}
```

#### 5. `viewed_lawyers` - 浏览记录

```javascript
{
  _id: String,
  user_id: String,       // 用户 ID
  lawyer_id: Number,     // 律师 ID
  viewed_at: Date        // 浏览时间
}

// 权限设置
{
  "read": "doc.user_id == auth.openid",
  "write": "doc.user_id == auth.openid"
}
```

#### 6. `saved_cards` - 收藏名片

```javascript
{
  _id: String,
  user_id: String,       // 用户 ID
  lawyer_id: Number,     // 律师 ID
  saved_at: Date         // 收藏时间
}

// 权限设置
{
  "read": "doc.user_id == auth.openid",
  "write": "doc.user_id == auth.openid"
}
```

### 第 3 步：迁移数据

#### 方法 1：手动导入（推荐）

1. 从 Supabase 导出数据为 JSON
2. 在微信云开发控制台，选择对应的集合
3. 点击 **导入**，上传 JSON 文件

#### 方法 2：使用脚本迁移

```bash
# 在项目根目录运行
node scripts/migrate-to-cloudbase.js
```

### 第 4 步：创建云函数

在微信云开发控制台创建以下云函数：

#### 云函数列表

1. `getLawyers` - 获取律师列表
2. `getLawyerDetail` - 获取律师详情
3. `login` - 用户登录
4. `createConsultation` - 创建咨询
5. `getConsultations` - 获取咨询列表
6. `replyConsultation` - 回复咨询
7. `adminLogin` - 管理员登录
8. `updateLawyer` - 更新律师信息
9. `addLawyer` - 添加律师
10. `deleteLawyer` - 删除律师

#### 云函数模板

每个云函数的基本结构：

```javascript
// cloudfunctions/getLawyers/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    const result = await db.collection('lawyers')
      .get()

    return {
      code: 200,
      msg: 'success',
      data: result.data
    }
  } catch (err) {
    return {
      code: 500,
      msg: err.message,
      data: null
    }
  }
}
```

### 第 5 步：修改前端代码

#### 安装云开发 SDK

```bash
cd /workspace/projects
pnpm add @cloudbase/js-sdk
```

#### 初始化云开发

修改 `src/app.tsx`：

```typescript
import Taro, { useLaunch } from '@tarojs/taro'
import cloudbase from '@cloudbase/js-sdk'

function App({ children }) {
  useLaunch(() => {
    // 初始化云开发
    const app = cloudbase.init({
      env: 'law-firm-app'  // 替换为你的环境 ID
    })
    Taro.cloud = app
  })

  return children
}
```

#### 修改网络请求

将 `Network.request` 改为 `Taro.cloud.callFunction`：

```typescript
// ❌ 修改前
const data = await Network.request({
  url: '/api/lawyers'
})

// ✅ 修改后
const result = await Taro.cloud.callFunction({
  name: 'getLawyers'
})
const data = result.result
```

### 第 6 步：测试

1. 在微信开发者工具中测试每个功能
2. 检查云函数是否正常返回数据
3. 检查数据库读写是否正常

### 第 7 步：上传小程序

```bash
# 构建微信小程序
pnpm build:weapp

# 在微信开发者工具中上传
```

---

## 📝 云函数开发规范

### 统一返回格式

```javascript
return {
  code: 200,      // 状态码：200 成功，500 失败
  msg: 'success', // 消息
  data: {}        // 数据
}
```

### 错误处理

```javascript
exports.main = async (event, context) => {
  try {
    // 业务逻辑
    return {
      code: 200,
      msg: 'success',
      data: result
    }
  } catch (err) {
    console.error(err)
    return {
      code: 500,
      msg: err.message,
      data: null
    }
  }
}
```

### 分页查询

```javascript
const { page = 1, pageSize = 10 } = event

const result = await db.collection('lawyers')
  .skip((page - 1) * pageSize)
  .limit(pageSize)
  .get()
```

---

## 🆘 常见问题

### Q: 云函数调用失败怎么办？

A: 检查以下几点：
1. 云函数是否部署成功
2. 环境变量 `env` 是否正确
3. 集合权限是否正确配置

### Q: 数据库查询慢怎么办？

A: 优化查询：
1. 添加索引（在云开发控制台）
2. 使用分页查询
3. 避免查询大量数据

### Q: 如何上传图片？

A: 使用云存储：

```typescript
// 上传图片
const result = await Taro.cloud.uploadFile({
  cloudPath: `avatars/${Date.now()}.jpg`,
  filePath: tempFilePath
})

// 获取文件 URL
const fileID = result.fileID
const url = await Taro.cloud.getTempFileURL({
  fileList: [fileID]
})
```

### Q: 如何调试云函数？

A: 在微信开发者工具中：
1. 打开 **云开发** 控制台
2. 点击 **云函数**
3. 选择对应的云函数
4. 点击 **测试**

---

## 📚 相关文档

- [微信云开发官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [云函数开发指南](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions.html)
- [数据库开发指南](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html)

---

## 🎉 完成后

恭喜你！小程序已成功迁移到微信云开发。

后续维护：
1. 在微信云开发控制台管理数据库
2. 在微信开发者工具中更新云函数
3. 使用云开发监控查看运行状态

---

## ⚠️ 注意事项

1. 云函数有免费额度限制（每天 100,000 次调用）
2. 数据库有免费额度限制（每天 2GB）
3. 云存储有免费额度限制（每天 5GB）
4. 超过免费额度后会按量计费

---

## 💡 优化建议

1. **使用缓存**：将频繁访问的数据缓存到云存储
2. **压缩图片**：上传前压缩图片，减少存储成本
3. **批量操作**：使用批量 API 减少调用次数
4. **监控告警**：配置云开发监控告警

---

## 🆘 获取帮助

如果遇到问题：
1. 查看云开发控制台日志
2. 查看微信开发者工具控制台错误
3. 参考官方文档
4. 联系技术支持
