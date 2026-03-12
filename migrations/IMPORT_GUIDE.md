# 微信云数据库导入说明

## 数据统计

- **lawyers**: 0 条记录
- **users**: 0 条记录
- **consultations**: 0 条记录
- **admin**: 0 条记录
- **viewed_lawyers**: 0 条记录
- **saved_cards**: 0 条记录

## 导入步骤

### 1. 打开微信开发者工具

### 2. 进入云开发控制台

### 3. 创建数据库集合

依次创建以下集合，并设置权限：

#### lawyers - 律师信息
权限设置：
```json
{
  "read": true,
  "write": false
}
```

#### users - 用户信息
权限设置：
```json
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

#### consultations - 咨询记录
权限设置：
```json
{
  "read": true,
  "write": true
}
```

#### admin - 管理员
权限设置：
```json
{
  "read": true,
  "write": false
}
```

#### viewed_lawyers - 浏览记录
权限设置：
```json
{
  "read": "doc.user_id == auth.openid",
  "write": "doc.user_id == auth.openid"
}
```

#### saved_cards - 收藏名片
权限设置：
```json
{
  "read": "doc.user_id == auth.openid",
  "write": "doc.user_id == auth.openid"
}
```

### 4. 导入数据

1. 在云开发控制台，选择对应的集合
2. 点击 **导入**
3. 选择对应的 JSON 文件（在 migrations 目录下）
4. 点击 **确定**

### 5. 验证数据

导入完成后，检查：
- 数据是否完整
- 字段是否正确
- 权限是否生效

## 注意事项

1. **备份数据**：导入前请先备份原有数据
2. **权限配置**：确保权限配置正确
3. **数据验证**：导入后请验证数据完整性

---

生成时间: 2026/3/12 15:36:49
