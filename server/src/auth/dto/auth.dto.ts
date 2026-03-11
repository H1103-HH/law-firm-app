export class LoginDto {
  code: string
  role: 'client' | 'partner'
  nickname?: string
  avatar?: string
}
