import { Controller, Get, Post, Delete, Body, Query, Headers } from '@nestjs/common'
import { SavedCardsService } from './saved-cards.service'

@Controller('saved-cards')
export class SavedCardsController {
  constructor(
    private readonly savedCardsService: SavedCardsService,
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
   * 收藏名片
   */
  @Post('save')
  async saveCard(
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

      const result = await this.savedCardsService.saveCard(userId, body.lawyerId)

      return {
        code: 200,
        msg: result.alreadySaved ? '已收藏过' : '收藏成功',
        data: { alreadySaved: result.alreadySaved }
      }
    } catch (error: any) {
      console.error('收藏名片失败:', error)
      return {
        code: 500,
        msg: error.message || '收藏失败',
        data: null
      }
    }
  }

  /**
   * 获取收藏名片列表
   */
  @Get()
  async getSavedCards(
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

      const cards = await this.savedCardsService.getSavedCards(
        userId,
        parseInt(limit) || 20
      )

      return {
        code: 200,
        msg: 'success',
        data: cards
      }
    } catch (error: any) {
      console.error('获取收藏名片失败:', error)
      return {
        code: 500,
        msg: error.message || '获取失败',
        data: []
      }
    }
  }

  /**
   * 取消收藏名片（POST接口，兼容前端）
   */
  @Post('unsave')
  async unsaveCardByPost(
    @Body() body: { lawyerId: number },
    @Headers('authorization') authHeader: string,
  ) {
    return this.unsaveCard(body, authHeader)
  }

  /**
   * 取消收藏名片（DELETE接口）
   */
  @Delete()
  async unsaveCard(
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

      await this.savedCardsService.unsaveCard(userId, body.lawyerId)

      return {
        code: 200,
        msg: '取消收藏成功',
        data: null
      }
    } catch (error: any) {
      console.error('取消收藏失败:', error)
      return {
        code: 500,
        msg: error.message || '取消收藏失败',
        data: null
      }
    }
  }

  /**
   * 检查是否已收藏
   */
  @Get('check')
  async isSaved(
    @Query('lawyerId') lawyerId: string,
    @Headers('authorization') authHeader: string,
  ) {
    try {
      const token = authHeader?.replace('Bearer ', '')
      if (!token) {
        return {
          code: 401,
          msg: '未登录',
          data: { saved: false }
        }
      }

      const userId = this.getUserFromToken(token)
      if (!userId) {
        return {
          code: 401,
          msg: '用户不存在',
          data: { saved: false }
        }
      }

      const result = await this.savedCardsService.isSaved(
        userId,
        parseInt(lawyerId)
      )

      return {
        code: 200,
        msg: 'success',
        data: { saved: result }
      }
    } catch (error: any) {
      console.error('查询收藏状态失败:', error)
      return {
        code: 500,
        msg: error.message || '查询失败',
        data: { saved: false }
      }
    }
  }
}
