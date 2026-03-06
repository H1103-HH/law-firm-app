import { View, Text, ScrollView, Image, Input } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { ArrowRight, Search } from 'lucide-react-taro'
import type { FC } from 'react'
import { partners } from '@/data/partners'
import './index.css'

// 合伙人数据已迁移到 src/data/partners.ts

const PartnersPage: FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('')

  useLoad(() => {
    console.log('全球合伙人页面加载')
  })

  // 搜索过滤逻辑
  const filteredPartners = partners.filter((partner) => {
    if (!searchKeyword) return true

    const keyword = searchKeyword.toLowerCase().trim()

    // 支持搜索：姓名、职务、专业领域、地点
    return (
      partner.name.toLowerCase().includes(keyword) ||
      partner.title.toLowerCase().includes(keyword) ||
      partner.specialties.some((specialty) =>
        specialty.toLowerCase().includes(keyword)
      ) ||
      partner.location.toLowerCase().includes(keyword)
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

  // 点击合伙人卡片，跳转到详情页
  const handlePartnerClick = (partnerId: number) => {
    Taro.navigateTo({
      url: `/pages/partner-detail/index?id=${partnerId}`
    })
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

        {/* 合伙人列表 */}
        <View className="px-4 pb-6">
          {filteredPartners.length > 0 ? (
            <View className="space-y-4">
              {filteredPartners.map((partner) => (
                <View
                  key={partner.id}
                  className="bg-white rounded-2xl p-5 shadow-sm active:bg-gray-50"
                  onClick={() => handlePartnerClick(partner.id)}
                >
                  <View className="flex items-start gap-4">
                    {/* 头像 */}
                    <Image
                      className="w-16 h-16 rounded-full object-cover border-2 border-green-100 flex-shrink-0"
                      src={partner.avatar}
                      mode="aspectFill"
                    />

                    {/* 信息 */}
                    <View className="flex-1">
                      <View className="flex items-center justify-between mb-1">
                        <Text className="block text-base font-bold text-gray-900">
                          {partner.name}
                        </Text>
                        <View className="flex items-center gap-1">
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <Text className="text-xs text-gray-400">{partner.location}</Text>
                        </View>
                      </View>
                      <Text className="block text-sm font-medium text-green-700 mb-2">
                        {partner.title}
                      </Text>
                      <View className="flex flex-wrap gap-1">
                        {partner.specialties.slice(0, 2).map((specialty, index) => (
                          <View
                            key={index}
                            className="bg-green-50 text-green-900 px-2 py-0.5 rounded-full"
                          >
                            <Text className="text-xs">{specialty}</Text>
                          </View>
                        ))}
                        {partner.specialties.length > 2 && (
                          <View className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            <Text className="text-xs">
                              +{partner.specialties.length - 2}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <Text className="block text-base text-gray-500 mb-2">未找到匹配的律师</Text>
              <Text className="block text-sm text-gray-400">
                请尝试其他关键词
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default PartnersPage
