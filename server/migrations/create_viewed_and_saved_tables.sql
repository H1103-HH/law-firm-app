-- 创建浏览记录表
CREATE TABLE IF NOT EXISTS viewed_lawyers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lawyer_id INTEGER NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS viewed_lawyers_user_id_idx ON viewed_lawyers(user_id);
CREATE INDEX IF NOT EXISTS viewed_lawyers_lawyer_id_idx ON viewed_lawyers(lawyer_id);
CREATE INDEX IF NOT EXISTS viewed_lawyers_user_lawyer_idx ON viewed_lawyers(user_id, lawyer_id);

-- 创建收藏名片表
CREATE TABLE IF NOT EXISTS saved_cards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lawyer_id INTEGER NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, lawyer_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS saved_cards_user_id_idx ON saved_cards(user_id);
CREATE INDEX IF NOT EXISTS saved_cards_lawyer_id_idx ON saved_cards(lawyer_id);
CREATE INDEX IF NOT EXISTS saved_cards_user_lawyer_idx ON saved_cards(user_id, lawyer_id);
