import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { LawyerService } from './lawyer.service';
import type { InsertLawyer, UpdateLawyer } from '@/storage/database/shared/schema';

@Controller('lawyers')
export class LawyerController {
  constructor(private readonly lawyerService: LawyerService) {}

  // 获取所有律师
  @Get()
  async findAll() {
    try {
      const data = await this.lawyerService.findAll();
      return {
        code: 200,
        msg: '查询成功',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          code: 500,
          msg: error.message || '查询律师列表失败',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 获取单个律师详情
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.lawyerService.findOne(Number(id));
      if (!data) {
        return {
          code: 404,
          msg: '律师不存在',
          data: null,
        };
      }
      return {
        code: 200,
        msg: '查询成功',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          code: 500,
          msg: error.message || '查询律师详情失败',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 创建律师
  @Post()
  async create(@Body() lawyer: InsertLawyer) {
    try {
      const data = await this.lawyerService.create(lawyer);
      return {
        code: 200,
        msg: '创建成功',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          code: 500,
          msg: error.message || '创建律师失败',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 更新律师
  @Put(':id')
  async update(@Param('id') id: string, @Body() lawyer: UpdateLawyer) {
    try {
      const data = await this.lawyerService.update(Number(id), lawyer);
      return {
        code: 200,
        msg: '更新成功',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          code: 500,
          msg: error.message || '更新律师失败',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 删除律师
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.lawyerService.remove(Number(id));
      return {
        code: 200,
        msg: '删除成功',
        data: null,
      };
    } catch (error) {
      throw new HttpException(
        {
          code: 500,
          msg: error.message || '删除律师失败',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
