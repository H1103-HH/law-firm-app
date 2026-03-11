import { getSupabaseClient } from './src/storage/database/supabase-client'

async function migrate() {
  const client = getSupabaseClient()

  console.log('开始创建数据库表...')

  try {
    // 创建浏览记录表
    const { error: viewedError } = await client.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS viewed_lawyers (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          lawyer_id INTEGER NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
          viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );

        CREATE INDEX IF NOT EXISTS viewed_lawyers_user_id_idx ON viewed_lawyers(user_id);
        CREATE INDEX IF NOT EXISTS viewed_lawyers_lawyer_id_idx ON viewed_lawyers(lawyer_id);
        CREATE INDEX IF NOT EXISTS viewed_lawyers_user_lawyer_idx ON viewed_lawyers(user_id, lawyer_id);
      `
    })

    if (viewedError) {
      console.error('创建浏览记录表失败:', viewedError)
    } else {
      console.log('✓ 浏览记录表创建成功')
    }

    // 创建收藏名片表
    const { error: savedError } = await client.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS saved_cards (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          lawyer_id INTEGER NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
          saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          UNIQUE(user_id, lawyer_id)
        );

        CREATE INDEX IF NOT EXISTS saved_cards_user_id_idx ON saved_cards(user_id);
        CREATE INDEX IF NOT EXISTS saved_cards_lawyer_id_idx ON saved_cards(lawyer_id);
        CREATE INDEX IF NOT EXISTS saved_cards_user_lawyer_idx ON saved_cards(user_id, lawyer_id);
      `
    })

    if (savedError) {
      console.error('创建收藏名片表失败:', savedError)
    } else {
      console.log('✓ 收藏名片表创建成功')
    }

    console.log('数据库表创建完成')
  } catch (error) {
    console.error('迁移失败:', error)
    process.exit(1)
  }
}

migrate()
