import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { BookmarkX } from 'lucide-react-taro'
import type { FC } from 'react'
import { Network } from '@/network'
import './index.css'

interface SavedCard {
  id: number
  lawyer_id: number
  user_id: number
  saved_at: string
  lawyer?: {
    id: number
    name: string
    title: string
    avatar: string
    location: string
    specialties: string
  }
}

const SavedCardsPage: FC = () => {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([])
  const [loading, setLoading] = useState(true)

  useLoad(() => {
    console.log('收藏页面加载')
    loadSavedCards()
  })

  useDidShow(() => {
    // 页面显示时重新加载
    loadSavedCards()
  })

  const loadSavedCards = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/saved-cards',
        method: 'GET'
      })

      console.log('收藏列表响应:', res.data)

      if (res.data.code === 200) {
        setSavedCards(res.data.data || [])
      } else {
        Taro.showToast({
          title: res.data.msg || '加载失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('加载收藏列表失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLawyerClick = (lawyerId: number) => {
    Taro.navigateTo({
      url: `/pages/partner-detail/index?id=${lawyerId}`
    })
  }

  const handleUnsave = async (lawyerId: number, event: any) => {
    // 阻止事件冒泡
    event.stopPropagation()

    try {
      const res = await Network.request({
        url: '/api/saved-cards/unsave',
        method: 'POST',
        data: { lawyerId }
      })

      if (res.data.code === 200) {
        Taro.showToast({
          title: '已取消收藏',
          icon: 'success'
        })
        // 重新加载列表
        loadSavedCards()
      } else {
        Taro.showToast({
          title: res.data.msg || '操作失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('取消收藏失败:', error)
      Taro.showToast({
        title: '操作失败',
        icon: 'none'
      })
    }
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

  return (
    <View className="min-h-screen bg-gray-100">
      <ScrollView scrollY className="h-full">
        <View className="px-4 pt-6 pb-6">
          {/* 头部 */}
          <View className="mb-6">
            <Text className="block text-2xl font-bold text-gray-900 mb-2">
              我的收藏
            </Text>
            <Text className="block text-sm text-gray-500">
              收藏的律师名片
            </Text>
          </View>

          {/* 收藏列表 */}
          {loading ? (
            <View className="text-center py-16">
              <Text className="block text-sm text-gray-500">加载中...</Text>
            </View>
          ) : savedCards.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <BookmarkX className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <Text className="block text-base font-medium text-gray-600 mb-2">
                暂无收藏
              </Text>
              <Text className="block text-sm text-gray-400 mb-6">
                浏览律师名片并点击&ldquo;收藏名片&rdquo;按钮即可收藏
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {savedCards.map((item) => {
                const lawyer = item.lawyer
                if (!lawyer) return null

                const specialties = lawyer.specialties
                  ? lawyer.specialties.split(/[,，;；、|｜]/).map((s) => s.trim()).filter((s) => s.length > 0)
                  : []

                return (
                  <View
                    key={item.id}
                    className="bg-white rounded-2xl p-4 shadow-sm active:bg-gray-50"
                    onClick={() => handleLawyerClick(lawyer.id)}
                  >
                    <View className="flex items-start gap-3">
                      {/* 头像 */}
                      <View className="w-14 h-14 rounded-full bg-green-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          className="w-14 h-14"
                          src={lawyer.avatar}
                          mode="aspectFill"
                        />
                      </View>

                      {/* 信息 */}
                      <View className="flex-1">
                        <View className="flex items-center justify-between mb-1">
                          <Text className="block text-base font-bold text-gray-900">
                            {lawyer.name}
                          </Text>
                          <View
                            className="bg-gray-100 rounded-full p-2 active:bg-gray-200"
                            onClick={(e) => handleUnsave(lawyer.id, e)}
                          >
                            <BookmarkX className="w-4 h-4 text-gray-500" />
                          </View>
                        </View>
                        <Text className="block text-xs font-medium text-green-700 mb-1">
                          {lawyer.title}
                        </Text>
                        <Text className="block text-xs text-gray-400 mb-2">
                          📍 {lawyer.location}
                        </Text>
                        <View className="flex flex-wrap gap-1">
                          {specialties.slice(0, 3).map((specialty, index) => (
                            <View
                              key={index}
                              className="bg-green-50 text-green-900 px-2 py-0.5 rounded"
                            >
                              <Text className="text-xs">{specialty}</Text>
                            </View>
                          ))}
                        </View>
                        <Text className="block text-xs text-gray-400 mt-2">
                          {formatTime(item.saved_at)} 收藏
                        </Text>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default SavedCardsPage
