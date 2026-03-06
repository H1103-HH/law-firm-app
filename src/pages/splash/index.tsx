import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useEffect } from 'react'
import { Scale } from 'lucide-react-taro'
import './index.css'

const SplashPage = () => {
  useLoad(() => {
    console.log('过渡页面加载')
  })

  useEffect(() => {
    // 检查是否首次启动
    Taro.getStorage({
      key: 'hasFirstLaunch'
    })
      .then(() => {
        // 已首次启动，直接跳转到首页
        Taro.reLaunch({
          url: '/pages/index/index'
        })
      })
      .catch(() => {
        // 首次启动，显示过渡页2.5秒后跳转，并标记已首次启动
        const timer = setTimeout(() => {
          Taro.setStorage({
            key: 'hasFirstLaunch',
            data: true
          })
          Taro.reLaunch({
            url: '/pages/index/index'
          })
        }, 2500)

        return () => clearTimeout(timer)
      })
  }, [])

  return (
    <View className="min-h-screen bg-gradient-to-b from-green-900 to-green-950 flex flex-col items-center justify-center">
      {/* Logo 图标 */}
      <View className="flex items-center justify-center">
        <Scale className="w-24 h-24 text-white" strokeWidth={1.5} />

        {/* 转圈动画 - 使用绝对定位覆盖在 Logo 上 */}
        <View className="absolute inset-0 border-2 border-t-white border-transparent border-solid rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
      </View>
    </View>
  )
}

export default SplashPage
