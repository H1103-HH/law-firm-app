# 微信云开发云函数清单

## 云函数列表

### 1. getLawyers - 获取律师列表
**用途**：获取律师列表，支持搜索和分页

**参数**：
```javascript
{
  keyword: String,  // 搜索关键词（可选）
  page: Number,     // 页码（默认 1）
  pageSize: Number  // 每页数量（默认 20）
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: {
    list: Array,     // 律师列表
    total: Number,   // 总数
    page: Number,
    pageSize: Number
  }
}
```

---

### 2. getLawyerDetail - 获取律师详情
**用途**：获取单个律师的详细信息

**参数**：
```javascript
{
  id: Number  // 律师 ID
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: Object  // 律师详情
}
```

---

### 3. login - 用户登录
**用途**：用户登录或注册

**参数**：
```javascript
{
  openid: String,   // 微信 OpenID
  role: String,     // 角色：customer / partner
  nickname: String, // 昵称（可选）
  avatar: String    // 头像（可选）
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: {
    user: Object,  // 用户信息
    token: String  // 登录令牌
  }
}
```

---

### 4. createConsultation - 创建咨询
**用途**：创建新的咨询记录

**参数**：
```javascript
{
  user_id: String,   // 用户 ID
  lawyer_id: Number, // 律师 ID
  user_name: String, // 用户姓名
  phone: String,     // 电话
  message: String    // 咨询内容
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: {
    _id: String  // 咨询记录 ID
  }
}
```

---

### 5. getConsultations - 获取咨询列表
**用途**：获取咨询列表（客户看自己的，合伙人看所有）

**参数**：
```javascript
{
  user_id: String,   // 用户 ID（客户必填）
  lawyer_id: Number, // 律师 ID（合伙人可选）
  role: String,      // 角色：customer / partner
  page: Number,      // 页码（默认 1）
  pageSize: Number   // 每页数量（默认 20）
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: {
    list: Array,
    total: Number,
    page: Number,
    pageSize: Number
  }
}
```

---

### 6. replyConsultation - 回复咨询
**用途**：合伙人回复咨询

**参数**：
```javascript
{
  id: String,     // 咨询记录 ID
  reply: String   // 回复内容
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: null
}
```

---

### 7. adminLogin - 管理员登录
**用途**：管理员登录后台

**参数**：
```javascript
{
  username: String,  // 用户名
  password: String   // 密码
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: {
    admin: {
      _id: String,
      username: String
    },
    token: String
  }
}
```

---

### 8. getAllLawyers - 获取所有律师（管理员）
**用途**：管理员获取所有律师列表

**参数**：
```javascript
{
  page: Number,      // 页码（默认 1）
  pageSize: Number   // 每页数量（默认 20）
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: {
    list: Array,
    total: Number,
    page: Number,
    pageSize: Number
  }
}
```

---

### 9. addLawyer - 添加律师（管理员）
**用途**：管理员添加新律师

**参数**：
```javascript
{
  name: String,        // 姓名
  title: String,       // 职位
  description: String, // 简介（可选）
  avatar: String,      // 头像（可选）
  specialties: String, // 专业领域（可选）
  phone: String,       // 电话（可选）
  email: String        // 邮箱（可选）
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: {
    _id: String,
    id: Number
  }
}
```

---

### 10. updateLawyer - 更新律师（管理员）
**用途**：管理员更新律师信息

**参数**：
```javascript
{
  id: Number,          // 律师 ID
  name: String,        // 姓名（可选）
  title: String,       // 职位（可选）
  description: String, // 简介（可选）
  avatar: String,      // 头像（可选）
  specialties: String, // 专业领域（可选）
  phone: String,       // 电话（可选）
  email: String        // 邮箱（可选）
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: null
}
```

---

### 11. deleteLawyer - 删除律师（管理员）
**用途**：管理员删除律师

**参数**：
```javascript
{
  id: Number  // 律师 ID
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: null
}
```

---

### 12. addViewedLawyer - 添加浏览记录
**用途**：记录用户浏览律师的历史

**参数**：
```javascript
{
  user_id: String,   // 用户 ID
  lawyer_id: Number  // 律师 ID
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: null
}
```

---

### 13. getViewedLawyers - 获取浏览记录
**用途**：获取用户的浏览历史

**参数**：
```javascript
{
  user_id: String,   // 用户 ID
  page: Number,      // 页码（默认 1）
  pageSize: Number   // 每页数量（默认 20）
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: {
    list: Array,     // 包含律师信息的浏览记录
    total: Number,
    page: Number,
    pageSize: Number
  }
}
```

---

### 14. saveCard - 收藏名片
**用途**：收藏律师名片

**参数**：
```javascript
{
  user_id: String,   // 用户 ID
  lawyer_id: Number  // 律师 ID
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: null
}
```

---

### 15. getSavedCards - 获取收藏列表
**用途**：获取用户的收藏列表

**参数**：
```javascript
{
  user_id: String,   // 用户 ID
  page: Number,      // 页码（默认 1）
  pageSize: Number   // 每页数量（默认 20）
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: {
    list: Array,     // 包含律师信息的收藏列表
    total: Number,
    page: Number,
    pageSize: Number
  }
}
```

---

### 16. removeCard - 取消收藏
**用途**：取消收藏律师名片

**参数**：
```javascript
{
  user_id: String,   // 用户 ID
  lawyer_id: Number  // 律师 ID
}
```

**返回**：
```javascript
{
  code: 200,
  msg: 'success',
  data: null
}
```

---

## 部署步骤

### 1. 在微信开发者工具中部署

1. 打开微信开发者工具
2. 点击 **云开发** → **云函数**
3. 点击 **新建云函数**
4. 输入云函数名称（如 `getLawyers`）
5. 创建后，将 `cloudfunctions/getLawyers/index.js` 的内容复制到云函数的 `index.js`
6. 点击 **上传并部署**
7. 重复以上步骤，部署所有云函数

### 2. 批量部署

如果使用命令行工具：

```bash
# 在项目根目录
cd cloudfunctions

# 遍历所有云函数目录
for dir in */; do
  cd "$dir"
  npm install
  cd ..
done

# 部署所有云函数
wx-server-cli deploy
```

---

## 测试云函数

在微信开发者工具中：

1. 打开 **云开发** → **云函数**
2. 选择要测试的云函数
3. 点击 **测试**
4. 输入测试参数
5. 点击 **调用**
6. 查看返回结果

---

## 注意事项

1. **权限配置**：确保数据库集合权限正确配置
2. **环境变量**：确保 `env` 设置为正确的云开发环境 ID
3. **错误处理**：所有云函数都有统一的错误处理
4. **返回格式**：所有云函数返回统一的格式 `{ code, msg, data }`

---

## 调用示例

### 在小程序中调用

```typescript
// 获取律师列表
const result = await Taro.cloud.callFunction({
  name: 'getLawyers',
  data: {
    keyword: '',
    page: 1,
    pageSize: 20
  }
})

console.log(result.result)
```

### 错误处理

```typescript
const result = await Taro.cloud.callFunction({
  name: 'getLawyers',
  data: {}
})

if (result.result.code === 200) {
  // 成功
  const data = result.result.data
} else {
  // 失败
  console.error(result.result.msg)
}
```
