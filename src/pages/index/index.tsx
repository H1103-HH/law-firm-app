import { View, Text, Image } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
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
    <View className="relative w-full h-screen overflow-hidden">
      {/* 全屏背景图片 */}
      <Image
        src="https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260224134815_5770_85%281%29.jpg&nonce=3119fa86-ebb0-49f7-9a9d-678199ab7856&project_id=7613615424479035434&sign=c0e2526210e47f7a2113b60195b5d8cf8ad4e4121317b5ac92d0e21d3f77bc71"
        mode="aspectFill"
        className="absolute inset-0 w-full h-full"
      />

      {/* 按钮区域 - 悬浮在图片上 */}
      <View className="absolute inset-0 flex flex-col items-center justify-start px-6 mt-[-25vh]">
        {/* 访问官网按钮 */}
        <View
          className="bg-white rounded-xl px-8 py-3 shadow-lg active:scale-95 transition-transform mb-3 w-full max-w-xs"
          onClick={handleGoToWebsite}
        >
          <Text className="block text-base font-bold text-gray-900 text-center">
            访问官网
          </Text>
        </View>

        {/* 关注公众号按钮 */}
        <View
          className="bg-white rounded-xl px-8 py-3 shadow-lg active:scale-95 transition-transform w-full max-w-xs"
          onClick={handleGoToOfficialAccount}
        >
          <Text className="block text-base font-bold text-gray-900 text-center">
            关注公众号
          </Text>
        </View>
      </View>
    </View>
  )
}

export default IndexPage
