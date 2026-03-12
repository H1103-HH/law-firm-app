# 小程序 API 接口文档

## 基础信息

**后端地址配置：**

| 环境 | 后端地址 | 说明 |
|------|---------|------|
| 开发环境 | `http://localhost:3000/api` | 本地开发使用 |
| 生产环境 | `https://your-backend-api.com/api` | 需要在 .env.local 中配置 |

**全局前缀：** 所有接口都带有 `/api` 前缀

**请求格式：**
- Content-Type: `application/json`
- 认证方式：`Authorization: Bearer {token}`（部分接口需要）

**响应格式：**
```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

---

## API 接口列表

### 1. 用户认证相关

#### 1.1 微信登录

**接口地址：** `POST /api/auth/login`

**请求参数：**
```json
{
  "code": "string",      // 微信登录码
  "role": "client|partner",  // 用户身份：client（客户）/ partner（合伙人）
  "nickname": "string", // 昵称（可选）
  "avatar": "string"    // 头像URL（可选）
}
```

**响应示例：**
```json
{
  "code": 200,
  "msg": "登录成功",
  "data": {
    "id": 1,
    "openid": "mock_openid_xxx",
    "unionid": "mock_unionid_xxx",
    "nickname": "张三",
    "avatar": "https://example.com/avatar.png",
    "role": "client",
    "token": "token_1_xxx"
  }
}
```

**说明：**
- 登录成功后会返回 `token`，后续请求需要在 Header 中携带
- Token 格式：`token_{userId}_{randomString}`

---

### 2. 律师信息相关

#### 2.1 获取律师列表

**接口地址：** `GET /api/lawyers`

**响应示例：**
```json
{
  "code": 200,
  "msg": "查询成功",
  "data": [
    {
      "id": 1,
      "name": "陈巍",
      "title": "全球合伙人",
      "avatar": "https://example.com/avatar.jpg",
      "location": "北京",
      "specialties": "并购| 跨境投融资",
      "description": "律师简介...",
      "achievements": "成就描述...",
      "phone": "+86 10 5268 2888",
      "email": "lawyer@dehenglaw.com",
      "website": "https://www.dehenglaw.com",
      "cases": "案例描述...",
      "is_active": true,
      "created_at": "2026-03-09T17:02:28.386932+08:00",
      "updated_at": "2026-03-11T11:09:15.278038+08:00"
    }
  ]
}
```

#### 2.2 获取律师详情

**接口地址：** `GET /api/lawyers/{id}`

**路径参数：**
- `id`: 律师 ID（数字）

**响应示例：**
```json
{
  "code": 200,
  "msg": "查询成功",
  "data": {
    "id": 1,
    "name": "陈巍",
    "title": "全球合伙人",
    "avatar": "https://example.com/avatar.jpg",
    "location": "北京",
    "specialties": "并购| 跨境投融资",
    "description": "律师简介...",
    "achievements": "成就描述...",
    "phone": "+86 10 5268 2888",
    "email": "lawyer@dehenglaw.com",
    "website": "https://www.dehenglaw.com",
    "cases": "案例描述...",
    "is_active": true,
    "created_at": "2026-03-09T17:02:28.386932+08:00",
    "updated_at": "2026-03-11T11:09:15.278038+08:00"
  }
}
```

#### 2.3 创建律师（管理员）

**接口地址：** `POST /api/lawyers`

**认证：** 需要管理员权限

**请求参数：**
```json
{
  "name": "张三",
  "title": "合伙人",
  "avatar": "https://example.com/avatar.jpg",
  "location": "上海",
  "specialties": "公司法| 合同纠纷",
  "description": "律师简介...",
  "achievements": "成就描述...",
  "phone": "+86 21 1234 5678",
  "email": "zhangsan@dehenglaw.com",
  "website": "https://www.dehenglaw.com",
  "cases": "案例描述...",
  "is_active": true
}
```

#### 2.4 更新律师（管理员）

**接口地址：** `PUT /api/lawyers/{id}`

**认证：** 需要管理员权限

**请求参数：** 同创建律师（所有字段都是可选的）

#### 2.5 删除律师（管理员）

**接口地址：** `DELETE /api/lawyers/{id}`

**认证：** 需要管理员权限

---

### 3. 浏览记录相关

#### 3.1 记录浏览历史

**接口地址：** `POST /api/viewed-lawyers/record`

**认证：** 需要登录

**请求参数：**
```json
{
  "lawyerId": 1
}
```

**响应示例：**
```json
{
  "code": 200,
  "msg": "记录成功",
  "data": null
}
```

#### 3.2 获取浏览历史

**接口地址：** `GET /api/viewed-lawyers?limit=20`

**认证：** 需要登录

**查询参数：**
- `limit`: 返回数量限制（默认 20）

**响应示例：**
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "lawyerId": 1,
      "userId": 1,
      "viewedAt": "2026-03-11T17:01:59.168316+08:00",
      "lawyer": {
        "id": 1,
        "name": "陈巍",
        "title": "全球合伙人",
        "avatar": "https://example.com/avatar.jpg",
        "location": "北京",
        "specialties": "并购| 跨境投融资"
      }
    }
  ]
}
```

#### 3.3 清除浏览历史

**接口地址：** `DELETE /api/viewed-lawyers`

**认证：** 需要登录

**响应示例：**
```json
{
  "code": 200,
  "msg": "清除成功",
  "data": null
}
```

---

### 4. 收藏名片相关

#### 4.1 收藏名片

**接口地址：** `POST /api/saved-cards/save`

**认证：** 需要登录

**请求参数：**
```json
{
  "lawyerId": 1
}
```

**响应示例：**
```json
{
  "code": 200,
  "msg": "收藏成功",
  "data": {
    "alreadySaved": false
  }
}
```

#### 4.2 获取收藏列表

**接口地址：** `GET /api/saved-cards?limit=20`

**认证：** 需要登录

**查询参数：**
- `limit`: 返回数量限制（默认 20）

**响应示例：**
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "lawyerId": 1,
      "userId": 1,
      "savedAt": "2026-03-11T17:03:07.961896+08:00",
      "lawyer": {
        "id": 1,
        "name": "陈巍",
        "title": "全球合伙人",
        "avatar": "https://example.com/avatar.jpg",
        "location": "北京",
        "phone": "+86 10 5268 2888",
        "email": "lawyer@dehenglaw.com"
      }
    }
  ]
}
```

#### 4.3 取消收藏名片

**接口地址：** `POST /api/saved-cards/unsave` 或 `DELETE /api/saved-cards`

**认证：** 需要登录

**请求参数：**
```json
{
  "lawyerId": 1
}
```

**响应示例：**
```json
{
  "code": 200,
  "msg": "取消收藏成功",
  "data": null
}
```

#### 4.4 检查是否已收藏

**接口地址：** `GET /api/saved-cards/check?lawyerId=1`

**认证：** 需要登录

**查询参数：**
- `lawyerId`: 律师 ID

**响应示例：**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "saved": true
  }
}
```

---

### 5. 文件上传相关

#### 5.1 上传文件

**接口地址：** `POST /api/upload`

**认证：** 需要登录

**请求方式：** `multipart/form-data`

**请求参数：**
- `file`: 文件（FormData）

**响应示例：**
```json
{
  "code": 200,
  "msg": "上传成功",
  "data": {
    "url": "https://example.com/uploaded-file.jpg",
    "filename": "file-xxx.jpg"
  }
}
```

---

### 6. 咨询相关

#### 6.1 创建咨询

**接口地址：** `POST /api/consultations`

**认证：** 需要登录

**请求参数：**
```json
{
  "name": "张三",
  "phone": "13800138000",
  "email": "zhangsan@example.com",
  "lawyerId": 1,
  "content": "咨询内容..."
}
```

**响应示例：**
```json
{
  "code": 200,
  "msg": "创建成功",
  "data": {
    "id": 1,
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "lawyerId": 1,
    "content": "咨询内容...",
    "status": "pending",
    "createdAt": "2026-03-11T17:00:00.000000+08:00"
  }
}
```

#### 6.2 获取咨询列表

**接口地址：** `GET /api/consultations`

**认证：** 需要登录

**响应示例：**
```json
{
  "code": 200,
  "msg": "查询成功",
  "data": [
    {
      "id": 1,
      "name": "张三",
      "phone": "13800138000",
      "email": "zhangsan@example.com",
      "lawyerId": 1,
      "content": "咨询内容...",
      "status": "pending",
      "createdAt": "2026-03-11T17:00:00.000000+08:00"
    }
  ]
}
```

---

### 7. 管理员相关

#### 7.1 管理员登录

**接口地址：** `POST /api/admin/login`

**请求参数：**
```json
{
  "username": "admin",
  "password": "password"
}
```

**响应示例：**
```json
{
  "code": 200,
  "msg": "登录成功",
  "data": {
    "id": 1,
    "username": "admin",
    "name": "管理员",
    "token": "token_1_xxx"
  }
}
```

#### 7.2 获取律师列表（管理员）

**接口地址：** `GET /api/admin/lawyers`

**认证：** 需要管理员权限

**响应示例：**
```json
{
  "code": 200,
  "msg": "查询成功",
  "data": [
    {
      "id": 1,
      "name": "陈巍",
      "title": "全球合伙人",
      "avatar": "https://example.com/avatar.jpg",
      "is_active": true
    }
  ]
}
```

---

## 错误码说明

| 错误码 | 说明 |
|-------|------|
| 200 | 成功 |
| 401 | 未登录或 token 无效 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 使用示例

### 示例 1：登录

```bash
curl -X POST https://your-backend-api.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "code": "wx_code",
    "role": "client",
    "nickname": "张三",
    "avatar": "https://example.com/avatar.png"
  }'
```

### 示例 2：获取律师列表

```bash
curl https://your-backend-api.com/api/lawyers
```

### 示例 3：获取律师详情（需要登录）

```bash
curl https://your-backend-api.com/api/lawyers/1 \
  -H "Authorization: Bearer token_1_xxx"
```

### 示例 4：收藏名片（需要登录）

```bash
curl -X POST https://your-backend-api.com/api/saved-cards/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token_1_xxx" \
  -d '{"lawyerId": 1}'
```

---

## 配置说明

### 开发环境

在开发环境中，后端地址为 `http://localhost:3000/api`，前端通过 Vite 代理访问。

### 生产环境

在生产环境中，需要：

1. 创建 `.env.local` 文件：
   ```bash
   PROJECT_DOMAIN=https://your-backend-api.com
   ```

2. 在微信公众平台配置 request 合法域名

3. 重新构建小程序：
   ```bash
   pnpm build:weapp
   ```

---

## 注意事项

1. **认证**：除了登录接口，其他接口都需要在 Header 中携带 `Authorization: Bearer {token}`
2. **域名配置**：生产环境必须配置正确的后端域名
3. **HTTPS**：小程序要求使用 HTTPS 协议
4. **域名白名单**：必须在微信公众平台配置 request 合法域名

---

## 相关文档

- [生产环境配置指南](./PRODUCTION_CONFIG.md)
- [微信公众平台配置指南](./PRODUCTION_CONFIG.md#微信小程序域名配置)
