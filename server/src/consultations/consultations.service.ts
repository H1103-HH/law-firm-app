import { Injectable } from '@nestjs/common'
import { CreateConsultationDto, ReplyConsultationDto } from './dto/consultations.dto'
import { Consultation } from './interfaces/consultation.interface'

@Injectable()
export class ConsultationsService {
  // 模拟数据库数据
  private consultations: Consultation[] = [
    {
      id: 1,
      title: '关于公司注册的咨询',
      content: '您好，我想咨询一下公司注册的相关流程和需要准备的材料。',
      status: 'replied',
      createTime: '2024-03-01 10:30',
      clientName: '张三',
      clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      lawyerId: 1,
      lawyerName: '张律师',
      lawyerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
      reply: '您好，公司注册需要准备以下材料：1. 公司章程 2. 股东身份证明 3. 注册地址证明等。',
      replyTime: '2024-03-01 14:20'
    },
    {
      id: 2,
      title: '劳动合同纠纷咨询',
      content: '我想咨询一下劳动合同解除的相关法律问题。',
      status: 'pending',
      createTime: '2024-03-05 09:15',
      clientName: '张三',
      clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      title: '房产纠纷咨询',
      content: '您好，我遇到了房产纠纷问题，想咨询一下如何处理。',
      status: 'pending',
      createTime: '2024-03-06 11:20',
      clientName: '李四',
      clientAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop'
    }
  ]

  async getConsultations(userType?: string) {
    // 根据用户类型返回不同的数据
    if (userType === 'client') {
      // 客户只能看到自己的咨询
      return this.consultations.filter((c) => c.clientName === '张三')
    } else if (userType === 'partner') {
      // 合伙人可以看到所有咨询（实际应该根据律师ID过滤）
      return this.consultations
    }
    return this.consultations
  }

  async getConsultationDetail(id: number) {
    const consultation = this.consultations.find((c) => c.id === id)
    if (!consultation) {
      throw new Error('Consultation not found')
    }
    return consultation
  }

  async createConsultation(createDto: CreateConsultationDto) {
    const newConsultation: Consultation = {
      id: this.consultations.length + 1,
      title: createDto.title,
      content: createDto.content,
      status: 'pending',
      createTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      clientName: '张三',
      clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    }
    this.consultations.push(newConsultation)
    return newConsultation
  }

  async replyConsultation(id: number, replyDto: ReplyConsultationDto) {
    const consultation = this.consultations.find((c) => c.id === id)
    if (!consultation) {
      throw new Error('Consultation not found')
    }
    consultation.status = 'replied'
    consultation.reply = replyDto.reply
    consultation.replyTime = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
    consultation.lawyerId = 1
    consultation.lawyerName = '张律师'
    consultation.lawyerAvatar =
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop'
    return consultation
  }
}
