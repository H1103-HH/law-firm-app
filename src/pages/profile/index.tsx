import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import {
  MessageCircle,
  BookOpen,
  Settings,
  LogOut,
  Shield,
  ChevronRight,
  User
} from 'lucide-react-taro'
import type { FC } from 'react'
import { Network } from '@/network'
import './index.css'

interface Consultation {
  id: number
  title: string
  content: string
  status: 'pending' | 'replied'
  createTime: string
  lawyerName?: string
  lawyerAvatar?: string
  reply?: string
  replyTime?: string
}

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

const ProfilePage: FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])

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
        // 加载咨询数据
        loadConsultations(storedUserInfo.role)
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
    }
  }

  const loadConsultations = async (userType: 'client' | 'partner') => {
    try {
      const res = await Network.request({
        url: '/api/consultations',
        data: { userType }
      })

      if (res.data.code === 200) {
        setConsultations(res.data.data || [])
      }
    } catch (error) {
      console.error('加载咨询数据失败:', error)
      // 使用模拟数据
      const mockConsultations: Consultation[] =
        userType === 'client'
          ? [
              {
                id: 1,
                title: '关于公司注册的咨询',
                content: '您好，我想咨询一下公司注册的相关流程和需要准备的材料。',
                status: 'replied',
                createTime: '2024-03-01 10:30',
                lawyerName: '张律师',
                lawyerAvatar:
                  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
                reply: '您好，公司注册需要准备以下材料：1. 公司章程 2. 股东身份证明 3. 注册地址证明等。',
                replyTime: '2024-03-01 14:20'
              },
              {
                id: 2,
                title: '劳动合同纠纷咨询',
                content: '我想咨询一下劳动合同解除的相关法律问题。',
                status: 'pending',
                createTime: '2024-03-05 09:15'
              }
            ]
          : [
              {
                id: 1,
                title: '关于公司注册的咨询',
                content: '您好，我想咨询一下公司注册的相关流程和需要准备的材料。',
                status: 'replied',
                createTime: '2024-03-01 10:30',
                reply: '您好，公司注册需要准备以下材料：1. 公司章程 2. 股东身份证明 3. 注册地址证明等。',
                replyTime: '2024-03-01 14:20'
              },
              {
                id: 3,
                title: '房产纠纷咨询',
                content: '您好，我遇到了房产纠纷问题，想咨询一下如何处理。',
                status: 'pending',
                createTime: '2024-03-06 11:20'
              }
            ]
      setConsultations(mockConsultations)
    }
  }

  const handleConsultationClick = (consultation: Consultation) => {
    Taro.navigateTo({
      url: `/pages/consultation-detail/index?id=${consultation.id}&type=${userInfo?.role}`
    })
  }

  const handleNewConsultation = () => {
    Taro.navigateTo({
      url: '/pages/new-consultation/index'
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
          setConsultations([])
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
                登录后可以查看咨询记录、管理个人信息等
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
          {/* 客户视图 */}
          {userInfo.role === 'client' && (
            <>
              {/* 我的咨询 */}
              <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                <View className="flex items-center justify-between mb-4">
                  <View className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-700" />
                    <Text className="block text-base font-bold text-gray-900">
                      我的咨询
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-500">
                    {consultations.length} 条
                  </Text>
                </View>

                {consultations.length === 0 ? (
                  <View className="text-center py-8">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <Text className="block text-sm text-gray-500 mb-4">
                      暂无咨询记录
                    </Text>
                    <View
                      className="bg-green-900 text-white rounded-xl py-3 px-6 mx-auto w-fit"
                      onClick={handleNewConsultation}
                    >
                      <Text className="block text-sm font-medium">发起咨询</Text>
                    </View>
                  </View>
                ) : (
                  <View className="space-y-3">
                    {consultations.map((consultation) => (
                      <View
                        key={consultation.id}
                        className="bg-gray-50 rounded-xl p-4 active:bg-gray-100"
                        onClick={() => handleConsultationClick(consultation)}
                      >
                        <View className="flex items-start justify-between mb-2">
                          <Text className="block text-sm font-medium text-gray-900 flex-1">
                            {consultation.title}
                          </Text>
                          <View
                            className={`px-2 py-0.5 rounded-full ml-2 ${
                              consultation.status === 'replied'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            <Text className="text-xs font-medium">
                              {consultation.status === 'replied' ? '已回复' : '待回复'}
                            </Text>
                          </View>
                        </View>
                        <Text className="block text-xs text-gray-500 mb-2">
                          {consultation.createTime}
                        </Text>
                        <Text className="block text-sm text-gray-600 line-clamp-2">
                          {consultation.content}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {consultations.length > 0 && (
                  <View className="mt-4">
                    <View
                      className="bg-green-900 text-white rounded-xl py-3 px-6 w-full text-center active:bg-green-800"
                      onClick={handleNewConsultation}
                    >
                      <Text className="block text-sm font-medium">发起新咨询</Text>
                    </View>
                  </View>
                )}
              </View>
            </>
          )}

          {/* 合伙人视图 */}
          {userInfo.role === 'partner' && (
            <>
              {/* 咨询消息 */}
              <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                <View className="flex items-center justify-between mb-4">
                  <View className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-700" />
                    <Text className="block text-base font-bold text-gray-900">
                      咨询消息
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-500">
                    {consultations.filter((c) => c.status === 'pending').length} 条待回复
                  </Text>
                </View>

                {consultations.length === 0 ? (
                  <View className="text-center py-8">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <Text className="block text-sm text-gray-500">暂无咨询消息</Text>
                  </View>
                ) : (
                  <View className="space-y-3">
                    {consultations.map((consultation) => (
                      <View
                        key={consultation.id}
                        className={`rounded-xl p-4 active:opacity-80 ${
                          consultation.status === 'pending'
                            ? 'bg-amber-50 border border-amber-200'
                            : 'bg-gray-50'
                        }`}
                        onClick={() => handleConsultationClick(consultation)}
                      >
                        <View className="flex items-start justify-between mb-2">
                          <Text className="block text-sm font-medium text-gray-900 flex-1">
                            {consultation.title}
                          </Text>
                          <View
                            className={`px-2 py-0.5 rounded-full ml-2 ${
                              consultation.status === 'replied'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            <Text className="text-xs font-medium">
                              {consultation.status === 'replied' ? '已回复' : '待回复'}
                            </Text>
                          </View>
                        </View>
                        <Text className="block text-xs text-gray-500 mb-2">
                          {consultation.createTime}
                        </Text>
                        <Text className="block text-sm text-gray-600 line-clamp-2">
                          {consultation.content}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </>
          )}

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
              className="flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50"
              onClick={() => Taro.navigateTo({ url: '/pages/admin/login' })}
            >
              <View className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <Text className="block text-sm text-blue-600">管理员入口</Text>
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
