import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { ConsultationsService } from './consultations.service'
import { CreateConsultationDto, ReplyConsultationDto } from './dto/consultations.dto'
import { Consultation } from './interfaces/consultation.interface'

@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  // 获取咨询列表
  @Get()
  async getConsultations(@Query('userType') userType: string) {
    return {
      code: 200,
      msg: 'success',
      data: await this.consultationsService.getConsultations(userType)
    }
  }

  // 获取咨询详情
  @Get(':id')
  async getConsultationDetail(@Param('id') id: string) {
    return {
      code: 200,
      msg: 'success',
      data: await this.consultationsService.getConsultationDetail(parseInt(id))
    }
  }

  // 创建咨询
  @Post()
  async createConsultation(@Body() createDto: CreateConsultationDto) {
    return {
      code: 200,
      msg: '咨询提交成功',
      data: await this.consultationsService.createConsultation(createDto)
    }
  }

  // 回复咨询
  @Post(':id/reply')
  async replyConsultation(
    @Param('id') id: string,
    @Body() replyDto: ReplyConsultationDto
  ) {
    return {
      code: 200,
      msg: '回复成功',
      data: await this.consultationsService.replyConsultation(
        parseInt(id),
        replyDto
      )
    }
  }
}
