import { Controller, Get, Post, Delete, Body, Query, Headers } from '@nestjs/common'
import { ViewedLawyersService } from './viewed-lawyers.service'

@Controller('viewed-lawyers')
export class ViewedLawyersController {
  constructor(
    private readonly viewedLawyersService: ViewedLawyersService,
  ) {}

  /**
   * 从 token 获取用户信息
   */
  private getUserFromToken(token: string): number | null {
    try {
      // token 格式: token_{userId}_{randomString}
      // 解析出 userId
      const parts = token.split('_')
      if (parts.length >= 2 && parts[0] === 'token') {
        const userId = parseInt(parts[1])
        if (!isNaN(userId)) {
          return userId
        }
      }
      return null
    } catch (error) {
      console.error('解析 token 失败:', error)
      return null
    }
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

      const userId = this.getUserFromToken(token)
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

      const userId = this.getUserFromToken(token)
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

      const userId = this.getUserFromToken(token)
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
