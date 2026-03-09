import { View, Text, ScrollView, Image, Button } from '@tarojs/components'
import Taro, { useLoad, useDidShow, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { useState } from 'react'
import { Phone, Mail, Globe, Award, Share2 } from 'lucide-react-taro'
import type { FC } from 'react'
import { Network } from '@/network'
import './index.css'

interface Lawyer {
  id: number
  name: string
  title: string
  avatar: string
  location: string
  specialties: string // 文本格式
  description: string
  achievements: string // 文本格式
  phone?: string
  email?: string
  website?: string
  cases: string // 文本格式
  is_active: boolean
}

const PartnerDetailPage: FC = () => {
  const [lawyer, setLawyer] = useState<Lawyer | null>(null)
  const [loading, setLoading] = useState(true)

  useLoad((options) => {
    console.log('合伙人详情页参数:', options)
    const id = options?.id
    if (id) {
      loadLawyer(Number(id))
    }
  })

  // 页面显示时更新导航栏标题
  useDidShow(() => {
    if (lawyer) {
      Taro.setNavigationBarTitle({
        title: lawyer.name
      })
    }
  })

  // 配置分享功能
  useShareAppMessage(() => {
    return {
      title: lawyer ? `${lawyer.name} - 德恒律师事务所` : '德恒律师事务所',
      path: lawyer ? `/pages/partner-detail/index?id=${lawyer.id}` : '/pages/index/index',
      imageUrl: lawyer?.avatar || ''
    }
  })

  // 配置分享到朋友圈
  useShareTimeline(() => {
    return {
      title: lawyer ? `${lawyer.name} - 德恒律师事务所` : '德恒律师事务所',
      query: lawyer ? `id=${lawyer.id}` : '',
      imageUrl: lawyer?.avatar || ''
    }
  })

  const loadLawyer = async (id: number) => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/lawyers/${id}`,
        method: 'GET'
      })

      console.log('律师详情响应:', res)

      if (res.data?.code === 200 && res.data.data) {
        const lawyerData = res.data.data
        setLawyer(lawyerData)
      } else {
        Taro.showToast({
          title: '未找到律师信息',
          icon: 'none'
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      }
    } catch (error) {
      console.error('加载律师详情错误:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 解析 specialties 字符串为数组
  const parseSpecialties = (specialties: string): string[] => {
    if (!specialties) return []
    return specialties.split(/[,，;；、]/).map(s => s.trim()).filter(s => s.length > 0)
  }

  const handleShare = () => {
    if (!lawyer) return

    // 提示用户使用右上角菜单分享
    Taro.showModal({
      title: '分享提示',
      content: '请点击右上角"···"菜单，选择"转发"分享给好友，或"分享到朋友圈"',
      showCancel: false,
      confirmText: '我知道了'
    })
  }

  const handlePhoneCall = (phone?: string) => {
    if (!phone) {
      Taro.showToast({
        title: '暂无联系电话',
        icon: 'none'
      })
      return
    }
    Taro.makePhoneCall({
      phoneNumber: phone
    })
  }

  const handleEmail = (email?: string) => {
    if (!email) {
      Taro.showToast({
        title: '暂无邮箱',
        icon: 'none'
      })
      return
    }
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

  const handleWebsite = (website?: string) => {
    if (!website) {
      Taro.showToast({
        title: '暂无官网',
        icon: 'none'
      })
      return
    }
    Taro.navigateTo({
      url: `/pages/webview/index?url=${encodeURIComponent(website)}`
    })
  }

  if (loading) {
    return (
      <View className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Text className="block text-gray-500">加载中...</Text>
      </View>
    )
  }

  if (!lawyer) {
    return (
      <View className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Text className="block text-gray-500">未找到律师信息</Text>
      </View>
    )
  }

  const specialties = parseSpecialties(lawyer.specialties)

  return (
    <View className="min-h-screen bg-gray-100">
      <ScrollView scrollY className="h-full pb-20">
        {/* 头部信息卡片 */}
        <View className="bg-gradient-to-br from-green-800 to-green-950 px-4 pt-8 pb-12">
          <View className="flex flex-col items-center">
            {/* 头像 */}
            <View className="relative mb-4">
              <Image
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
                src={lawyer.avatar}
                mode="aspectFill"
              />
            </View>

            {/* 姓名 */}
            <Text className="block text-2xl font-bold text-white mb-2 text-center">
              {lawyer.name}
            </Text>

            {/* 职务 */}
            <Text className="block text-base text-green-200 mb-2 text-center">
              {lawyer.title}
            </Text>

            {/* 地点 */}
            <View className="flex items-center gap-1">
              <Text className="text-sm text-green-300">
                {lawyer.location}
              </Text>
            </View>
          </View>
        </View>

        {/* 主要内容 */}
        <View className="px-4 -mt-6 space-y-4">
          {/* 专业领域 */}
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-green-700" />
              <Text className="text-base font-bold text-gray-900">专业领域</Text>
            </View>
            <View className="flex flex-wrap gap-2">
              {specialties.map((specialty, index) => (
                <View
                  key={index}
                  className="bg-green-50 text-green-900 px-3 py-1.5 rounded-lg"
                >
                  <Text className="text-sm">{specialty}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 个人简介 */}
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="block text-base font-bold text-gray-900 mb-3">个人简介</Text>
            <Text className="block text-sm text-gray-700 leading-relaxed">
              {lawyer.description}
            </Text>
          </View>

          {/* 联系方式 - 移到这里，与荣誉成就交换位置 */}
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="block text-base font-bold text-gray-900 mb-3">联系方式</Text>
            <View className="space-y-3">
              {lawyer.phone && (
                <View
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg active:bg-gray-100"
                  onClick={() => handlePhoneCall(lawyer.phone)}
                >
                  <View className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-700" />
                    <Text className="text-sm text-gray-900">电话</Text>
                  </View>
                  <Text className="text-sm text-gray-700">{lawyer.phone}</Text>
                </View>
              )}
              {lawyer.email && (
                <View
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg active:bg-gray-100"
                  onClick={() => handleEmail(lawyer.email)}
                >
                  <View className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <Text className="text-sm text-gray-900">邮箱</Text>
                  </View>
                  <Text className="text-sm text-gray-700">{lawyer.email}</Text>
                </View>
              )}
              {lawyer.website && (
                <View
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg active:bg-gray-100"
                  onClick={() => handleWebsite(lawyer.website)}
                >
                  <View className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    <Text className="text-sm text-gray-900">官网</Text>
                  </View>
                  <View className="flex items-center gap-1">
                    <Text className="text-sm text-gray-700">访问</Text>
                    <Award className="w-4 h-4 text-gray-400" />
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* 典型案例 */}
          {lawyer.cases && (
            <View className="bg-white rounded-2xl p-5 shadow-sm">
              <Text className="block text-base font-bold text-gray-900 mb-3">典型案例</Text>
              <Text className="block text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {lawyer.cases}
              </Text>
            </View>
          )}

          {/* 荣誉成就 - 移到最下方 */}
          {lawyer.achievements && (
            <View className="bg-white rounded-2xl p-5 shadow-sm">
              <View className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-blue-600" />
                <Text className="text-base font-bold text-gray-900">荣誉成就</Text>
              </View>
              <Text className="block text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {lawyer.achievements}
              </Text>
            </View>
          )}

          {/* 分享按钮 */}
          <Button
            className="w-full bg-green-700 text-white rounded-xl py-3 flex items-center justify-center gap-2"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5 text-white" />
            <Text className="text-white font-medium">分享名片</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  )
}

export default PartnerDetailPage
