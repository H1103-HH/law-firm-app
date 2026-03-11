import { View, Text, ScrollView, Image, Textarea } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { MessageCircle, User } from 'lucide-react-taro'
import type { FC } from 'react'
import './index.css'

interface ConsultationDetail {
  id: number
  title: string
  content: string
  status: 'pending' | 'replied'
  createTime: string
  clientName?: string
  clientAvatar?: string
  lawyerName?: string
  lawyerAvatar?: string
  reply?: string
  replyTime?: string
}

const ConsultationDetailPage: FC = () => {
  const [userType, setUserType] = useState<'client' | 'partner'>('client')
  const [consultation, setConsultation] = useState<ConsultationDetail | null>(null)
  const [replyText, setReplyText] = useState('')

  useLoad((options) => {
    const type = options?.type as 'client' | 'partner' || 'client'
    const id = options?.id ? parseInt(options.id) : 1
    setUserType(type)
    loadConsultationDetail(id)
  })

  const loadConsultationDetail = (id: number) => {
    // 模拟咨询详情数据
    const mockDetail: ConsultationDetail = {
      id,
      title: '关于公司注册的咨询',
      content: '您好，我想咨询一下公司注册的相关流程和需要准备的材料。我想在北京注册一家有限责任公司，大概需要多长时间？注册资本有什么要求吗？',
      status: 'replied',
      createTime: '2024-03-01 10:30',
      clientName: '张三',
      clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      lawyerName: '张律师',
      lawyerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
      reply: '您好，关于公司注册的问题，我来为您详细解答：\n\n1. **注册流程**：\n   - 公司名称核准（1-3个工作日）\n   - 提交注册材料（3-5个工作日）\n   - 领取营业执照（1-2个工作日）\n   - 刻章、税务登记等（2-3个工作日）\n   总体大约需要7-13个工作日\n\n2. **注册资本**：\n   - 现在实行认缴制，无需实缴\n   - 最低注册资本为3万元\n   - 建议根据公司实际业务情况设定\n\n3. **需要准备的材料**：\n   - 公司章程\n   - 股东身份证明\n   - 注册地址证明\n   - 法定代表人身份证明\n\n如果您还有其他问题，欢迎随时咨询。',
      replyTime: '2024-03-01 14:20'
    }
    setConsultation(mockDetail)
  }

  const handleSendReply = () => {
    if (!replyText.trim()) {
      Taro.showToast({
        title: '请输入回复内容',
        icon: 'none'
      })
      return
    }

    // 模拟发送回复
    Taro.showLoading({ title: '发送中...' })
    setTimeout(() => {
      Taro.hideLoading()
      Taro.showToast({
        title: '回复成功',
        icon: 'success'
      })
      setReplyText('')
      // 更新咨询状态
      if (consultation) {
        setConsultation({
          ...consultation,
          status: 'replied',
          reply: replyText,
          replyTime: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        })
      }
    }, 1000)
  }

  if (!consultation) {
    return (
      <View className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Text className="block text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-100">
      <ScrollView scrollY className="h-full pb-6">
        <View className="px-4 py-4">
          {/* 咨询信息 */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-5 h-5 text-green-700" />
              <Text className="block text-base font-bold text-gray-900">
                {consultation.title}
              </Text>
              <View
                className={`ml-auto px-2 py-0.5 rounded-full ${
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
            <Text className="block text-sm text-gray-500 mb-3">
              {consultation.createTime}
            </Text>
            <View className="bg-gray-50 rounded-xl p-4">
              <Text className="block text-sm text-gray-900 leading-relaxed">
                {consultation.content}
              </Text>
            </View>
          </View>

          {/* 客户信息 */}
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm flex items-center gap-3">
            <Image
              className="w-10 h-10 rounded-full object-cover"
              src={consultation.clientAvatar || ''}
              mode="aspectFill"
            />
            <View className="flex-1">
              <Text className="block text-sm font-medium text-gray-900">
                {consultation.clientName || '客户'}
              </Text>
              <Text className="block text-xs text-gray-500">客户</Text>
            </View>
          </View>

          {/* 回复区域 */}
          {consultation.status === 'replied' && consultation.reply ? (
            <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <View className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-green-700" />
                <Text className="block text-base font-bold text-gray-900">
                  律师回复
                </Text>
              </View>
              <Text className="block text-sm text-gray-500 mb-3">
                {consultation.replyTime || ''}
              </Text>
              <View className="bg-green-50 rounded-xl p-4">
                <Text className="block text-sm text-gray-900 leading-relaxed whitespace-pre-line">
                  {consultation.reply || ''}
                </Text>
              </View>
              <View className="flex items-center gap-3 mt-3">
                <Image
                  className="w-10 h-10 rounded-full object-cover"
                  src={consultation.lawyerAvatar || ''}
                  mode="aspectFill"
                />
                <View className="flex-1">
                  <Text className="block text-sm font-medium text-gray-900">
                    {consultation.lawyerName || '律师'}
                  </Text>
                  <Text className="block text-xs text-gray-500">律师</Text>
                </View>
              </View>
            </View>
          ) : userType === 'partner' && consultation.status === 'pending' && (
            <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <View className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-green-700" />
                <Text className="block text-base font-bold text-gray-900">
                  添加回复
                </Text>
              </View>
              <View className="bg-gray-50 rounded-xl p-4 mb-3">
                <Textarea
                  className="w-full h-40 text-sm bg-transparent"
                  placeholder="请输入回复内容..."
                  value={replyText}
                  onInput={(e) => setReplyText(e.detail.value)}
                  maxlength={1000}
                />
              </View>
              <View
                className="bg-green-900 text-white rounded-xl py-3 px-6 w-full text-center active:bg-green-800"
                onClick={handleSendReply}
              >
                <Text className="block text-sm font-medium">发送回复</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default ConsultationDetailPage
