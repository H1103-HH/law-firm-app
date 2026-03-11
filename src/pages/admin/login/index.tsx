import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react-taro'
import type { FC } from 'react'
import './index.css'

const AdminLoginPage: FC = () => {
  const [loading, setLoading] = useState(false)

  const handleWeChatLogin = async () => {
    setLoading(true)

    try {
      // 微信登录逻辑
      const loginRes = await Taro.login()

      // 这里可以调用后端接口进行微信登录
      console.log('微信登录 code:', loginRes.code)

      Taro.showToast({
        title: '微信登录功能开发中',
        icon: 'none'
      })

      // TODO: 调用后端接口
      // const res = await Network.request({
      //   url: '/api/admin/wechat-login',
      //   method: 'POST',
      //   data: { code: loginRes.code }
      // })

    } catch (error) {
      console.error('微信登录错误:', error)
      Taro.showToast({
        title: '登录失败',
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
          <Text className="title">管理员登录</Text>
          <Text className="subtitle">德恒律师事务所</Text>
        </View>

        <View className="login-method">
          <Text className="method-title">使用微信登录</Text>
        </View>

        <Button
          className="wechat-btn"
          onClick={handleWeChatLogin}
          disabled={loading}
        >
          <View className="wechat-btn-content">
            <View className="wechat-icon-wrapper">
              <Text className="wechat-icon-text">微</Text>
            </View>
            <Text className="wechat-btn-text">
              {loading ? '登录中...' : '微信一键登录'}
            </Text>
          </View>
        </Button>

        <View className="tips">
          <Text className="tips-text">首次登录将自动创建管理员账号</Text>
        </View>
      </View>
    </View>
  )
}

export default AdminLoginPage
