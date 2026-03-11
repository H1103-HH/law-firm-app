import { Controller, Get, Post, Delete, Body, Query, Headers } from '@nestjs/common'
import { ViewedLawyersService } from './viewed-lawyers.service'
import { getSupabaseClient } from '@/storage/database/supabase-client'

@Controller('viewed-lawyers')
export class ViewedLawyersController {
  constructor(
    private readonly viewedLawyersService: ViewedLawyersService,
  ) {}

  /**
   * 从 token 获取用户信息
   */
  private async getUserFromToken(token: string) {
    const client = getSupabaseClient()

    // 暂时使用用户 openid 来查找用户
    // 由于当前 token 格式简单，我们假设需要通过其他方式获取 userId
    // 为了演示功能，我们查询第一个用户（实际应用中应该使用 proper JWT）

    // 这里返回第一个用户的 ID 作为测试
    const { data: users, error } = await client
      .from('users')
      .select('id')
      .limit(1)

    if (error || !users || users.length === 0) {
      return null
    }

    return users[0].id
  }

  /**
   * 记录浏览历史
   */
  @Post('record')
  async recordView(
    @Body() body: { lawyerId: number },
    @Headers('authorization') authHeader: string,
  ) {
    try {
      const token = authHeader?.replace('Bearer ', '')
      if (!token) {
        return {
          code: 401,
          msg: '未登录',
          data: null
        }
      }

      const userId = await this.getUserFromToken(token)
      if (!userId) {
        return {
          code: 401,
          msg: '用户不存在',
          data: null
        }
      }

      await this.viewedLawyersService.recordView(userId, body.lawyerId)

      return {
        code: 200,
        msg: '记录成功',
        data: null
      }
    } catch (error: any) {
      console.error('记录浏览历史失败:', error)
      return {
        code: 500,
        msg: error.message || '记录失败',
        data: null
      }
    }
  }

  /**
   * 获取浏览历史
   */
  @Get()
  async getViewHistory(
    @Query('limit') limit: string = '20',
    @Headers('authorization') authHeader: string,
  ) {
    try {
      const token = authHeader?.replace('Bearer ', '')
      if (!token) {
        return {
          code: 401,
          msg: '未登录',
          data: []
        }
      }

      const userId = await this.getUserFromToken(token)
      if (!userId) {
        return {
          code: 401,
          msg: '用户不存在',
          data: []
        }
      }

      const history = await this.viewedLawyersService.getViewHistory(
        userId,
        parseInt(limit) || 20
      )

      return {
        code: 200,
        msg: 'success',
        data: history
      }
    } catch (error: any) {
      console.error('获取浏览历史失败:', error)
      return {
        code: 500,
        msg: error.message || '获取失败',
        data: []
      }
    }
  }

  /**
   * 清除浏览历史
   */
  @Delete()
  async clearViewHistory(@Headers('authorization') authHeader: string) {
    try {
      const token = authHeader?.replace('Bearer ', '')
      if (!token) {
        return {
          code: 401,
          msg: '未登录',
          data: null
        }
      }

      const userId = await this.getUserFromToken(token)
      if (!userId) {
        return {
          code: 401,
          msg: '用户不存在',
          data: null
        }
      }

      await this.viewedLawyersService.clearViewHistory(userId)

      return {
        code: 200,
        msg: '清除成功',
        data: null
      }
    } catch (error: any) {
      console.error('清除浏览历史失败:', error)
      return {
        code: 500,
        msg: error.message || '清除失败',
        data: null
      }
    }
  }
}
