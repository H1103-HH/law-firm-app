# 律师信息管理指南

## 📍 律师信息存储位置

律师信息统一存储在 `src/data/partners.ts` 文件中。

## 📝 如何添加新律师

### 步骤 1: 打开配置文件

编辑 `src/data/partners.ts` 文件

### 步骤 2: 在 `partners` 数组中添加律师信息

```typescript
{
  id: 7,  // 唯一ID，不能重复
  name: '你的名字',
  title: '合伙人',
  avatar: 'https://your-avatar-url.jpg',  // 头像图片链接
  location: '上海',
  specialties: ['公司法', '合同法'],  // 专业领域（数组）
  experience: '10年',
  education: '某某大学法学院硕士',
  description: '律师的个人简介...',
  achievements: [  // 荣誉成就
    '某某荣誉',
    '某某认证'
  ]
}
```

### 步骤 3: 保存文件，热更新会自动生效

## ✏️ 如何修改现有律师信息

直接在 `src/data/partners.ts` 文件中找到对应的律师数据，修改相应字段即可。

例如，修改张律师的头像：
```typescript
{
  id: 1,
  name: '张律师',
  avatar: 'https://新的头像链接.jpg',  // 修改这里
  // ... 其他字段保持不变
}
```

## 🖼️ 如何使用自己的律师照片

### 方法 1: 使用外部图片链接

将律师照片上传到图床或服务器，获取图片 URL，填写到 `avatar` 字段：

```typescript
avatar: 'https://your-domain.com/photos/zhang-lawyer.jpg'
```

### 方法 2: 使用本地图片（推荐用于小程序）

1. 在 `src/assets/` 目录下创建 `lawyers/` 文件夹
2. 将律师照片放到该文件夹，命名为 `lawyer-1.jpg`、`lawyer-2.jpg` 等
3. 使用相对路径：

```typescript
avatar: '/assets/lawyers/lawyer-1.jpg'
```

### 注意事项

- **图片尺寸**: 建议使用正方形图片，推荐 400x400 像素或更大
- **图片格式**: 支持 JPG、PNG、WebP 格式
- **文件大小**: 单张图片建议不超过 500KB（小程序限制）
- **图片质量**: 建议使用高清、专业的照片

## 📊 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | number | ✅ | 唯一标识符，不能重复 |
| `name` | string | ✅ | 律师姓名 |
| `title` | string | ✅ | 职务（如：高级合伙人、合伙人） |
| `avatar` | string | ✅ | 头像图片URL |
| `location` | string | ✅ | 所在城市 |
| `specialties` | string[] | ✅ | 专业领域数组 |
| `experience` | string | ✅ | 从业年限 |
| `education` | string | ✅ | 教育背景 |
| `description` | string | ✅ | 个人简介 |
| `achievements` | string[] | ❌ | 荣誉成就数组 |

## 🔧 添加联系方式（详情页）

如果需要在详情页显示联系方式，需要编辑 `src/pages/partner-detail/index.tsx` 文件中的 `partnerDetails` 对象：

```typescript
{
  id: 1,
  name: '张律师',
  // ... 基本信息从 src/data/partners.ts 导入
  phone: '138-0000-0001',      // 电话
  email: 'zhang@lawfirm.com',  // 邮箱
  website: 'www.lawfirm.com',  // 官网（可选）
  cases: [                     // 典型案例
    '某大型国企并购案',
    '跨国公司知识产权纠纷案'
  ]
}
```

## 🗑️ 如何删除律师

在 `src/data/partners.ts` 文件中，找到要删除的律师对象，从 `partners` 数组中删除即可。

## 📋 完整示例

```typescript
{
  id: 7,
  name: '孙律师',
  title: '合伙人',
  avatar: '/assets/lawyers/lawyer-7.jpg',
  location: '广州',
  specialties: ['房地产法', '建设工程', 'PPP项目'],
  experience: '12年',
  education: '中山大学法学院硕士',
  description: '专注于房地产、建设工程等领域的法律服务，参与过多个大型房地产开发项目。',
  achievements: [
    '成功处理100+起房地产纠纷案件',
    '广东省优秀青年律师',
    '广州市房地产法研究会委员'
  ]
}
```

## ✅ 验证

修改完成后：
1. 保存文件
2. 小程序会自动热更新
3. 在"全球合伙人"页面查看修改效果
4. 使用搜索功能测试（支持搜索姓名、职务、专业领域、城市）

## 💡 最佳实践

1. **统一管理**: 所有律师信息都在 `src/data/partners.ts` 中管理，不要在多个文件中重复定义
2. **ID 唯一**: 确保 `id` 字段唯一，避免冲突
3. **图片优化**: 压缩图片以减小小程序体积
4. **信息完整**: 尽量填写完整的律师信息，提升专业形象
5. **定期更新**: 及时更新律师的职务、荣誉等信息

## 🆘 常见问题

**Q: 修改后没有生效？**
A: 等待几秒钟，热更新会自动应用更改。如果仍未生效，尝试刷新小程序。

**Q: 图片显示不出来？**
A: 检查图片 URL 是否正确，确保图片可以访问。小程序不支持某些域名的图片，建议使用已备案的域名或图床。

**Q: 如何批量导入律师信息？**
A: 可以将律师信息整理成 Excel 表格，然后转换成 JSON 格式，批量添加到 `partners` 数组中。

**Q: 需要支持搜索更多字段？**
A: 当前支持搜索姓名、职务、专业领域、城市。如需支持其他字段，可以修改 `src/pages/partners/index.tsx` 中的搜索逻辑。
