import { View, Text, ScrollView, Button, Image, Input } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { Shield, User, Camera } from 'lucide-react-taro'
import type { FC } from 'react'
import { Network } from '@/network'
import './index.css'

const LoginPage: FC = () => {
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'client' | 'partner' | null>(null)
  const [showUserInfoForm, setShowUserInfoForm] = useState(false)
  const [userNickname, setUserNickname] = useState('')
  const [userAvatar, setUserAvatar] = useState('')

  useLoad(() => {
    console.log('登录页面加载')
    // 检查是否已登录
    const userInfo = Taro.getStorageSync('userInfo')
    if (userInfo) {
      // 已登录，跳转到我的页面
      Taro.switchTab({
        url: '/pages/profile/index'
      })
    }
  })

  // 选择头像
  const handleChooseAvatar = (e: any) => {
    console.log('选择头像:', e.detail)
    const avatarUrl = e.detail.avatarUrl
    setUserAvatar(avatarUrl)
  }

  // 输入昵称
  const handleNicknameInput = (e: any) => {
    console.log('输入昵称:', e.detail.value)
    setUserNickname(e.detail.value)
  }

  // 显示用户信息表单
  const handleShowUserInfoForm = () => {
    if (!selectedRole) {
      Taro.showToast({
        title: '请选择身份',
        icon: 'none'
      })
      return
    }
    setShowUserInfoForm(true)
  }

  // 微信登录
  const handleWechatLogin = async () => {
    if (!userNickname) {
      Taro.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return
    }

    if (!userAvatar) {
      Taro.showToast({
        title: '请选择头像',
        icon: 'none'
      })
      return
    }

    try {
      setLoading(true)

      // 获取微信登录码
      const loginRes = await Taro.login()
      console.log('微信登录码:', loginRes.code)

      if (!loginRes.code) {
        throw new Error('获取微信登录码失败')
      }

      // 调用后端登录接口
      const res = await Network.request({
        url: '/api/auth/login',
        method: 'POST',
        data: {
          code: loginRes.code,
          role: selectedRole,
          nickname: userNickname,
          avatar: userAvatar
        }
      })

      console.log('登录响应:', res.data)

      if (res.data.code === 200) {
        const user = res.data.data

        // 存储用户信息
        Taro.setStorageSync('userInfo', user)
        Taro.setStorageSync('token', user.token)

        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })

        // 跳转到我的页面
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/profile/index'
          })
        }, 1500)
      } else {
        throw new Error(res.data.msg || '登录失败')
      }
    } catch (error: any) {
      console.error('登录失败:', error)
      Taro.showToast({
        title: error.message || '登录失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="min-h-screen bg-gray-100">
      <ScrollView scrollY className="h-full">
        {showUserInfoForm ? (
          // 用户信息填写表单
          <View className="px-4 pt-16 pb-6">
            <View className="text-center mb-12">
              <Text className="block text-3xl font-bold text-gray-900 mb-3">
                完善个人信息
              </Text>
              <Text className="block text-base text-gray-500">
                请填写您的昵称和头像
              </Text>
            </View>

            {/* 头像选择 */}
            <View className="mb-8 flex flex-col items-center">
              <View className="mb-4">
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                    mode="aspectFill"
                  />
                ) : (
                  <View className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                    <Camera className="w-10 h-10 text-gray-400" />
                  </View>
                )}
              </View>

              <Button
                openType="chooseAvatar"
                onChooseAvatar={handleChooseAvatar}
                className="bg-blue-500 text-white rounded-xl px-6 py-3 text-sm font-medium"
              >
                选择头像
              </Button>
            </View>

            {/* 昵称输入 */}
            <View className="mb-8">
              <Text className="block text-sm font-bold text-gray-700 mb-3">
                昵称
              </Text>
              <View className="bg-white rounded-xl p-4 shadow-sm">
                <Input
                  type="nickname"
                  placeholder="请输入您的昵称"
                  value={userNickname}
                  onInput={handleNicknameInput}
                  className="w-full text-base"
                  maxlength={20}
                />
              </View>
            </View>

            {/* 确认登录按钮 */}
            <View
              className={`bg-green-500 text-white rounded-2xl py-4 px-6 w-full text-center ${
                loading ? 'opacity-50' : ''
              }`}
              onClick={!loading ? handleWechatLogin : undefined}
            >
              {loading ? (
                <Text className="block text-base font-medium">登录中...</Text>
              ) : (
                <Text className="block text-base font-medium">
                  确认登录
                </Text>
              )}
            </View>

            {/* 返回按钮 */}
            <View
              className="mt-4 text-center"
              onClick={() => setShowUserInfoForm(false)}
            >
              <Text className="block text-sm text-gray-500">
                返回上一步
              </Text>
            </View>
          </View>
        ) : (
          // 身份选择页面
          <View className="px-4 pt-16 pb-6">
            {/* 标题 */}
            <View className="text-center mb-12">
              <Text className="block text-3xl font-bold text-gray-900 mb-3">
                欢迎登录
              </Text>
              <Text className="block text-base text-gray-500">
                德恒律师事务所
              </Text>
            </View>

            {/* 身份选择 */}
            <View className="mb-8">
              <Text className="block text-lg font-bold text-gray-900 mb-4 text-center">
                请选择您的身份
              </Text>
              <View className="space-y-4">
                {/* 客户选项 */}
                <View
                  className={`bg-white rounded-2xl p-6 shadow-sm border-2 cursor-pointer ${
                    selectedRole === 'client'
                      ? 'border-green-700 bg-green-50'
                      : 'border-transparent'
                  }`}
                  onClick={() => setSelectedRole('client')}
                >
                  <View className="flex items-center gap-4">
                    <View
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedRole === 'client'
                          ? 'bg-green-700'
                          : 'bg-gray-100'
                      }`}
                    >
                      <User
                        className={`w-6 h-6 ${
                          selectedRole === 'client'
                            ? 'text-white'
                            : 'text-gray-400'
                        }`}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`block text-lg font-bold ${
                          selectedRole === 'client'
                            ? 'text-green-900'
                            : 'text-gray-900'
                        }`}
                      >
                        客户
                      </Text>
                    </View>
                    {selectedRole === 'client' && (
                      <View className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center">
                        <Text className="text-white text-xs">✓</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* 合伙人选项 */}
                <View
                  className={`bg-white rounded-2xl p-6 shadow-sm border-2 cursor-pointer ${
                    selectedRole === 'partner'
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-transparent'
                  }`}
                  onClick={() => setSelectedRole('partner')}
                >
                  <View className="flex items-center gap-4">
                    <View
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedRole === 'partner'
                          ? 'bg-amber-600'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Shield
                        className={`w-6 h-6 ${
                          selectedRole === 'partner'
                            ? 'text-white'
                            : 'text-gray-400'
                        }`}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`block text-lg font-bold ${
                          selectedRole === 'partner'
                            ? 'text-amber-900'
                            : 'text-gray-900'
                        }`}
                      >
                        合伙人
                      </Text>
                    </View>
                    {selectedRole === 'partner' && (
                      <View className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center">
                        <Text className="text-white text-xs">✓</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* 微信登录按钮 */}
            <View
              className={`bg-green-500 text-white rounded-2xl py-4 px-6 w-full text-center ${
                selectedRole ? 'active:bg-green-600' : 'opacity-50'
              }`}
              onClick={selectedRole && !loading ? handleShowUserInfoForm : undefined}
            >
              <Text className="block text-base font-medium">
                下一步
              </Text>
            </View>

            {/* 温馨提示 */}
            <View className="mt-8 text-center">
              <Text className="block text-xs text-gray-400 leading-relaxed">
                登录即表示您同意《用户协议》和《隐私政策》
              </Text>
            </View>

            {/* 管理员入口（不显眼，放在底部角落） */}
            <View
              className="mt-4 text-right"
              onClick={() => Taro.navigateTo({ url: '/pages/admin/login/index' })}
            >
              <Text className="block text-xs text-gray-300">
                管理员入口
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default LoginPage
