import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import {
  BookOpen,
  Settings,
  LogOut,
  Shield,
  ChevronRight,
  User,
  Eye
} from 'lucide-react-taro'
import type { FC } from 'react'
import { Network } from '@/network'
import './index.css'

interface UserInfo {
  id: number
  openid: string
  nickname?: string
  avatar?: string
  role: 'client' | 'partner'
  token: string
  name?: string
  title?: string
}

interface ViewedLawyer {
  id: number
  lawyer_id: number
  user_id: number
  viewed_at: string
  lawyer?: {
    id: number
    name: string
    title: string
    avatar: string
    location: string
    specialties: string
  }
}

const ProfilePage: FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [viewedLawyers, setViewedLawyers] = useState<ViewedLawyer[]>([])

  useLoad(() => {
    console.log('我的页面加载')
    loadUserInfo()
  })

  useDidShow(() => {
    // 页面显示时重新加载用户信息（登录后返回）
    loadUserInfo()
  })

  const loadUserInfo = async () => {
    try {
      const storedUserInfo = Taro.getStorageSync('userInfo')
      if (storedUserInfo) {
        setUserInfo(storedUserInfo)
        // 加载查看历史
        loadViewedLawyers()
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
    }
  }

  const loadViewedLawyers = async () => {
    try {
      const res = await Network.request({
        url: '/api/viewed-lawyers',
        method: 'GET'
      })

      if (res.data.code === 200) {
        setViewedLawyers(res.data.data || [])
      }
    } catch (error) {
      console.error('加载查看历史失败:', error)
      // 使用空数组
      setViewedLawyers([])
    }
  }

  const handleLawyerClick = (lawyerId: number) => {
    Taro.navigateTo({
      url: `/pages/partner-detail/index?id=${lawyerId}`
    })
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync('userInfo')
          Taro.removeStorageSync('token')
          setUserInfo(null)
          setViewedLawyers([])
          Taro.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }

  const handleLogin = () => {
    Taro.navigateTo({
      url: '/pages/login/index'
    })
  }

  // 格式化时间
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return '今天'
    if (days === 1) return '昨天'
    if (days < 7) return `${days} 天前`
    return date.toLocaleDateString('zh-CN')
  }

  // 未登录状态
  if (!userInfo) {
    return (
      <View className="min-h-screen bg-gray-100">
        <ScrollView scrollY className="h-full">
          <View className="px-4 pt-16 pb-6">
            {/* 未登录提示 */}
            <View className="bg-white rounded-2xl p-8 shadow-sm text-center mb-6">
              <View className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-green-700" />
              </View>
              <Text className="block text-xl font-bold text-gray-900 mb-3">
                登录后查看更多内容
              </Text>
              <Text className="block text-sm text-gray-500 mb-6">
                登录后可以查看浏览历史、管理个人信息等
              </Text>
              <View
                className="bg-green-900 text-white rounded-2xl py-4 px-6 w-full text-center active:bg-green-800"
                onClick={handleLogin}
              >
                <Text className="block text-base font-medium">立即登录</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-100">
      <ScrollView scrollY className="h-full">
        {/* 用户信息卡片 */}
        <View className="bg-gradient-to-br from-green-900 to-green-800 rounded-b-3xl pt-8 pb-6 px-6 mb-4">
          <View className="flex items-start gap-4">
            <Image
              className="w-20 h-20 rounded-full object-cover border-4 border-white/20 flex-shrink-0"
              src={userInfo.avatar || ''}
              mode="aspectFill"
            />
            <View className="flex-1 pt-1">
              <Text className="block text-xl font-bold text-white mb-1">
                {userInfo.name || userInfo.nickname || '用户'}
              </Text>
              {userInfo.role === 'partner' && userInfo.title && (
                <Text className="block text-base font-medium text-green-100 mb-2">
                  {userInfo.title}
                </Text>
              )}
              <View className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-200" />
                <Text className="text-sm text-green-200">
                  {userInfo.role === 'client' ? '客户' : '合伙人'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4 pb-6">
          {/* 我看过的律师 */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex items-center justify-between mb-4">
              <View className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-700" />
                <Text className="block text-base font-bold text-gray-900">
                  我看过的律师
                </Text>
              </View>
              <Text className="text-sm text-gray-500">
                {viewedLawyers.length} 位
              </Text>
            </View>

            {viewedLawyers.length === 0 ? (
              <View className="text-center py-8">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <Text className="block text-sm text-gray-500 mb-2">
                  暂无浏览记录
                </Text>
                <Text className="block text-xs text-gray-400">
                  浏览律师名片后，将在这里显示
                </Text>
              </View>
            ) : (
              <View className="space-y-3">
                {viewedLawyers.map((item) => {
                  const lawyer = item.lawyer
                  if (!lawyer) return null

                  const specialties = lawyer.specialties
                    .split(/[,，;；、]/)
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0)

                  return (
                    <View
                      key={item.id}
                      className="bg-gray-50 rounded-xl p-4 active:bg-gray-100"
                      onClick={() => handleLawyerClick(lawyer.id)}
                    >
                      <View className="flex items-start gap-3">
                        {/* 头像 */}
                        <Image
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          src={lawyer.avatar}
                          mode="aspectFill"
                        />

                        {/* 信息 */}
                        <View className="flex-1">
                          <View className="flex items-center justify-between mb-1">
                            <Text className="block text-sm font-bold text-gray-900">
                              {lawyer.name}
                            </Text>
                            <Text className="text-xs text-gray-400">
                              {formatTime(item.viewed_at)}
                            </Text>
                          </View>
                          <Text className="block text-xs font-medium text-green-700 mb-2">
                            {lawyer.title}
                          </Text>
                          <View className="flex flex-wrap gap-1">
                            {specialties.slice(0, 2).map((specialty, index) => (
                              <View
                                key={index}
                                className="bg-green-50 text-green-900 px-2 py-0.5 rounded"
                              >
                                <Text className="text-xs">{specialty}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
          </View>

          {/* 其他菜单 */}
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <View className="flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50">
              <View className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-green-700" />
                <Text className="block text-sm text-gray-900">我的收藏</Text>
              </View>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </View>
            <View className="flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50">
              <View className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-green-700" />
                <Text className="block text-sm text-gray-900">设置</Text>
              </View>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </View>
            <View
              className="flex items-center justify-between p-4 active:bg-gray-50"
              onClick={handleLogout}
            >
              <View className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-500" />
                <Text className="block text-sm text-red-500">退出登录</Text>
              </View>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </View>
          </View>
        </View>

        {/* 底部留白 */}
        <View className="h-6" />
      </ScrollView>
    </View>
  )
}

export default ProfilePage
