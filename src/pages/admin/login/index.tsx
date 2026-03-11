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
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="admin-login-page">
      <View className="navbar">
        <Button
          className="navbar-btn"
          onClick={() => Taro.navigateBack()}
        >
          <ArrowLeft size={20} color="#1a1a1a" />
        </Button>
      </View>

      <View className="content">
        <View className="header">
          <Text className="title">欢迎回来</Text>
          <Text className="subtitle">管理员登录</Text>
        </View>

        <View className="form-card">
          <View className="input-group">
            <Text className="input-label">用户名</Text>
            <View className="input-wrapper">
              <Input
                className="input"
                placeholder="请输入用户名"
                value={username}
                onInput={(e) => setUsername(e.detail.value)}
                placeholderClass="input-placeholder"
              />
            </View>
          </View>

          <View className="input-group">
            <Text className="input-label">密码</Text>
            <View className="input-wrapper">
              <Input
                className="input"
                password
                placeholder="请输入密码"
                value={password}
                onInput={(e) => setPassword(e.detail.value)}
                placeholderClass="input-placeholder"
              />
            </View>
          </View>

          <Button
            className="submit-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            <Text className="submit-btn-text">
              {loading ? '登录中...' : '登录'}
            </Text>
          </Button>
        </View>

        <View className="footer">
          <Text className="footer-text">德恒律师事务所</Text>
        </View>
      </View>
    </View>
  )
}

export default AdminLoginPage
