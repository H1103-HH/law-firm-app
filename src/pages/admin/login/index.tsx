import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { LogIn } from 'lucide-react-taro'
import { Network } from '@/network'
import type { FC } from 'react'
import './index.css'

const AdminLoginPage: FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username || !password) {
      Taro.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      })
      return
    }

    setLoading(true)

    try {
      const res = await Network.request({
        url: '/api/admin/login',
        method: 'POST',
        data: { username, password }
      })

      console.log('登录响应:', res)

      if (res.data?.code === 200) {
        // 保存登录信息
        Taro.setStorageSync('adminToken', res.data.data.token)
        Taro.setStorageSync('adminInfo', res.data.data)

        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })

        // 跳转到律师管理列表页
        setTimeout(() => {
          Taro.redirectTo({
            url: '/pages/admin/lawyers/index'
          })
        }, 1500)
      } else {
        Taro.showToast({
          title: res.data?.msg || '登录失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('登录错误:', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="min-h-screen bg-gradient-to-b from-green-900 to-green-950 p-6 flex flex-col">
      {/* 头部 */}
      <View className="flex-1 flex flex-col justify-center items-center">
        <Text className="block text-3xl font-bold text-white mb-2 text-center">
          管理员登录
        </Text>
        <Text className="block text-green-200 mb-8 text-center">
          律师信息管理系统
        </Text>

        {/* 登录表单 */}
        <View className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-lg">
          <View className="mb-4">
            <Text className="block text-sm text-gray-700 mb-2">用户名</Text>
            <View className="bg-gray-50 rounded-lg px-4 py-3">
              <Input
                className="w-full bg-transparent text-base"
                placeholder="请输入用户名"
                value={username}
                onInput={(e) => setUsername(e.detail.value)}
                placeholderClass="text-gray-400"
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="block text-sm text-gray-700 mb-2">密码</Text>
            <View className="bg-gray-50 rounded-lg px-4 py-3">
              <Input
                className="w-full bg-transparent text-base"
                password
                placeholder="请输入密码"
                value={password}
                onInput={(e) => setPassword(e.detail.value)}
                placeholderClass="text-gray-400"
              />
            </View>
          </View>

          <Button
            className="w-full bg-green-700 text-white rounded-lg py-3 flex items-center justify-center gap-2"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <Text className="text-white">登录中...</Text>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <Text className="text-white font-medium">登录</Text>
              </>
            )}
          </Button>
        </View>

        {/* 提示信息 */}
        <View className="mt-6 text-center">
          <Text className="block text-xs text-green-200">
            默认账号：admin / admin123
          </Text>
        </View>
      </View>
    </View>
  )
}

export default AdminLoginPage
