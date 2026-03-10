import { View, Text, Image } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import type { FC } from 'react'
import './index.css'

// 配置信息（需要根据实际情况修改）
const CONFIG = {
  // 官网地址
  websiteUrl: 'https://www.dehenglaw.com',
  // 公众号二维码
  qrCodeUrl: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F10dd542bd81f5a828855d40d150231c0.jpg&nonce=90aeb68f-4126-4811-9fee-8b6af209fc84&project_id=7613615424479035434&sign=957c3eabf4a747fd1a10bd854d497077f0195717e38698fa758610a05773bf99'
}

const IndexPage: FC = () => {
  const [showQrCode, setShowQrCode] = useState(false)

  useLoad(() => {
    console.log('首页加载')
  })

  // 跳转官网
  const handleGoToWebsite = () => {
    Taro.navigateTo({
      url: `/pages/webview/index?url=${encodeURIComponent(CONFIG.websiteUrl)}&title=官网`
    })
  }

  // 显示公众号二维码
  const handleGoToOfficialAccount = () => {
    setShowQrCode(true)
  }

  // 关闭二维码弹窗
  const handleCloseQrCode = () => {
    setShowQrCode(false)
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
      <View className="absolute inset-0 flex flex-col items-center px-6 pt-[25vh]">
        {/* 访问官网按钮 */}
        <View
          className="bg-white rounded-xl px-8 py-3 shadow-lg active:scale-95 transition-transform mb-8 w-full max-w-xs"
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

      {/* 公众号二维码弹窗 */}
      {showQrCode && (
        <View className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <View className="bg-white rounded-2xl p-6 mx-6 max-w-sm w-full">
            {/* 标题 */}
            <Text className="block text-lg font-bold text-gray-900 text-center mb-4">
              关注德恒公众号
            </Text>

            {/* 二维码图片 */}
            <View className="flex justify-center mb-4">
              <Image
                src={CONFIG.qrCodeUrl}
                mode="widthFix"
                className="w-64 h-64"
              />
            </View>

            {/* 提示文字 */}
            <Text className="block text-sm text-gray-600 text-center mb-4">
              长按识别二维码关注
            </Text>

            {/* 关闭按钮 */}
            <View
              className="bg-gray-100 rounded-xl py-3 active:bg-gray-200"
              onClick={handleCloseQrCode}
            >
              <Text className="block text-base font-medium text-gray-900 text-center">
                关闭
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default IndexPage
