// 合伙人数据配置
// 在这里添加或修改律师信息

export interface Partner {
  id: number
  name: string           // 姓名
  title: string          // 职务（如：高级合伙人、合伙人等）
  avatar: string         // 头像图片URL
  location: string       // 所在城市
  specialties: string[]  // 专业领域
  experience: string     // 从业年限
  education: string      // 教育背景
  description: string    // 个人简介
  achievements: string[] // 荣誉成就
}

export const partners: Partner[] = [
  {
    id: 1,
    name: '张律师',
    title: '高级合伙人',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    location: '北京',
    specialties: ['公司法', '合同纠纷', '知识产权'],
    experience: '20年',
    education: '清华大学法学院博士',
    description: '专注于公司法、并购重组、知识产权等领域的法律服务，曾为多家知名企业提供法律顾问服务。',
    achievements: [
      '成功完成50+起重大并购案',
      '中国优秀律师',
      '公司法领域权威专家'
    ]
  },
  {
    id: 2,
    name: '李律师',
    title: '合伙人',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    location: '上海',
    specialties: ['婚姻家庭', '继承纠纷', '民事侵权'],
    experience: '15年',
    education: '北京大学法学院硕士',
    description: '专注于婚姻家庭、继承纠纷等民事法律服务，拥有丰富的诉讼经验。',
    achievements: [
      '成功处理500+起婚姻家庭案件',
      '上海市优秀女律师',
      '民事法律专家'
    ]
  },
  {
    id: 3,
    name: '王律师',
    title: '合伙人',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    location: '深圳',
    specialties: ['刑事辩护', '行政诉讼', '劳动争议'],
    experience: '18年',
    education: '中国政法大学硕士',
    description: '专注于刑事辩护、行政诉讼等领域，具有深厚的法律功底和丰富的实务经验。',
    achievements: [
      '成功辩护100+起刑事案件',
      '广东省优秀刑事辩护律师',
      '刑法领域权威专家'
    ]
  },
  {
    id: 4,
    name: '陈律师',
    title: '合伙人',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    location: '香港',
    specialties: ['国际贸易', '跨境投资', '海商法'],
    experience: '22年',
    education: '香港大学法学院博士',
    description: '专注于国际贸易、跨境投资、海商法等国际法律业务，熟悉多国法律体系。',
    achievements: [
      '成功处理200+起国际贸易纠纷',
      '国际知名海商法律师',
      '跨国企业法律顾问'
    ]
  },
  {
    id: 5,
    name: '刘律师',
    title: '资深合伙人',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    location: '纽约',
    specialties: ['国际并购', '跨境金融', '证券法'],
    experience: '25年',
    education: '哈佛法学院博士',
    description: '专注于国际并购、跨境金融、证券法等领域，为跨国企业提供全方位法律服务。',
    achievements: [
      '主导100+起国际并购案',
      '美国顶级并购律师',
      '华尔街金融法律权威'
    ]
  },
  {
    id: 6,
    name: '赵律师',
    title: '合伙人',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    location: '伦敦',
    specialties: ['欧盟法', '国际仲裁', '合规'],
    experience: '20年',
    education: '牛津大学法学硕士',
    description: '专注于欧盟法、国际仲裁等领域，在国际仲裁界享有盛誉。',
    achievements: [
      '成功处理150+起国际仲裁案',
      '伦敦国际仲裁院仲裁员',
      '欧盟法领域权威专家'
    ]
  }
]

// 根据ID查找律师
export const getPartnerById = (id: number): Partner | undefined => {
  return partners.find(partner => partner.id === id)
}
