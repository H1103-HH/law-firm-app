import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '@/storage/database/supabase-client'

export interface ViewedLawyerWithDetails {
  id: number
  lawyerId: number
  userId: number
  viewedAt: string
  lawyer?: {
    id: number
    name: string
    title: string
    avatar: string
    location: string
    specialties: string
  }
}

@Injectable()
export class ViewedLawyersService {
  private client = getSupabaseClient()

  /**
   * 记录浏览历史
   */
  async recordView(userId: number, lawyerId: number) {
    try {
      // 检查是否已经记录过
      const { data: existing, error: queryError } = await this.client
        .from('viewed_lawyers')
        .select('*')
        .eq('user_id', userId)
        .eq('lawyer_id', lawyerId)
        .limit(1)

      if (queryError) {
        throw new Error(`查询浏览记录失败: ${queryError.message}`)
      }

      if (existing && existing.length > 0) {
        // 如果已存在，更新浏览时间
        const { error: updateError } = await this.client
          .from('viewed_lawyers')
          .update({ viewed_at: new Date().toISOString() })
          .eq('id', existing[0].id)

        if (updateError) {
          throw new Error(`更新浏览记录失败: ${updateError.message}`)
        }
      } else {
        // 如果不存在，插入新记录
        const { error: insertError } = await this.client
          .from('viewed_lawyers')
          .insert({
            user_id: userId,
            lawyer_id: lawyerId,
          })

        if (insertError) {
          throw new Error(`创建浏览记录失败: ${insertError.message}`)
        }
      }

      return { success: true }
    } catch (error) {
      console.error('记录浏览历史失败:', error)
      throw error
    }
  }

  /**
   * 获取用户的浏览历史（最近查看的律师）
   */
  async getViewHistory(userId: number, limit: number = 20) {
    try {
      const { data, error } = await this.client
        .from('viewed_lawyers')
        .select(`
          id,
          lawyer_id,
          user_id,
          viewed_at,
          lawyers (
            id,
            name,
            title,
            avatar,
            location,
            specialties
          )
        `)
        .eq('user_id', userId)
        .order('viewed_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(`查询浏览历史失败: ${error.message}`)
      }

      // 格式化返回数据
      const formattedData = (data || []).map((item: any) => ({
        id: item.id,
        lawyerId: item.lawyer_id,
        userId: item.user_id,
        viewedAt: item.viewed_at,
        lawyer: item.lawyers && Array.isArray(item.lawyers) ? {
          id: item.lawyers[0]?.id,
          name: item.lawyers[0]?.name,
          title: item.lawyers[0]?.title,
          avatar: item.lawyers[0]?.avatar,
          location: item.lawyers[0]?.location,
          specialties: item.lawyers[0]?.specialties,
        } : undefined,
      }))

      return formattedData as ViewedLawyerWithDetails[]
    } catch (error) {
      console.error('获取浏览历史失败:', error)
      return []
    }
  }

  /**
   * 清除指定用户的浏览历史
   */
  async clearViewHistory(userId: number) {
    try {
      const { error } = await this.client
        .from('viewed_lawyers')
        .delete()
        .eq('user_id', userId)

      if (error) {
        throw new Error(`清除浏览历史失败: ${error.message}`)
      }

      return { success: true }
    } catch (error) {
      console.error('清除浏览历史失败:', error)
      throw error
    }
  }
}
