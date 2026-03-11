export interface Consultation {
  id: number
  title: string
  content: string
  status: 'pending' | 'replied'
  createTime: string
  clientName: string
  clientAvatar: string
  lawyerId?: number
  lawyerName?: string
  lawyerAvatar?: string
  reply?: string
  replyTime?: string
}
