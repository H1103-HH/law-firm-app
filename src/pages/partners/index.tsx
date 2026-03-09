import { View, Text, ScrollView, Image, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { ArrowRight, Search } from 'lucide-react-taro'
import type { FC } from 'react'
import { Network } from '@/network'
import './index.css'

interface Lawyer {
  id: number
  name: string
  title: string
  avatar: string
  location: string
  specialties: string // 改为文本格式
  description: string
  achievements: string // 改为文本格式
  phone?: string
  email?: string
  website?: string
  cases: string // 改为文本格式
  is_active: boolean
}

const PartnersPage: FC = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    loadLawyers()
  }, [])

  const loadLawyers = async () => {
    try {
      const res = await Network.request({
        url: '/api/lawyers',
        method: 'GET'
      })

      console.log('律师列表响应:', res)

      if (res.data?.code === 200) {
        // 只显示激活的律师
        setLawyers((res.data.data || []).filter((l: Lawyer) => l.is_active))
      } else {
        Taro.showToast({
          title: res.data?.msg || '加载失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('加载律师列表错误:', error)
      Taro.showToast({
        title: '网络错误',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 解析 specialties 字符串为数组
  const parseSpecialties = (specialties: string): string[] => {
    if (!specialties) return []
    // 支持逗号、顿号、分号等分隔符
    return specialties.split(/[,，;；、]/).map(s => s.trim()).filter(s => s.length > 0)
  }

  // 搜索过滤逻辑
  const filteredLawyers = lawyers.filter((lawyer) => {
    if (!searchKeyword) return true

    const keyword = searchKeyword.toLowerCase().trim()
    const specialties = parseSpecialties(lawyer.specialties)

    // 支持搜索：姓名、职务、专业领域、地点
    return (
      lawyer.name.toLowerCase().includes(keyword) ||
      lawyer.title.toLowerCase().includes(keyword) ||
      specialties.some((specialty) =>
        specialty.toLowerCase().includes(keyword)
      ) ||
      lawyer.location.toLowerCase().includes(keyword)
    )
  })

  // 搜索输入处理
  const handleSearchInput = (e: any) => {
    setSearchKeyword(e.detail.value)
  }

  // 清除搜索
  const handleClearSearch = () => {
    setSearchKeyword('')
  }

  // 点击律师卡片，跳转到详情页
  const handleLawyerClick = (lawyerId: number) => {
    Taro.navigateTo({
      url: `/pages/partner-detail/index?id=${lawyerId}`
    })
  }

  if (loading) {
    return (
      <View className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Text className="block text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-100">
      <ScrollView scrollY className="h-full">
        {/* 搜索框 */}
        <View className="px-4 pt-4 pb-3">
          <View className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <Input
              className="flex-1 bg-transparent text-base"
              placeholder="搜索姓名、职务、专业领域..."
              value={searchKeyword}
              onInput={handleSearchInput}
              placeholderClass="text-gray-400"
            />
            {searchKeyword && (
              <Text
                className="text-sm text-green-700 flex-shrink-0 active:text-green-800"
                onClick={handleClearSearch}
              >
                清除
              </Text>
            )}
          </View>
        </View>

        {/* 律师列表 */}
        <View className="px-4 pb-6">
          {filteredLawyers.length > 0 ? (
            <View className="space-y-4">
              {filteredLawyers.map((lawyer) => {
                const specialties = parseSpecialties(lawyer.specialties)
                return (
                  <View
                    key={lawyer.id}
                    className="bg-white rounded-2xl p-5 shadow-sm active:bg-gray-50"
                    onClick={() => handleLawyerClick(lawyer.id)}
                  >
                    <View className="flex items-start gap-4">
                      {/* 头像 */}
                      <Image
                        className="w-16 h-16 rounded-full object-cover border-2 border-green-100 flex-shrink-0"
                        src={lawyer.avatar}
                        mode="aspectFill"
                      />

                      {/* 信息 */}
                      <View className="flex-1">
                        <View className="flex items-center justify-between mb-1">
                          <Text className="block text-base font-bold text-gray-900">
                            {lawyer.name}
                          </Text>
                          <View className="flex items-center gap-1">
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                            <Text className="text-xs text-gray-400">{lawyer.location}</Text>
                          </View>
                        </View>
                        <Text className="block text-sm font-medium text-green-700 mb-2">
                          {lawyer.title}
                        </Text>
                        <View className="flex flex-wrap gap-1">
                          {specialties.slice(0, 2).map((specialty, index) => (
                            <View
                              key={index}
                              className="bg-green-50 text-green-900 px-2 py-0.5 rounded-full"
                            >
                              <Text className="text-xs">{specialty}</Text>
                            </View>
                          ))}
                          {specialties.length > 2 && (
                            <View className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              <Text className="text-xs">
                                +{specialties.length - 2}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <Text className="block text-base text-gray-500 mb-2">未找到匹配的律师</Text>
              <Text className="block text-sm text-gray-400">
                {lawyers.length === 0 ? '暂无律师信息' : '请尝试其他关键词'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default PartnersPage
