import { View, Text, Input, Textarea, Button, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Save, ArrowLeft, Upload } from 'lucide-react-taro'
import { Network } from '@/network'
import type { FC } from 'react'
import './index.css'

interface LawyerFormData {
  name: string
  title: string
  avatar: string
  location: string
  specialties: string
  description: string
  achievements: string
  phone: string
  email: string
  website: string
  cases: string
}

const LawyerFormPage: FC = () => {
  const [lawyerId, setLawyerId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const [formData, setFormData] = useState<LawyerFormData>({
    name: '',
    title: '',
    avatar: '',
    location: '',
    specialties: '',
    description: '',
    achievements: '',
    phone: '',
    email: '',
    website: '',
    cases: ''
  })

  useEffect(() => {
    const { id } = Taro.getCurrentInstance().router?.params || {}
    if (id) {
      setLawyerId(Number(id))
      loadLawyer(Number(id))
    }
  }, [])

  const loadLawyer = async (id: number) => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/lawyers/${id}`,
        method: 'GET'
      })

      if (res.data?.code === 200 && res.data.data) {
        const data = res.data.data
        setFormData({
          name: data.name || '',
          title: data.title || '',
          avatar: data.avatar || '',
          location: data.location || '',
          specialties: data.specialties || '',
          description: data.description || '',
          achievements: data.achievements || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          cases: data.cases || ''
        })
      }
    } catch (error) {
      console.error('加载律师信息错误:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePath = res.tempFilePaths[0]
        setUploadingAvatar(true)

        try {
          console.log('上传头像:', tempFilePath)

          const uploadRes = await Network.uploadFile({
            url: '/api/upload',
            filePath: tempFilePath,
            name: 'file',
          })

          console.log('上传响应:', uploadRes)

          const data = JSON.parse(uploadRes.data)

          if (data.code === 200 && data.data.imageUrl) {
            setFormData({ ...formData, avatar: data.data.imageUrl })
            Taro.showToast({
              title: '上传成功',
              icon: 'success'
            })
          } else {
            throw new Error(data.msg || '上传失败')
          }
        } catch (error) {
          console.error('上传头像错误:', error)
          Taro.showToast({
            title: '上传失败',
            icon: 'none'
          })
        } finally {
          setUploadingAvatar(false)
        }
      }
    })
  }

  const handleSave = async () => {
    // 验证必填字段
    if (!formData.name || !formData.title || !formData.avatar || !formData.location ||
        !formData.description) {
      Taro.showToast({
        title: '请填写所有必填字段',
        icon: 'none'
      })
      return
    }

    setSaving(true)

    try {
      const url = lawyerId ? `/api/lawyers/${lawyerId}` : '/api/lawyers'
      const method = lawyerId ? 'PUT' : 'POST'

      const res = await Network.request({
        url,
        method,
        data: formData
      })

      if (res.data?.code === 200) {
        Taro.showToast({
          title: lawyerId ? '更新成功' : '创建成功',
          icon: 'success'
        })

        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } else {
        Taro.showToast({
          title: res.data?.msg || '保存失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('保存律师信息错误:', error)
      Taro.showToast({
        title: '网络错误',
        icon: 'none'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Text className="block text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-100">
      {/* 顶部栏 */}
      <View className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
        <View onClick={() => Taro.navigateBack()}>
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </View>
        <Text className="text-lg font-bold text-gray-900 flex-1">
          {lawyerId ? '编辑律师' : '添加律师'}
        </Text>
      </View>

      <ScrollView scrollY className="h-full pb-24">
        <View className="px-4 py-4 space-y-4">
          {/* 基本信息 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="block text-base font-bold text-gray-900 mb-4">基本信息</Text>

            <View className="mb-4">
              <Text className="block text-sm text-gray-700 mb-2">姓名 *</Text>
              <View className="bg-gray-50 rounded-lg px-4 py-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="请输入律师姓名"
                  value={formData.name}
                  onInput={(e) => setFormData({ ...formData, name: e.detail.value })}
                  placeholderClass="text-gray-400"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="block text-sm text-gray-700 mb-2">职务 *</Text>
              <View className="bg-gray-50 rounded-lg px-4 py-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="如：高级合伙人"
                  value={formData.title}
                  onInput={(e) => setFormData({ ...formData, title: e.detail.value })}
                  placeholderClass="text-gray-400"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="block text-sm text-gray-700 mb-2">头像 *</Text>
              <View className="bg-gray-50 rounded-2xl p-4">
                {formData.avatar ? (
                  <View className="flex items-center gap-4">
                    <Image
                      className="w-20 h-20 rounded-full object-cover"
                      src={formData.avatar}
                      mode="aspectFill"
                    />
                    <Button
                      className="bg-green-700 text-white rounded-lg px-4 py-2"
                      onClick={handleAvatarUpload}
                      disabled={uploadingAvatar}
                    >
                      <Upload className="w-4 h-4 text-white" />
                      <Text className="text-white text-sm ml-1">
                        {uploadingAvatar ? '上传中...' : '更换头像'}
                      </Text>
                    </Button>
                  </View>
                ) : (
                  <Button
                    className="w-full bg-green-700 text-white rounded-lg py-3 flex items-center justify-center gap-2"
                    onClick={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  >
                    <Upload className="w-5 h-5 text-white" />
                    <Text className="text-white font-medium">
                      {uploadingAvatar ? '上传中...' : '上传头像'}
                    </Text>
                  </Button>
                )}
              </View>
            </View>

            <View className="mb-4">
              <Text className="block text-sm text-gray-700 mb-2">所在城市 *</Text>
              <View className="bg-gray-50 rounded-lg px-4 py-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="如：北京"
                  value={formData.location}
                  onInput={(e) => setFormData({ ...formData, location: e.detail.value })}
                  placeholderClass="text-gray-400"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="block text-sm text-gray-700 mb-2">个人简介 *</Text>
              <View className="bg-gray-50 rounded-2xl p-4">
                <Textarea
                  className="w-full bg-transparent text-base"
                  placeholder="请输入律师个人简介"
                  value={formData.description}
                  onInput={(e) => setFormData({ ...formData, description: e.detail.value })}
                  placeholderClass="text-gray-400"
                  maxlength={1000}
                  autoHeight
                  style={{ minHeight: '100px' }}
                />
              </View>
            </View>
          </View>

          {/* 专业领域 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="block text-base font-bold text-gray-900 mb-4">专业领域</Text>
            <View className="bg-gray-50 rounded-2xl p-4">
              <Textarea
                className="w-full bg-transparent text-base"
                placeholder="请输入专业领域，如：公司法、知识产权、刑事辩护等"
                value={formData.specialties}
                onInput={(e) => setFormData({ ...formData, specialties: e.detail.value })}
                placeholderClass="text-gray-400"
                maxlength={500}
                autoHeight
                style={{ minHeight: '80px' }}
              />
            </View>
          </View>

          {/* 荣誉成就 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="block text-base font-bold text-gray-900 mb-4">荣誉成就（可选）</Text>
            <View className="bg-gray-50 rounded-2xl p-4">
              <Textarea
                className="w-full bg-transparent text-base"
                placeholder="请输入荣誉成就"
                value={formData.achievements}
                onInput={(e) => setFormData({ ...formData, achievements: e.detail.value })}
                placeholderClass="text-gray-400"
                maxlength={1000}
                autoHeight
                style={{ minHeight: '80px' }}
              />
            </View>
          </View>

          {/* 联系方式 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="block text-base font-bold text-gray-900 mb-4">联系方式（可选）</Text>

            <View className="mb-4">
              <Text className="block text-sm text-gray-700 mb-2">电话</Text>
              <View className="bg-gray-50 rounded-lg px-4 py-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="请输入联系电话"
                  value={formData.phone}
                  onInput={(e) => setFormData({ ...formData, phone: e.detail.value })}
                  placeholderClass="text-gray-400"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="block text-sm text-gray-700 mb-2">邮箱</Text>
              <View className="bg-gray-50 rounded-lg px-4 py-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="请输入邮箱地址"
                  value={formData.email}
                  onInput={(e) => setFormData({ ...formData, email: e.detail.value })}
                  placeholderClass="text-gray-400"
                />
              </View>
            </View>

            <View>
              <Text className="block text-sm text-gray-700 mb-2">官网</Text>
              <View className="bg-gray-50 rounded-lg px-4 py-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="请输入官网链接"
                  value={formData.website}
                  onInput={(e) => setFormData({ ...formData, website: e.detail.value })}
                  placeholderClass="text-gray-400"
                />
              </View>
            </View>
          </View>

          {/* 典型案例 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="block text-base font-bold text-gray-900 mb-4">典型案例 *</Text>
            <View className="bg-gray-50 rounded-2xl p-4">
              <Textarea
                className="w-full bg-transparent text-base"
                placeholder="请输入典型案例"
                value={formData.cases}
                onInput={(e) => setFormData({ ...formData, cases: e.detail.value })}
                placeholderClass="text-gray-400"
                maxlength={1000}
                autoHeight
                style={{ minHeight: '80px' }}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 底部保存按钮 */}
      <View style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e5e5',
        zIndex: 100
      }}
      >
        <Button
          className="flex-1 bg-green-700 text-white rounded-lg py-3 flex items-center justify-center gap-2"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Text className="text-white">保存中...</Text>
          ) : (
            <>
              <Save className="w-5 h-5 text-white" />
              <Text className="text-white font-medium">保存</Text>
            </>
          )}
        </Button>
      </View>
    </View>
  )
}

export default LawyerFormPage
