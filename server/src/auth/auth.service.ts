import { Injectable } from '@nestjs/common'
import { LoginDto } from './dto/auth.dto'
import { User } from './interfaces/user.interface'

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto): Promise<User> {
    // 这里应该调用微信 API 获取用户信息
    // 模拟实现
    const mockUser: User = {
      id: 1,
      openid: 'mock_openid_' + Date.now(),
      unionid: 'mock_unionid',
      nickname: loginDto.role === 'client' ? '张三' : '张律师',
      avatar: loginDto.role === 'client'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'
        : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
      role: loginDto.role,
      token: 'mock_token_' + Date.now(),
      name: loginDto.role === 'client' ? '张三' : '张律师',
      title: loginDto.role === 'client' ? undefined : '高级合伙人'
    }

    return mockUser
  }
}
