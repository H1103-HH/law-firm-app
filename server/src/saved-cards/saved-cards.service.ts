import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '@/storage/database/supabase-client'

export interface SavedCardWithDetails {
  id: number
  lawyerId: number
  userId: number
  savedAt: string
  lawyer?: {
    id: number
    name: string
    title: string
    avatar: string
    location: string
    phone?: string
    email?: string
  }
}

@Injectable()
export class SavedCardsService {
  private client = getSupabaseClient()

  /**
   * 收藏名片
   */
  async saveCard(userId: number, lawyerId: number) {
    try {
      // 检查是否已经收藏过
      const { data: existing, error: queryError } = await this.client
        .from('saved_cards')
        .select('*')
        .eq('user_id', userId)
        .eq('lawyer_id', lawyerId)
        .limit(1)

      if (queryError) {
        throw new Error(`查询收藏记录失败: ${queryError.message}`)
      }

      if (existing && existing.length > 0) {
        // 已经收藏过
        return { success: true, alreadySaved: true }
      }

      // 插入新记录
      const { error: insertError } = await this.client
        .from('saved_cards')
        .insert({
          user_id: userId,
          lawyer_id: lawyerId,
        })

      if (insertError) {
        throw new Error(`收藏名片失败: ${insertError.message}`)
      }

      return { success: true, alreadySaved: false }
    } catch (error) {
      console.error('收藏名片失败:', error)
      throw error
    }
  }

  /**
   * 获取用户的收藏名片列表
   */
  async getSavedCards(userId: number, limit: number = 20) {
    try {
      const { data, error } = await this.client
        .from('saved_cards')
        .select(`
          id,
          lawyer_id,
          user_id,
          saved_at,
          lawyers (
            id,
            name,
            title,
            avatar,
            location,
            phone,
            email
          )
        `)
        .eq('user_id', userId)
        .order('saved_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(`查询收藏名片失败: ${error.message}`)
      }

      // 格式化返回数据
      const formattedData = (data || []).map((item: any) => ({
        id: item.id,
        lawyerId: item.lawyer_id,
        userId: item.user_id,
        savedAt: item.saved_at,
        lawyer: item.lawyers && Array.isArray(item.lawyers) ? {
          id: item.lawyers[0]?.id,
          name: item.lawyers[0]?.name,
          title: item.lawyers[0]?.title,
          avatar: item.lawyers[0]?.avatar,
          location: item.lawyers[0]?.location,
          phone: item.lawyers[0]?.phone,
          email: item.lawyers[0]?.email,
        } : undefined,
      }))

      return formattedData as SavedCardWithDetails[]
    } catch (error) {
      console.error('获取收藏名片失败:', error)
      return []
    }
  }

  /**
   * 取消收藏名片
   */
  async unsaveCard(userId: number, lawyerId: number) {
    try {
      const { error } = await this.client
        .from('saved_cards')
        .delete()
        .eq('user_id', userId)
        .eq('lawyer_id', lawyerId)

      if (error) {
        throw new Error(`取消收藏失败: ${error.message}`)
      }

      return { success: true }
    } catch (error) {
      console.error('取消收藏失败:', error)
      throw error
    }
  }

  /**
   * 检查是否已收藏
   */
  async isSaved(userId: number, lawyerId: number) {
    try {
      const { data, error } = await this.client
        .from('saved_cards')
        .select('id')
        .eq('user_id', userId)
        .eq('lawyer_id', lawyerId)
        .limit(1)

      if (error) {
        throw new Error(`查询收藏状态失败: ${error.message}`)
      }

      return { saved: data && data.length > 0 }
    } catch (error) {
      console.error('查询收藏状态失败:', error)
      return { saved: false }
    }
  }
}
