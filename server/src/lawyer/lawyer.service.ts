import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import type { Lawyer, InsertLawyer, UpdateLawyer } from '@/storage/database/shared/schema';

@Injectable()
export class LawyerService {
  private client = getSupabaseClient();

  // 获取所有律师
  async findAll(): Promise<Lawyer[]> {
    const { data, error } = await this.client
      .from('lawyers')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (error) {
      throw new Error(`查询律师列表失败: ${error.message}`);
    }

    return data || [];
  }

  // 根据ID获取律师
  async findOne(id: number): Promise<Lawyer | null> {
    const { data, error } = await this.client
      .from('lawyers')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      throw new Error(`查询律师失败: ${error.message}`);
    }

    return data;
  }

  // 创建律师
  async create(lawyer: InsertLawyer): Promise<Lawyer> {
    const { data, error } = await this.client
      .from('lawyers')
      .insert(lawyer)
      .select()
      .single();

    if (error) {
      throw new Error(`创建律师失败: ${error.message}`);
    }

    return data;
  }

  // 更新律师
  async update(id: number, lawyer: UpdateLawyer): Promise<Lawyer> {
    const { data, error } = await this.client
      .from('lawyers')
      .update({
        ...lawyer,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`更新律师失败: ${error.message}`);
    }

    return data;
  }

  // 删除律师（软删除）
  async remove(id: number): Promise<void> {
    const { error } = await this.client
      .from('lawyers')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw new Error(`删除律师失败: ${error.message}`);
    }
  }
}
