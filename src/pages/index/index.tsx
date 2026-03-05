import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { Phone, Mail, MapPin, Award, Building2 } from 'lucide-react-taro'
import type { FC } from 'react'
import './index.css'

// 律师数据类型
interface Lawyer {
  id: number
  name: string
  title: string
  avatar: string
  specialties: string[]
  phone: string
  email: string
  address: string
}

// 模拟律师数据
const lawyers: Lawyer[] = [
  {
    id: 1,
    name: '张律师',
    title: '高级合伙人',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    specialties: ['公司法', '合同纠纷', '知识产权'],
    phone: '138-0000-0001',
    email: 'zhang@example.com',
    address: '北京市朝阳区'
  },
  {
    id: 2,
    name: '李律师',
    title: '合伙人',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    specialties: ['婚姻家庭', '继承纠纷', '民事侵权'],
    phone: '138-0000-0002',
    email: 'li@example.com',
    address: '上海市浦东新区'
  },
  {
    id: 3,
    name: '王律师',
    title: '资深律师',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    specialties: ['刑事辩护', '行政诉讼', '劳动争议'],
    phone: '138-0000-0003',
    email: 'wang@example.com',
    address: '深圳市福田区'
  }
]

// 律所信息
const lawFirm = {
  name: '正义律师事务所',
  description: '专业法律服务平台',
  address: '北京市朝阳区建国门外大街1号',
  phone: '400-800-8888'
}

const IndexPage: FC = () => {
  useLoad(() => {
    console.log('律师名片页面加载')
  })

  // 拨打电话
  const handleCall = (phone: string) => {
    Taro.makePhoneCall({
      phoneNumber: phone.replace(/-/g, '')
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

  return (
    <View className="min-h-screen bg-gray-100">
      <ScrollView scrollY className="h-full">
        <View className="px-4 py-6">
          {/* 律所信息卡片 */}
          <View className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-6 mb-6 shadow-lg">
            <View className="flex items-center gap-3 mb-3">
              <Building2 className="w-6 h-6 text-white" />
              <Text className="block text-lg font-bold text-white">正义律师事务所</Text>
            </View>
            <Text className="block text-sm opacity-90 text-white mb-4">
              专业法律服务平台 · 值得信赖
            </Text>
            <View className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-white opacity-80" />
              <Text className="text-sm text-white opacity-80">{lawFirm.address}</Text>
            </View>
            <View className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-white opacity-80" />
              <Text className="text-sm text-white opacity-80">{lawFirm.phone}</Text>
            </View>
          </View>

          {/* 律师名片列表 */}
          <View className="space-y-4">
            {lawyers.map((lawyer) => (
              <View key={lawyer.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* 律师基本信息 */}
                <View className="p-6">
                  <View className="flex items-start gap-4 mb-4">
                    {/* 律师头像 */}
                    <Image
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-100"
                      src={lawyer.avatar}
                      mode="aspectFill"
                    />

                    {/* 姓名和职位 */}
                    <View className="flex-1">
                      <Text className="block text-xl font-bold text-gray-900 mb-1">
                        {lawyer.name}
                      </Text>
                      <Text className="block text-base font-medium text-gray-600">
                        {lawyer.title}
                      </Text>
                    </View>
                  </View>

                  {/* 专长领域 */}
                  <View className="mb-5">
                    <View className="flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-blue-600" />
                      <Text className="block text-sm font-semibold text-gray-700">专长领域</Text>
                    </View>
                    <View className="flex flex-wrap gap-2">
                      {lawyer.specialties.map((specialty, index) => (
                        <View
                          key={index}
                          className="bg-blue-50 text-blue-900 px-3 py-1.5 rounded-full"
                        >
                          <Text className="text-xs font-medium">{specialty}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* 联系方式 */}
                  <View className="space-y-3">
                    {/* 电话 */}
                    <View
                      className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3"
                      onClick={() => handleCall(lawyer.phone)}
                    >
                      <View className="bg-blue-100 rounded-full p-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                      </View>
                      <View className="flex-1">
                        <Text className="block text-sm font-semibold text-gray-700 mb-0.5">
                          电话
                        </Text>
                        <Text className="block text-sm text-blue-600">{lawyer.phone}</Text>
                      </View>
                    </View>

                    {/* 邮箱 */}
                    <View
                      className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-3"
                      onClick={() => handleCopyEmail(lawyer.email)}
                    >
                      <View className="bg-green-100 rounded-full p-2">
                        <Mail className="w-4 h-4 text-green-600" />
                      </View>
                      <View className="flex-1">
                        <Text className="block text-sm font-semibold text-gray-700 mb-0.5">
                          邮箱
                        </Text>
                        <Text className="block text-sm text-green-600">{lawyer.email}</Text>
                      </View>
                    </View>

                    {/* 地址 */}
                    <View className="flex items-center gap-3 bg-orange-50 rounded-xl px-4 py-3">
                      <View className="bg-orange-100 rounded-full p-2">
                        <MapPin className="w-4 h-4 text-orange-600" />
                      </View>
                      <View className="flex-1">
                        <Text className="block text-sm font-semibold text-gray-700 mb-0.5">
                          地址
                        </Text>
                        <Text className="block text-sm text-orange-600">{lawyer.address}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* 底部版权 */}
          <View className="mt-6 mb-8 text-center">
            <Text className="block text-xs text-gray-400">
              © 2024 正义律师事务所 版权所有
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default IndexPage
