export interface User {
  id: number
  openid: string
  unionid?: string
  nickname?: string
  avatar?: string
  role: 'client' | 'partner'
  token: string
  name?: string
  title?: string
}
