import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Building2, Phone, MapPin } from 'lucide-react-taro'
import type { FC } from 'react'
import './index.css'

// 律所信息
const lawFirm = {
  name: '正义律师事务所',
  description: '专业法律服务平台 · 值得信赖',
  address: '北京市朝阳区建国门外大街1号',
  phone: '400-800-8888'
}

const IndexPage: FC = () => {
  useLoad(() => {
    console.log('首页加载')
  })

  return (
    <View className="min-h-screen bg-gray-100">
      <ScrollView scrollY className="h-full">
        {/* 律所信息卡片 */}
        <View className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-b-3xl p-6 pt-8 pb-8 mb-6">
          <View className="flex items-center gap-3 mb-3">
            <Building2 className="w-7 h-7 text-white" />
            <Text className="block text-2xl font-bold text-white">正义律师事务所</Text>
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

        {/* 服务领域 */}
        <View className="px-4 mb-6">
          <Text className="block text-lg font-bold text-gray-900 mb-4">服务领域</Text>
          <View className="grid grid-cols-2 gap-3">
            {[
              '公司法',
              '合同纠纷',
              '知识产权',
              '婚姻家庭',
              '刑事辩护',
              '劳动争议'
            ].map((item, index) => (
              <View key={index} className="bg-white rounded-xl p-4 text-center">
                <Text className="block text-sm font-medium text-gray-700">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 联系我们 */}
        <View className="px-4 mb-8">
          <Text className="block text-lg font-bold text-gray-900 mb-4">联系我们</Text>
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex items-center gap-3 mb-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <Text className="text-sm text-gray-700">{lawFirm.phone}</Text>
            </View>
            <View className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-orange-600" />
              <Text className="text-sm text-gray-700">{lawFirm.address}</Text>
            </View>
          </View>
        </View>

        {/* 底部版权 */}
        <View className="text-center pb-6">
          <Text className="block text-xs text-gray-400">
            © 2024 正义律师事务所 版权所有
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default IndexPage
