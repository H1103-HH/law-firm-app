import { Injectable } from '@nestjs/common'
import { LoginDto } from './dto/auth.dto'
import { User } from './interfaces/user.interface'
import { getSupabaseClient } from '../storage/database/supabase-client'

@Injectable()
export class AuthService {
  private client = getSupabaseClient()

  async login(loginDto: LoginDto): Promise<User> {
    // TODO: 使用 code 调用微信 API 获取 openid 和 unionid
    // 由于没有配置微信小程序的 appId 和 appSecret，这里暂时模拟
    const openid = `mock_openid_${loginDto.code}_${Date.now()}`
    const unionid = `mock_unionid_${Date.now()}`

    // 查询用户是否已存在
    const { data: existingUsers, error: queryError } = await this.client
      .from('users')
      .select('*')
      .eq('openid', openid)
      .limit(1)

    if (queryError) {
      throw new Error(`查询用户失败: ${queryError.message}`)
    }

    let user

    if (existingUsers && existingUsers.length > 0) {
      // 用户已存在，更新用户信息
      user = existingUsers[0]
      if (loginDto.nickname || loginDto.avatar) {
        const { error: updateError } = await this.client
          .from('users')
          .update({
            nickname: loginDto.nickname || user.nickname,
            avatar: loginDto.avatar || user.avatar,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)

        if (updateError) {
          throw new Error(`更新用户失败: ${updateError.message}`)
        }
      }
    } else {
      // 用户不存在，创建新用户
      const { data: newUser, error: insertError } = await this.client
        .from('users')
        .insert({
          openid,
          unionid,
          nickname: loginDto.nickname || (loginDto.role === 'client' ? '客户' : '合伙人'),
          avatar: loginDto.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
          role: loginDto.role,
        })
        .select()
        .single()

      if (insertError) {
        throw new Error(`创建用户失败: ${insertError.message}`)
      }

      user = newUser
    }

    // 生成 token（简单实现，生产环境应使用 JWT）
    const token = `token_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`

    // 返回用户信息
    return {
      id: user.id,
      openid: user.openid,
      unionid: user.unionid || undefined,
      nickname: user.nickname || '用户',
      avatar: user.avatar || '',
      role: user.role as 'client' | 'partner',
      token,
    }
  }
}
