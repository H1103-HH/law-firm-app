import { View, Text, Image } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { ExternalLink, MessageSquare } from 'lucide-react-taro'
import type { FC } from 'react'
import './index.css'

// 配置信息（需要根据实际情况修改）
const CONFIG = {
  // 官网地址
  websiteUrl: 'https://www.example.com', // 替换为实际官网地址
  // 公众号小程序配置
  officialAccount: {
    appId: '', // 替换为实际公众号小程序 appId
    path: 'pages/index/index' // 替换为实际公众号页面路径
  }
}

const IndexPage: FC = () => {
  useLoad(() => {
    console.log('首页加载')
  })

  // 跳转官网
  const handleGoToWebsite = () => {
    Taro.navigateTo({
      url: `/pages/webview/index?url=${encodeURIComponent(CONFIG.websiteUrl)}&title=官网`
    })
  }

  // 跳转公众号
  const handleGoToOfficialAccount = () => {
    if (!CONFIG.officialAccount.appId) {
      Taro.showToast({
        title: '公众号配置未设置',
        icon: 'none'
      })
      return
    }

    Taro.navigateToMiniProgram({
      appId: CONFIG.officialAccount.appId,
      path: CONFIG.officialAccount.path,
      success: () => {
        console.log('跳转公众号成功')
      },
      fail: (err) => {
        console.error('跳转公众号失败', err)
        Taro.showToast({
          title: '跳转失败，请稍后重试',
          icon: 'none'
        })
      }
    })
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 律所图片 */}
      <View className="w-full aspect-[3/2] relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          mode="aspectFill"
          className="w-full h-full"
        />
        {/* 遮罩层 */}
        <View className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
      </View>

      {/* 按钮区域 */}
      <View className="px-6 py-8 space-y-4">
        {/* 访问官网按钮 */}
        <View
          className="bg-white rounded-2xl p-5 shadow-sm active:shadow-md transition-shadow"
          onClick={handleGoToWebsite}
        >
          <View className="flex items-center gap-4">
            <View className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-6 h-6 text-white" />
            </View>
            <View className="flex-1">
              <Text className="block text-lg font-bold text-gray-900 mb-1">
                访问官网
              </Text>
              <Text className="block text-sm text-gray-500">
                了解更多律所信息
              </Text>
            </View>
          </View>
        </View>

        {/* 关注公众号按钮 */}
        <View
          className="bg-white rounded-2xl p-5 shadow-sm active:shadow-md transition-shadow"
          onClick={handleGoToOfficialAccount}
        >
          <View className="flex items-center gap-4">
            <View className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-white" />
            </View>
            <View className="flex-1">
              <Text className="block text-lg font-bold text-gray-900 mb-1">
                关注公众号
              </Text>
              <Text className="block text-sm text-gray-500">
                获取最新法律资讯
              </Text>
            </View>
          </View>
        </View>

        {/* 提示信息 */}
        <View className="text-center pt-4">
          <Text className="block text-xs text-gray-400">
            正义律师事务所 · 专业法律服务
          </Text>
        </View>
      </View>
    </View>
  )
}

export default IndexPage
