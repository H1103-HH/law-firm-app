import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import type { Admin } from '@/storage/database/shared/schema';
import * as crypto from 'crypto';

@Injectable()
export class AdminService {
  private client = getSupabaseClient();

  // 简单的密码哈希（实际项目中应该使用 bcrypt）
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  // 管理员登录
  async login(username: string, password: string): Promise<Admin | null> {
    const hashedPassword = this.hashPassword(password);

    const { data, error } = await this.client
      .from('admins')
      .select('*')
      .eq('username', username)
      .eq('password', hashedPassword)
      .single();

    if (error || !data) {
      return null;
    }

    // 返回不包含密码的管理员信息
    const { password: _, ...adminWithoutPassword } = data;
    return adminWithoutPassword as Admin;
  }

  // 创建默认管理员（仅用于初始化）
  async createDefaultAdmin(): Promise<void> {
    const { data: existing } = await this.client
      .from('admins')
      .select('id')
      .eq('username', 'admin')
      .single();

    if (existing) {
      console.log('默认管理员已存在，跳过创建');
      return;
    }

    const { error } = await this.client
      .from('admins')
      .insert({
        username: 'admin',
        password: this.hashPassword('admin123'),
        name: '超级管理员',
      });

    if (error) {
      console.error('创建默认管理员失败:', error);
      throw new Error('创建默认管理员失败');
    }

    console.log('✅ 默认管理员创建成功');
    console.log('   用户名: admin');
    console.log('   密码: admin123');
    console.log('   请及时修改密码！');
  }

  // 获取管理员列表
  async findAll(): Promise<Admin[]> {
    const { data, error } = await this.client
      .from('admins')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw new Error(`查询管理员列表失败: ${error.message}`);
    }

    // 移除密码字段
    return (data || []).map(({ password: _, ...admin }) => admin as Admin);
  }
}
