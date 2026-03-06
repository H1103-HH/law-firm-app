import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 管理员登录
  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    try {
      const { username, password } = loginDto;

      if (!username || !password) {
        return {
          code: 400,
          msg: '用户名和密码不能为空',
          data: null,
        };
      }

      const admin = await this.adminService.login(username, password);

      if (!admin) {
        return {
          code: 401,
          msg: '用户名或密码错误',
          data: null,
        };
      }

      return {
        code: 200,
        msg: '登录成功',
        data: {
          ...admin,
          token: `admin_${admin.id}_${Date.now()}`, // 简单的 token 生成
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          code: 500,
          msg: error.message || '登录失败',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 创建默认管理员（初始化接口）
  @Post('init')
  async init() {
    try {
      await this.adminService.createDefaultAdmin();
      return {
        code: 200,
        msg: '初始化成功',
        data: {
          username: 'admin',
          password: 'admin123',
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          code: 500,
          msg: error.message || '初始化失败',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 获取管理员列表
  @Get('list')
  async findAll() {
    try {
      const data = await this.adminService.findAll();
      return {
        code: 200,
        msg: '查询成功',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          code: 500,
          msg: error.message || '查询管理员列表失败',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
