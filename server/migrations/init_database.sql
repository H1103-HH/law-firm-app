-- 律师事务所小程序 - 数据库初始化脚本
-- 在 Supabase SQL Editor 中执行此脚本

-- ============================================
-- 1. 用户表 (users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  openid VARCHAR(255) NOT NULL UNIQUE,
  unionid VARCHAR(255),
  nickname VARCHAR(100),
  avatar VARCHAR(500),
  role VARCHAR(20) NOT NULL, -- 'customer' 或 'partner'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS users_openid_idx ON users(openid);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

-- ============================================
-- 2. 管理员表 (admins)
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS admins_username_idx ON admins(username);

-- ============================================
-- 3. 律师信息表 (lawyers)
-- ============================================
CREATE TABLE IF NOT EXISTS lawyers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  title VARCHAR(100) NOT NULL,
  avatar VARCHAR(500) NOT NULL,
  location VARCHAR(100) NOT NULL,
  specialties TEXT NOT NULL, -- 专业领域，用 | 分隔
  description TEXT NOT NULL, -- 律师简介
  achievements TEXT NOT NULL, -- 成就荣誉
  phone VARCHAR(50),
  email VARCHAR(200),
  website VARCHAR(500),
  cases TEXT NOT NULL, -- 成功案例
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS lawyers_name_idx ON lawyers(name);
CREATE INDEX IF NOT EXISTS lawyers_location_idx ON lawyers(location);
CREATE INDEX IF NOT EXISTS lawyers_is_active_idx ON lawyers(is_active);

-- ============================================
-- 4. 浏览记录表 (viewed_lawyers)
-- ============================================
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

-- ============================================
-- 5. 收藏名片表 (saved_cards)
-- ============================================
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

-- ============================================
-- 6. 咨询消息表 (consultations)
-- ============================================
CREATE TABLE IF NOT EXISTS consultations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lawyer_id INTEGER NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- 'pending', 'replied'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS consultations_user_id_idx ON consultations(user_id);
CREATE INDEX IF NOT EXISTS consultations_lawyer_id_idx ON consultations(lawyer_id);
CREATE INDEX IF NOT EXISTS consultations_status_idx ON consultations(status);

-- ============================================
-- 7. 系统健康检查表 (health_check)
-- ============================================
CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 插入测试数据（可选）
-- ============================================

-- 插入默认管理员账号
-- 用户名: admin
-- 密码: admin123 (实际应用中应该加密)
INSERT INTO admins (username, password, name)
VALUES ('admin', 'admin123', '系统管理员')
ON CONFLICT (username) DO NOTHING;

-- 插入示例律师数据（3位律师）
INSERT INTO lawyers (name, title, avatar, location, specialties, description, achievements, phone, email, website, cases, is_active)
VALUES
  ('陈巍', '全球合伙人', 'https://via.placeholder.com/200', '北京', '并购| 跨境投融资', '陈巍律师擅长公司境外收购及兼并、外商投资、知识产权、跨境争议解决等法律业务。', '《亚洲法律杂志》（ALB）2018年度"十五佳并购律师"', '+86 10 5268 2888', 'davidweichen@dehenglaw.com', 'https://www.dehenglaw.com', '境外投资案例1', true),
  ('王丽', '首席全球合伙人', 'https://via.placeholder.com/200', '北京', '公司证券、并购', '王丽，法学博士，北京德恒律师事务所党委书记、主任、首席全球合伙人。', '荣获"全国优秀创业女性突出成就奖"', '+86 10 5268 2888', 'wangli@dehenglaw.com', 'https://www.dehenglaw.com', '重大案例1', true),
  ('李贵方', '全球合伙人', 'https://via.placeholder.com/200', '北京', '争议解决', '李贵方律师自从事专职律师以来，办理了大量诉讼、仲裁案件。', '中国行为法学会司法行为研究会副会长', '86-10 52682888', 'ligf@dehenglaw.com', 'https://www.dehenglaw.com', '争议解决案例1', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 完成
-- ============================================
-- 执行完成后，你应该看到所有表都已创建
-- 可以在左侧菜单 "Table Editor" 中查看数据
