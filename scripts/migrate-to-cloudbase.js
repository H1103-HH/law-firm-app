#!/usr/bin/env node

/**
 * Supabase 到微信云数据库迁移脚本
 *
 * 使用方法：
 * node scripts/migrate-to-cloudbase.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Supabase 配置
const supabaseUrl = 'https://xcadxajiavehzzhqahd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjYWR4YWppYXZlaHp6aHFhaGQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNDUzNzU3OSwiZXhwIjoyMDUwMTEzNTc5fQ.XcVQfP8hK3rX5vY7rP2qK5tL8mN0jD5wG8hJ2kL5mN0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 微信云数据库需要的字段映射
const fieldMappings = {
  lawyers: {
    id: 'id',
    name: 'name',
    title: 'title',
    description: 'description',
    avatar: 'avatar',
    specialties: 'specialties',
    phone: 'phone',
    email: 'email',
    created_at: 'created_at',
    updated_at: 'updated_at'
  },
  users: {
    openid: 'openid',
    nickname: 'nickname',
    avatar: 'avatar',
    role: 'role',
    created_at: 'created_at',
    updated_at: 'updated_at'
  },
  consultations: {
    user_id: 'user_id',
    lawyer_id: 'lawyer_id',
    user_name: 'user_name',
    phone: 'phone',
    message: 'message',
    status: 'status',
    reply: 'reply',
    created_at: 'created_at',
    updated_at: 'updated_at'
  },
  admin: {
    username: 'username',
    password: 'password',
    created_at: 'created_at'
  },
  viewed_lawyers: {
    user_id: 'user_id',
    lawyer_id: 'lawyer_id',
    viewed_at: 'viewed_at'
  },
  saved_cards: {
    user_id: 'user_id',
    lawyer_id: 'lawyer_id',
    saved_at: 'saved_at'
  }
}

/**
 * 从 Supabase 导出数据
 */
async function exportFromSupabase() {
  console.log('📦 从 Supabase 导出数据...')

  const data = {}

  try {
    // 导出律师数据
    console.log('  - 导出 lawyers...')
    const { data: lawyers } = await supabase.from('lawyers').select('*')
    data.lawyers = lawyers || []

    // 导出用户数据
    console.log('  - 导出 users...')
    const { data: users } = await supabase.from('users').select('*')
    data.users = users || []

    // 导出咨询数据
    console.log('  - 导出 consultations...')
    const { data: consultations } = await supabase.from('consultations').select('*')
    data.consultations = consultations || []

    // 导出管理员数据
    console.log('  - 导出 admin...')
    const { data: admin } = await supabase.from('admin').select('*')
    data.admin = admin || []

    // 导出浏览记录
    console.log('  - 导出 viewed_lawyers...')
    const { data: viewed_lawyers } = await supabase.from('viewed_lawyers').select('*')
    data.viewed_lawyers = viewed_lawyers || []

    // 导出收藏数据
    console.log('  - 导出 saved_cards...')
    const { data: saved_cards } = await supabase.from('saved_cards').select('*')
    data.saved_cards = saved_cards || []

    console.log('✅ 数据导出完成')
    return data
  } catch (error) {
    console.error('❌ 导出数据失败:', error)
    throw error
  }
}

/**
 * 转换数据为微信云数据库格式
 */
function transformForCloudBase(data) {
  console.log('🔄 转换数据格式...')

  const transformed = {}

  for (const [tableName, records] of Object.entries(data)) {
    console.log(`  - 转换 ${tableName}...`)
    transformed[tableName] = records.map(record => {
      const mapping = fieldMappings[tableName]
      const transformedRecord = {}

      for (const [cloudbaseField, supabaseField] of Object.entries(mapping)) {
        if (record[supabaseField] !== undefined) {
          transformedRecord[cloudbaseField] = record[supabaseField]
        }
      }

      return transformedRecord
    })
  }

  console.log('✅ 数据转换完成')
  return transformed
}

/**
 * 保存为 JSON 文件
 */
function saveAsJSON(data) {
  console.log('💾 保存为 JSON 文件...')

  const outputDir = path.join(__dirname, '..', 'migrations')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  for (const [tableName, records] of Object.entries(data)) {
    const filename = path.join(outputDir, `${tableName}.json`)
    fs.writeFileSync(filename, JSON.stringify(records, null, 2), 'utf-8')
    console.log(`  - 已保存: ${filename} (${records.length} 条记录)`)
  }

  console.log('✅ JSON 文件保存完成')
}

/**
 * 生成导入说明
 */
function generateImportGuide(data) {
  console.log('📝 生成导入说明...')

  const guide = `# 微信云数据库导入说明

## 数据统计

${Object.entries(data).map(([name, records]) => `- **${name}**: ${records.length} 条记录`).join('\n')}

## 导入步骤

### 1. 打开微信开发者工具

### 2. 进入云开发控制台

### 3. 创建数据库集合

依次创建以下集合，并设置权限：

#### lawyers - 律师信息
权限设置：
\`\`\`json
{
  "read": true,
  "write": false
}
\`\`\`

#### users - 用户信息
权限设置：
\`\`\`json
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
\`\`\`

#### consultations - 咨询记录
权限设置：
\`\`\`json
{
  "read": true,
  "write": true
}
\`\`\`

#### admin - 管理员
权限设置：
\`\`\`json
{
  "read": true,
  "write": false
}
\`\`\`

#### viewed_lawyers - 浏览记录
权限设置：
\`\`\`json
{
  "read": "doc.user_id == auth.openid",
  "write": "doc.user_id == auth.openid"
}
\`\`\`

#### saved_cards - 收藏名片
权限设置：
\`\`\`json
{
  "read": "doc.user_id == auth.openid",
  "write": "doc.user_id == auth.openid"
}
\`\`\`

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

生成时间: ${new Date().toLocaleString('zh-CN')}
`

  const filename = path.join(__dirname, '..', 'migrations', 'IMPORT_GUIDE.md')
  fs.writeFileSync(filename, guide, 'utf-8')
  console.log(`  - 已保存: ${filename}`)

  console.log('✅ 导入说明生成完成')
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 开始迁移...\n')

    // 1. 从 Supabase 导出数据
    const supabaseData = await exportFromSupabase()

    // 2. 转换数据格式
    const cloudBaseData = transformForCloudBase(supabaseData)

    // 3. 保存为 JSON 文件
    saveAsJSON(cloudBaseData)

    // 4. 生成导入说明
    generateImportGuide(cloudBaseData)

    console.log('\n🎉 迁移完成！')
    console.log('\n📂 迁移文件保存在: migrations/ 目录')
    console.log('\n📖 请查看 migrations/IMPORT_GUIDE.md 了解如何导入数据')

  } catch (error) {
    console.error('\n❌ 迁移失败:', error)
    process.exit(1)
  }
}

// 运行主函数
main()
