import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/auth.dto'
import { User } from './interfaces/user.interface'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 微信登录
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return {
      code: 200,
      msg: '登录成功',
      data: await this.authService.login(loginDto)
    }
  }
}
