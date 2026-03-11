# 律师事务所名片小程序设计指南

## 品牌定位
- **应用定位**: 专业律师事务所律师名片展示平台
- **设计风格**: 专业、稳重、可信
- **目标用户**: 客户、合作伙伴

## 配色方案

### 主色板
- **主色调**: 深蓝色 `bg-blue-900` / `text-blue-900` - 专业感、信任感
- **强调色**: 金色/琥珀色 `bg-amber-500` / `text-amber-500` - 尊贵、专业
- **背景色**: 纯白 `bg-white` - 干净简洁
- **卡片背景**: 浅灰 `bg-gray-50` / `bg-gray-100`

### 中性色
- **主要文字**: `text-gray-900` / `text-gray-800`
- **次要文字**: `text-gray-600` / `text-gray-500`
- **辅助文字**: `text-gray-400`
- **边框**: `border-gray-200` / `border-gray-300`
- **分割线**: `divide-gray-200`

### 语义色
- **电话**: `text-blue-600` + `bg-blue-50`
- **邮箱**: `text-green-600` + `bg-green-50`
- **地址**: `text-orange-600` + `bg-orange-50`

## 字体规范

### 字体层级
- **页面标题**: `text-2xl font-bold text-gray-900`
- **律师姓名**: `text-xl font-bold text-gray-900`
- **职位/职称**: `text-base font-medium text-gray-600`
- **专长领域**: `text-sm text-gray-700`
- **联系信息**: `text-sm text-gray-600`
- **辅助说明**: `text-xs text-gray-400`

## 间距系统

### 页面布局
- **页面边距**: `p-4` 或 `p-6`
- **卡片间距**: `gap-4`
- **卡片内边距**: `p-5` 或 `p-6`
- **列表项间距**: `gap-3`
- **元素间距**: `gap-2`（小）、`gap-4`（中）

### 组件间距
- **标题与内容**: `mb-4`
- **信息组间距**: `mb-3` 或 `mb-4`
- **图标与文字**: `gap-2`

## 组件规范

### 名片卡片
```tsx
<View className="bg-white rounded-2xl shadow-lg p-6 mb-4">
  {/* 头像区域 */}
  <View className="flex items-center gap-4 mb-4">
    <Image className="w-20 h-20 rounded-full object-cover" src={avatarUrl} />
    <View className="flex-1">
      <Text className="block text-xl font-bold text-gray-900 mb-1">姓名</Text>
      <Text className="block text-base font-medium text-gray-600">职位</Text>
    </View>
  </View>

  {/* 专长领域 */}
  <View className="mb-4">
    <Text className="block text-sm font-semibold text-gray-700 mb-2">专长领域</Text>
    <View className="flex flex-wrap gap-2">
      <View className="bg-blue-50 text-blue-900 px-3 py-1 rounded-full">
        <Text className="text-xs">领域1</Text>
      </View>
    </View>
  </View>

  {/* 联系方式 */}
  <View className="space-y-3">
    <View className="flex items-center gap-3">
      <Phone className="w-5 h-5 text-blue-600" />
      <Text className="text-sm text-gray-600">电话</Text>
    </View>
    <View className="flex items-center gap-3">
      <Mail className="w-5 h-5 text-green-600" />
      <Text className="text-sm text-gray-600">邮箱</Text>
    </View>
  </View>
</View>
```

### 律所信息卡片
```tsx
<View className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-6 text-white mb-6">
  <View className="flex items-center gap-3 mb-3">
    <Building2 className="w-6 h-6" />
    <Text className="text-lg font-bold">律师事务所名称</Text>
  </View>
  <Text className="text-sm opacity-90 mb-2">专业法律服务平台</Text>
  <View className="flex items-center gap-2 text-xs opacity-80">
    <MapPin className="w-4 h-4" />
    <Text>地址</Text>
  </View>
</View>
```

### 按钮
```tsx
{/* 主按钮 - 联系电话 */}
<View className="bg-blue-900 rounded-xl py-3 px-6 shadow-md active:bg-blue-800">
  <Text className="block text-center text-white font-medium">拨打电话</Text>
</View>

{/* 次按钮 - 复制邮箱 */}
<View className="bg-white border border-gray-200 rounded-xl py-3 px-6 active:bg-gray-50">
  <Text className="block text-center text-gray-700 font-medium">复制邮箱</Text>
</View>
```

## 导航结构
- **单页应用**: 首页展示所有律师名片
- **无 TabBar**: 简洁的垂直滚动布局

## 小程序约束
- **图片策略**: 头像使用圆形裁剪 `rounded-full`
- **性能优化**: 头像尺寸建议 200x200px，使用高质量图片
- **跨端兼容**: 所有 Text 组件添加 `block` 类名，确保 H5/小程序一致性
- **Input/Button 包装**: 如有输入功能，必须用 View 包裹样式

## 跨端兼容示例
```tsx
// ✅ 正确：垂直 Text 添加 block
<Text className="block text-xl font-bold">姓名</Text>

// ✅ 正确：Input 用 View 包裹
<View className="bg-gray-50 rounded-xl px-4 py-3">
  <Input className="w-full bg-transparent" placeholder="输入内容" />
</View>
