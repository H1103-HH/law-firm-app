import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react-taro'
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
        Taro.setStorageSync('adminToken', res.data.data.token)
        Taro.setStorageSync('adminInfo', res.data.data)

        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })

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
    <View className="min-h-screen bg-gradient-to-b from-green-900 to-green-950">
      <View className="navbar">
        <Button
          className="navbar-btn"
          onClick={() => Taro.navigateBack()}
        >
          <ArrowLeft size={20} color="#fff" />
        </Button>
      </View>

      <View className="p-6 flex flex-col">
        <View className="flex-1 flex flex-col justify-center items-center">
          <Text className="block text-3xl font-bold text-white mb-8 text-center">
            管理员登录
          </Text>

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
              className="w-full bg-green-700 text-white rounded-lg py-3 flex items-center justify-center"
              onClick={handleLogin}
              disabled={loading}
            >
              <Text className="text-white font-medium">
                {loading ? '登录中...' : '登录'}
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  )
}

export default AdminLoginPage
