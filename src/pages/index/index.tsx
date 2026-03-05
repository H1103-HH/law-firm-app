import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { Globe, MessageSquare, ArrowRight, Building2, Phone, MapPin } from 'lucide-react-taro'
import type { FC } from 'react'
import './index.css'

// 律所信息
const lawFirm = {
  name: '正义律师事务所',
  description: '专业法律服务平台 · 值得信赖',
  address: '北京市朝阳区建国门外大街1号',
  phone: '400-800-8888',
  website: 'https://www.lawfirm.example.com',
  wechatAccount: 'lawfirm_official'
}

const IndexPage: FC = () => {
  useLoad(() => {
    console.log('首页加载')
  })

  // 跳转到官网
  const handleGoWebsite = () => {
    Taro.navigateTo({
      url: '/pages/webview/index?url=' + encodeURIComponent(lawFirm.website) + '&title=官方网站'
    })
  }

  // 打开公众号
  const handleOpenWechat = () => {
    Taro.showModal({
      title: '公众号信息',
      content: `公众号名称：${lawFirm.wechatAccount}\n\n请在微信中搜索关注`,
      showCancel: false,
      confirmText: '复制'
    }).then((res) => {
      if (res.confirm) {
        Taro.setClipboardData({
          data: lawFirm.wechatAccount,
          success: () => {
            Taro.showToast({
              title: '已复制',
              icon: 'success'
            })
          }
        })
      }
    })
  }

  // 跳转到全球合伙人
  const handleGoPartners = () => {
    Taro.switchTab({
      url: '/pages/partners/index'
    })
  }

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

        {/* 快速入口 */}
        <View className="px-4 mb-6">
          <Text className="block text-lg font-bold text-gray-900 mb-4">快速入口</Text>

          {/* 官网入口 */}
          <View
            className="bg-white rounded-2xl p-5 mb-4 shadow-sm active:bg-gray-50"
            onClick={handleGoWebsite}
          >
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-4">
                <View className="bg-blue-100 rounded-xl p-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                </View>
                <View>
                  <Text className="block text-base font-semibold text-gray-900 mb-1">
                    官方网站
                  </Text>
                  <Text className="block text-sm text-gray-500">浏览最新资讯和法律服务</Text>
                </View>
              </View>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </View>
          </View>

          {/* 公众号入口 */}
          <View
            className="bg-white rounded-2xl p-5 mb-4 shadow-sm active:bg-gray-50"
            onClick={handleOpenWechat}
          >
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-4">
                <View className="bg-green-100 rounded-xl p-3">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </View>
                <View>
                  <Text className="block text-base font-semibold text-gray-900 mb-1">
                    官方公众号
                  </Text>
                  <Text className="block text-sm text-gray-500">关注获取最新动态</Text>
                </View>
              </View>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </View>
          </View>

          {/* 全球合伙人入口 */}
          <View
            className="bg-white rounded-2xl p-5 shadow-sm active:bg-gray-50"
            onClick={handleGoPartners}
          >
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-4">
                <View className="bg-amber-100 rounded-xl p-3">
                  <View className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                    <Text className="text-white text-xs font-bold">团队</Text>
                  </View>
                </View>
                <View>
                  <Text className="block text-base font-semibold text-gray-900 mb-1">
                    全球合伙人
                  </Text>
                  <Text className="block text-sm text-gray-500">了解我们的专业团队</Text>
                </View>
              </View>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </View>
          </View>
        </View>

        {/* 服务介绍 */}
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
