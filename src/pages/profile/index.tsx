import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import {
  MessageCircle,
  BookOpen,
  Settings,
  LogOut,
  Shield,
  ChevronRight
} from 'lucide-react-taro'
import type { FC } from 'react'
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

const ProfilePage: FC = () => {
  const [userType, setUserType] = useState<'client' | 'partner' | null>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])

  useLoad(() => {
    console.log('我的页面加载')
    loadUserInfo()
  })

  const loadUserInfo = async () => {
    try {
      // 模拟获取用户信息，实际应该从后端获取
      const mockUserType = 'client' // 可以切换为 'partner' 测试合伙人视图
      setUserType(mockUserType)

      if (mockUserType === 'client') {
        setUserInfo({
          name: '张三',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
          phone: '138-0000-9999',
          email: 'zhangsan@example.com'
        })
        // 模拟客户的咨询记录
        setConsultations([
          {
            id: 1,
            title: '关于公司注册的咨询',
            content: '您好，我想咨询一下公司注册的相关流程和需要准备的材料。',
            status: 'replied',
            createTime: '2024-03-01 10:30',
            lawyerName: '张律师',
            lawyerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
            reply: '您好，公司注册需要准备以下材料：1. 公司章程 2. 股东身份证明 3. 注册地址证明等。具体流程可以参考我们官网的详细指南。',
            replyTime: '2024-03-01 14:20'
          },
          {
            id: 2,
            title: '劳动合同纠纷咨询',
            content: '我想咨询一下劳动合同解除的相关法律问题。',
            status: 'pending',
            createTime: '2024-03-05 09:15'
          }
        ])
      } else {
        setUserInfo({
          name: '张律师',
          title: '高级合伙人',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
          phone: '138-0000-0001',
          email: 'zhang@lawfirm.com'
        })
        // 模拟合伙人收到的咨询消息
        setConsultations([
          {
            id: 1,
            title: '关于公司注册的咨询',
            content: '您好，我想咨询一下公司注册的相关流程和需要准备的材料。',
            status: 'replied',
            createTime: '2024-03-01 10:30',
            reply: '您好，公司注册需要准备以下材料：1. 公司章程 2. 股东身份证明 3. 注册地址证明等。具体流程可以参考我们官网的详细指南。',
            replyTime: '2024-03-01 14:20'
          },
          {
            id: 3,
            title: '房产纠纷咨询',
            content: '您好，我遇到了房产纠纷问题，想咨询一下如何处理。',
            status: 'pending',
            createTime: '2024-03-06 11:20'
          }
        ])
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
    }
  }

  const handleConsultationClick = (consultation: Consultation) => {
    // 跳转到咨询详情页
    Taro.navigateTo({
      url: `/pages/consultation-detail/index?id=${consultation.id}&type=${userType}`
    })
  }

  const handleNewConsultation = () => {
    Taro.navigateTo({
      url: '/pages/new-consultation/index'
    })
  }

  const handleSwitchRole = () => {
    const newRole = userType === 'client' ? 'partner' : 'client'
    setUserType(newRole)
    loadUserInfo()
    Taro.showToast({
      title: `已切换为${newRole === 'client' ? '客户' : '合伙人'}视角`,
      icon: 'success'
    })
  }

  if (!userType || !userInfo) {
    return (
      <View className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Text className="block text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-100">
      <ScrollView scrollY className="h-full">
        {/* 用户信息卡片 */}
        <View className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-b-3xl pt-8 pb-6 px-6 mb-4">
          <View className="flex items-start gap-4">
            <Image
              className="w-20 h-20 rounded-full object-cover border-4 border-white/20 flex-shrink-0"
              src={userInfo.avatar}
              mode="aspectFill"
            />
            <View className="flex-1 pt-1">
              <Text className="block text-xl font-bold text-white mb-1">
                {userInfo.name}
              </Text>
              {userType === 'partner' && (
                <Text className="block text-base font-medium text-blue-100 mb-2">
                  {userInfo.title}
                </Text>
              )}
              <View className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-200" />
                <Text className="text-sm text-blue-200">
                  {userType === 'client' ? '客户' : '合伙人'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4 pb-6">
          {/* 切换角色（仅用于演示） */}
          <View
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-center justify-between"
            onClick={handleSwitchRole}
          >
            <View className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-600" />
              <Text className="text-sm text-amber-800">
                当前：{userType === 'client' ? '客户' : '合伙人'}（点击切换）
              </Text>
            </View>
            <ChevronRight className="w-5 h-5 text-amber-600" />
          </View>

          {/* 客户视图 */}
          {userType === 'client' && (
            <>
              {/* 我的咨询 */}
              <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                <View className="flex items-center justify-between mb-4">
                  <View className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
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
                      className="bg-blue-900 text-white rounded-xl py-3 px-6 mx-auto w-fit"
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
                      className="bg-blue-900 text-white rounded-xl py-3 px-6 w-full text-center active:bg-blue-800"
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
          {userType === 'partner' && (
            <>
              {/* 咨询消息 */}
              <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                <View className="flex items-center justify-between mb-4">
                  <View className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
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
                <BookOpen className="w-5 h-5 text-blue-600" />
                <Text className="block text-sm text-gray-900">我的收藏</Text>
              </View>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </View>
            <View className="flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50">
              <View className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-blue-600" />
                <Text className="block text-sm text-gray-900">设置</Text>
              </View>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </View>
            <View className="flex items-center justify-between p-4 active:bg-gray-50">
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
