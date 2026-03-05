export class CreateConsultationDto {
  title: string
  content: string
  clientName: string
  clientAvatar?: string
}

export class ReplyConsultationDto {
  reply: string
  lawyerId: number
  lawyerName: string
  lawyerAvatar?: string
}
