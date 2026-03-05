import { View, Text, ScrollView, Textarea } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { MessageCircle, Send } from 'lucide-react-taro'
import type { FC } from 'react'
import './index.css'

const NewConsultationPage: FC = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useLoad(() => {
    console.log('新建咨询页面加载')
  })

  const handleSubmit = () => {
    if (!title.trim()) {
      Taro.showToast({
        title: '请输入咨询标题',
        icon: 'none'
      })
      return
    }

    if (!content.trim()) {
      Taro.showToast({
        title: '请输入咨询内容',
        icon: 'none'
      })
      return
    }

    Taro.showLoading({ title: '提交中...' })

    // 模拟提交咨询
    setTimeout(() => {
      Taro.hideLoading()
      Taro.showToast({
        title: '咨询提交成功',
        icon: 'success'
      })
      // 返回上一页
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    }, 1000)
  }

  return (
    <View className="min-h-screen bg-gray-100">
      <ScrollView scrollY className="h-full">
        <View className="px-4 py-6">
          {/* 咨询标题 */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-5 h-5 text-green-700" />
              <Text className="block text-base font-bold text-gray-900">
                咨询标题
              </Text>
            </View>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Textarea
                className="w-full text-base bg-transparent"
                placeholder="请输入咨询标题（例如：关于公司注册的咨询）"
                value={title}
                onInput={(e) => setTitle(e.detail.value)}
                maxlength={50}
              />
              <View className="text-right mt-2">
                <Text className="text-xs text-gray-400">
                  {title.length}/50
                </Text>
              </View>
            </View>
          </View>

          {/* 咨询内容 */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex items-center gap-2 mb-3">
              <Send className="w-5 h-5 text-green-700" />
              <Text className="block text-base font-bold text-gray-900">
                咨询内容
              </Text>
            </View>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Textarea
                className="w-full h-60 text-sm bg-transparent"
                placeholder="请详细描述您的咨询内容，我们的律师会尽快为您解答..."
                value={content}
                onInput={(e) => setContent(e.detail.value)}
                maxlength={1000}
              />
              <View className="text-right mt-2">
                <Text className="text-xs text-gray-400">
                  {content.length}/1000
                </Text>
              </View>
            </View>
          </View>

          {/* 提交按钮 */}
          <View
            className="bg-green-900 text-white rounded-2xl py-4 px-6 w-full text-center shadow-lg active:bg-green-800"
            onClick={handleSubmit}
          >
            <Text className="block text-base font-medium">提交咨询</Text>
          </View>

          {/* 温馨提示 */}
          <View className="mt-6">
            <Text className="block text-xs text-gray-400 leading-relaxed">
              温馨提示：\n
              1. 请尽量详细地描述您的问题，以便律师更准确地为您解答\n
              2. 咨询提交后，律师会在24小时内回复\n
              3. 如有紧急问题，请直接拨打律所电话 400-800-8888
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default NewConsultationPage
