import { View, Text, ScrollView, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, LogOut, ArrowRight } from 'lucide-react-taro'
import { Network } from '@/network'
import type { FC } from 'react'
import './index.css'

interface Lawyer {
  id: number
  name: string
  title: string
  avatar: string
  location: string
  specialties: string[]
  experience: string
  education: string
  description: string
  achievements: string[]
  phone?: string
  email?: string
  website?: string
  cases: string[]
  is_active: boolean
  created_at: string
  updated_at?: string
}

const AdminLawyersPage: FC = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkLogin()
    loadLawyers()
  }, [])

  const checkLogin = () => {
    const token = Taro.getStorageSync('adminToken')
    if (!token) {
      Taro.redirectTo({
        url: '/pages/admin/login/index'
      })
    }
  }

  const loadLawyers = async () => {
    try {
      const res = await Network.request({
        url: '/api/lawyers',
        method: 'GET'
      })

      console.log('律师列表响应:', res)

      if (res.data?.code === 200) {
        setLawyers(res.data.data || [])
      } else {
        Taro.showToast({
          title: res.data?.msg || '加载失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('加载律师列表错误:', error)
      Taro.showToast({
        title: '网络错误',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    Taro.navigateTo({
      url: '/pages/admin/lawyer-form/index'
    })
  }

  const handleEdit = (id: number) => {
    Taro.navigateTo({
      url: `/pages/admin/lawyer-form/index?id=${id}`
    })
  }

  const handleDelete = (id: number, name: string) => {
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除律师"${name}"吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            const deleteRes = await Network.request({
              url: `/api/lawyers/${id}`,
              method: 'DELETE'
            })

            if (deleteRes.data?.code === 200) {
              Taro.showToast({
                title: '删除成功',
                icon: 'success'
              })
              loadLawyers()
            } else {
              Taro.showToast({
                title: deleteRes.data?.msg || '删除失败',
                icon: 'none'
              })
            }
          } catch (error) {
            console.error('删除律师错误:', error)
            Taro.showToast({
              title: '网络错误',
              icon: 'none'
            })
          }
        }
      }
    })
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync('adminToken')
          Taro.removeStorageSync('adminInfo')
          Taro.redirectTo({
            url: '/pages/admin/login/index'
          })
        }
      }
    })
  }

  if (loading) {
    return (
      <View className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Text className="text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-100">
      {/* 顶部栏 */}
      <View className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <View className="flex items-center gap-2">
          <Text className="text-lg font-bold text-gray-900">律师管理</Text>
        </View>
        <View className="flex items-center gap-2">
          <View onClick={handleLogout} className="flex items-center gap-1">
            <LogOut className="w-5 h-5 text-red-600" />
          </View>
        </View>
      </View>

      <ScrollView scrollY className="h-full pb-20">
        {/* 新增按钮 */}
        <View className="px-4 py-4">
          <Button
            className="w-full bg-green-700 text-white rounded-lg py-3 flex items-center justify-center gap-2"
            onClick={handleAdd}
          >
            <Plus className="w-5 h-5 text-white" />
            <Text className="text-white font-medium">添加律师</Text>
          </Button>
        </View>

        {/* 律师列表 */}
        <View className="px-4 pb-6">
          {lawyers.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <Text className="block text-gray-500 mb-2">暂无律师信息</Text>
              <Text className="block text-sm text-gray-400">点击上方按钮添加律师</Text>
            </View>
          ) : (
            <View className="space-y-4">
              {lawyers.map((lawyer) => (
                <View
                  key={lawyer.id}
                  className="bg-white rounded-2xl p-5 shadow-sm"
                >
                  <View className="flex items-start gap-4 mb-4">
                    <View className="w-16 h-16 rounded-full border-2 border-green-100 bg-green-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      <Image
                        className="w-auto h-auto"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                        src={lawyer.avatar}
                        mode="aspectFit"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="block text-base font-bold text-gray-900 mb-1">
                        {lawyer.name}
                      </Text>
                      <Text className="block text-sm text-green-700 mb-1">
                        {lawyer.title}
                      </Text>
                      <View className="flex items-center gap-1">
                        <Text className="text-xs text-gray-500">{lawyer.location}</Text>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                      </View>
                    </View>
                  </View>

                  <View className="flex items-center gap-2">
                    <Button
                      className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm"
                      onClick={() => handleEdit(lawyer.id)}
                    >
                      <Pencil className="w-4 h-4 text-white mr-1" />
                      <Text className="text-white">编辑</Text>
                    </Button>
                    <Button
                      className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm"
                      onClick={() => handleDelete(lawyer.id, lawyer.name)}
                    >
                      <Trash2 className="w-4 h-4 text-white mr-1" />
                      <Text className="text-white">删除</Text>
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default AdminLawyersPage
