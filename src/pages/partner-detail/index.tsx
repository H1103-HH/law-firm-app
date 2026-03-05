import { View, Text, ScrollView, Image, Button } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { Phone, Mail, Globe, Award, GraduationCap, Briefcase } from 'lucide-react-taro'
import type { FC } from 'react'
import './index.css'

// 合伙人详细数据
const partnerDetails: Record<number, any> = {
  1: {
    id: 1,
    name: '张律师',
    title: '高级合伙人',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=600&fit=crop&crop=face',
    location: '北京',
    phone: '138-0000-0001',
    email: 'zhang@lawfirm.com',
    specialties: ['公司法', '合同纠纷', '知识产权'],
    experience: '20年',
    education: '清华大学法学院博士',
    description: '专注于公司法、并购重组、知识产权等领域的法律服务，曾为多家知名企业提供法律顾问服务。在公司法领域具有深厚的理论功底和丰富的实务经验，成功处理了众多重大复杂案件。',
    achievements: [
      '成功完成50+起重大并购案，涉及金额超过500亿元',
      '中国优秀律师，2023年度公司法领域权威专家',
      '担任多家500强企业法律顾问',
      '在国内外核心期刊发表论文30余篇'
    ],
    cases: [
      '某大型国企并购案',
      '跨国公司知识产权纠纷案',
      '上市公司重组案',
      '大型基础设施建设投融资项目'
    ]
  },
  2: {
    id: 2,
    name: '李律师',
    title: '合伙人',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop&crop=face',
    location: '上海',
    phone: '138-0000-0002',
    email: 'li@lawfirm.com',
    specialties: ['婚姻家庭', '继承纠纷', '民事侵权'],
    experience: '15年',
    education: '北京大学法学院硕士',
    description: '专注于婚姻家庭、继承纠纷等民事法律服务，拥有丰富的诉讼经验。擅长处理复杂的家庭财产分割、抚养权争议等案件，以细腻的法律思维和出色的调解能力著称。',
    achievements: [
      '成功处理500+起婚姻家庭案件，调解成功率高达90%',
      '上海市优秀女律师，2022年度民事法律专家',
      '上海市婚姻家庭法研究会理事',
      '编写《婚姻家庭法律实务指南》'
    ],
    cases: [
      '复杂家庭财产分割案',
      '跨境抚养权争议案',
      '遗嘱继承纠纷案',
      '大额财产赠与纠纷案'
    ]
  },
  3: {
    id: 3,
    name: '王律师',
    title: '合伙人',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop&crop=face',
    location: '深圳',
    phone: '138-0000-0003',
    email: 'wang@lawfirm.com',
    specialties: ['刑事辩护', '行政诉讼', '劳动争议'],
    experience: '18年',
    education: '中国政法大学硕士',
    description: '专注于刑事辩护、行政诉讼等领域，具有深厚的法律功底和丰富的实务经验。在刑事辩护领域成绩斐然，成功为多名当事人争取到无罪或从轻判决。',
    achievements: [
      '成功辩护100+起刑事案件，无罪判决率达15%',
      '广东省优秀刑事辩护律师',
      '中国刑法学研究会会员',
      '深圳大学法学院客座教授'
    ],
    cases: [
      '重大经济犯罪辩护案',
      '职务犯罪辩护案',
      '行政诉讼胜诉案',
      '重大劳动争议仲裁案'
    ]
  },
  4: {
    id: 4,
    name: '陈律师',
    title: '合伙人',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=600&fit=crop&crop=face',
    location: '香港',
    phone: '852-1234-5678',
    email: 'chen@lawfirm.com',
    specialties: ['国际贸易', '跨境投资', '海商法'],
    experience: '22年',
    education: '香港大学法学院博士',
    description: '专注于国际贸易、跨境投资、海商法等国际法律业务，熟悉多国法律体系。在处理复杂的国际商事纠纷方面经验丰富，是多家跨国企业的首选法律顾问。',
    achievements: [
      '成功处理200+起国际贸易纠纷，涉及40多个国家和地区',
      '国际知名海商法律师，2021年度仲裁专家',
      '香港律师会国际商事争议解决委员会成员',
      '在《国际商事仲裁》等权威期刊发表论文'
    ],
    cases: [
      '跨国贸易仲裁案',
      '海损赔偿纠纷案',
      '国际投资争议案',
      '跨境并购合规案'
    ]
  },
  5: {
    id: 5,
    name: '刘律师',
    title: '资深合伙人',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face',
    location: '纽约',
    phone: '+1-212-555-0100',
    email: 'liu@lawfirm.com',
    specialties: ['国际并购', '跨境金融', '证券法'],
    experience: '25年',
    education: '哈佛法学院博士',
    description: '专注于国际并购、跨境金融、证券法等领域，为跨国企业提供全方位法律服务。曾主导多起影响重大的国际并购项目，是全球并购领域的权威专家。',
    achievements: [
      '主导100+起国际并购案，累计交易金额超过1000亿美元',
      '美国顶级并购律师，2020年度交易专家',
      '华尔街并购圈权威人士',
      '《并购实务》畅销书作者'
    ],
    cases: [
      '中国企业收购美国科技公司案',
      '跨国银行并购案',
      '上市公司私有化案',
      '跨境投资基金设立案'
    ]
  },
  6: {
    id: 6,
    name: '赵律师',
    title: '合伙人',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop&crop=face',
    location: '伦敦',
    phone: '+44-20-7123-4567',
    email: 'zhao@lawfirm.com',
    specialties: ['欧盟法', '国际仲裁', '合规咨询'],
    experience: '20年',
    education: '牛津大学法学硕士',
    description: '专注于欧盟法、国际仲裁等领域，在国际仲裁界享有盛誉。曾担任伦敦国际仲裁院仲裁员，处理过多起复杂的国际商事争议。',
    achievements: [
      '成功处理150+起国际仲裁案，胜诉率达80%',
      '伦敦国际仲裁院仲裁员',
      '欧盟法领域权威专家，英国律师协会会员',
      '牛津大学法学院客座讲师'
    ],
    cases: [
      '国际能源仲裁案',
      '跨境工程争议案',
      '欧盟合规审查案',
      '国际投资仲裁案'
    ]
  }
}

const PartnerDetailPage: FC = () => {
  const [partner, setPartner] = useState<any>(null)

  useLoad((options) => {
    const partnerId = options?.id ? parseInt(options.id) : 1
    const partnerData = partnerDetails[partnerId] || partnerDetails[1]
    setPartner(partnerData)
    console.log('合伙人详情页加载:', partnerData.name)
  })

  // 拨打电话
  const handleCall = (phone: string) => {
    Taro.makePhoneCall({
      phoneNumber: phone.replace(/-/g, '').replace(/\+/g, '')
    })
  }

  // 复制邮箱
  const handleCopyEmail = (email: string) => {
    Taro.setClipboardData({
      data: email,
      success: () => {
        Taro.showToast({
          title: '邮箱已复制',
          icon: 'success'
        })
      }
    })
  }

  if (!partner) {
    return (
      <View className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Text className="block text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-100">
      <ScrollView scrollY className="h-full">
        {/* 头部信息卡片 */}
        <View className="bg-gradient-to-br from-green-900 to-green-800 rounded-b-3xl pt-8 pb-6 px-6 mb-4">
          <View className="flex items-start gap-5">
            {/* 头像 */}
            <Image
              className="w-24 h-24 rounded-full object-cover border-4 border-white/20 flex-shrink-0"
              src={partner.avatar}
              mode="aspectFill"
            />

            {/* 基本信息 */}
            <View className="flex-1 pt-2">
              <Text className="block text-2xl font-bold text-white mb-2">
                {partner.name}
              </Text>
              <Text className="block text-base font-medium text-green-100 mb-1">
                {partner.title}
              </Text>
              <View className="flex items-center gap-2 mt-2">
                <Globe className="w-4 h-4 text-green-200" />
                <Text className="text-sm text-green-200">{partner.location}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4 pb-6">
          {/* 联系方式 */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="block text-base font-bold text-gray-900 mb-4">
              联系方式
            </Text>
            <View className="space-y-3">
              <View className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-3">
                <Phone className="w-5 h-5 text-green-700" />
                <View className="flex-1">
                  <Text className="block text-sm text-gray-500 mb-0.5">电话</Text>
                  <Text className="block text-base text-green-700">{partner.phone}</Text>
                </View>
                <Button
                  size="mini"
                  type="primary"
                  onClick={() => handleCall(partner.phone)}
                >
                  拨打
                </Button>
              </View>
              <View className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-3">
                <Mail className="w-5 h-5 text-green-600" />
                <View className="flex-1">
                  <Text className="block text-sm text-gray-500 mb-0.5">邮箱</Text>
                  <Text className="block text-base text-green-600">{partner.email}</Text>
                </View>
                <Button
                  size="mini"
                  type="primary"
                  onClick={() => handleCopyEmail(partner.email)}
                >
                  复制
                </Button>
              </View>
            </View>
          </View>

          {/* 专业信息 */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="block text-base font-bold text-gray-900 mb-4">
              专业信息
            </Text>
            <View className="space-y-3">
              <View className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <View className="flex-1">
                  <Text className="block text-sm text-gray-500 mb-0.5">教育背景</Text>
                  <Text className="block text-base text-gray-900">{partner.education}</Text>
                </View>
              </View>
              <View className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <View className="flex-1">
                  <Text className="block text-sm text-gray-500 mb-0.5">从业经验</Text>
                  <Text className="block text-base text-gray-900">{partner.experience}</Text>
                </View>
              </View>
              <View className="flex items-start gap-3">
                <Award className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <View className="flex-1">
                  <Text className="block text-sm text-gray-500 mb-0.5">专长领域</Text>
                  <View className="flex flex-wrap gap-2 mt-1">
                    {partner.specialties.map((specialty: string, index: number) => (
                      <View
                        key={index}
                        className="bg-green-50 text-green-900 px-3 py-1 rounded-full"
                      >
                        <Text className="text-xs font-medium">{specialty}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* 个人简介 */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="block text-base font-bold text-gray-900 mb-3">
              个人简介
            </Text>
            <Text className="block text-sm text-gray-600 leading-relaxed">
              {partner.description}
            </Text>
          </View>

          {/* 主要成就 */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="block text-base font-bold text-gray-900 mb-3">
              主要成就
            </Text>
            <View className="space-y-2">
              {partner.achievements.map((achievement: string, index: number) => (
                <View key={index} className="flex items-start gap-2">
                  <View className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                  <Text className="block text-sm text-gray-600 flex-1">
                    {achievement}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 代表案例 */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="block text-base font-bold text-gray-900 mb-3">
              代表案例
            </Text>
            <View className="space-y-2">
              {partner.cases.map((caseItem: string, index: number) => (
                <View key={index} className="flex items-start gap-2">
                  <View className="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0 mt-2" />
                  <Text className="block text-sm text-gray-600 flex-1">
                    {caseItem}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 底部留白 */}
        <View className="h-6" />
      </ScrollView>
    </View>
  )
}

export default PartnerDetailPage
