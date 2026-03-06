import { View, Text, Input, Textarea, Button, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react-taro'
import { Network } from '@/network'
import type { FC } from 'react'
import './index.css'

interface LawyerFormData {
  name: string
  title: string
  avatar: string
  location: string
  specialties: string[]
  experience: string
  education: string
  description: string
  achievements: string[]
  phone: string
  email: string
  website: string
  cases: string[]
}

const LawyerFormPage: FC = () => {
  const [lawyerId, setLawyerId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<LawyerFormData>({
    name: '',
    title: '',
    avatar: '',
    location: '',
    specialties: [],
    experience: '',
    education: '',
    description: '',
    achievements: [],
    phone: '',
    email: '',
    website: '',
    cases: []
  })

  const [newSpecialty, setNewSpecialty] = useState('')
  const [newAchievement, setNewAchievement] = useState('')
  const [newCase, setNewCase] = useState('')

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
          specialties: data.specialties || [],
          experience: data.experience || '',
          education: data.education || '',
          description: data.description || '',
          achievements: data.achievements || [],
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          cases: data.cases || []
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

  const handleSave = async () => {
    // 验证必填字段
    if (!formData.name || !formData.title || !formData.avatar || !formData.location ||
        !formData.experience || !formData.education || !formData.description) {
      Taro.showToast({
        title: '请填写所有必填字段',
        icon: 'none'
      })
      return
    }

    if (formData.specialties.length === 0) {
      Taro.showToast({
        title: '请至少添加一个专业领域',
        icon: 'none'
      })
      return
    }

    if (formData.cases.length === 0) {
      Taro.showToast({
        title: '请至少添加一个典型案例',
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

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, newSpecialty.trim()]
      })
      setNewSpecialty('')
    }
  }

  const removeSpecialty = (index: number) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((_, i) => i !== index)
    })
  }

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, newAchievement.trim()]
      })
      setNewAchievement('')
    }
  }

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index)
    })
  }

  const addCase = () => {
    if (newCase.trim()) {
      setFormData({
        ...formData,
        cases: [...formData.cases, newCase.trim()]
      })
      setNewCase('')
    }
  }

  const removeCase = (index: number) => {
    setFormData({
      ...formData,
      cases: formData.cases.filter((_, i) => i !== index)
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
              <Text className="block text-sm text-gray-700 mb-2">头像 URL *</Text>
              <View className="bg-gray-50 rounded-lg px-4 py-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="请输入头像图片链接"
                  value={formData.avatar}
                  onInput={(e) => setFormData({ ...formData, avatar: e.detail.value })}
                  placeholderClass="text-gray-400"
                />
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
              <Text className="block text-sm text-gray-700 mb-2">从业年限 *</Text>
              <View className="bg-gray-50 rounded-lg px-4 py-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="如：20年"
                  value={formData.experience}
                  onInput={(e) => setFormData({ ...formData, experience: e.detail.value })}
                  placeholderClass="text-gray-400"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="block text-sm text-gray-700 mb-2">教育背景 *</Text>
              <View className="bg-gray-50 rounded-lg px-4 py-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="如：清华大学法学院博士"
                  value={formData.education}
                  onInput={(e) => setFormData({ ...formData, education: e.detail.value })}
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

            <View className="space-y-2 mb-3">
              {formData.specialties.map((specialty, index) => (
                <View
                  key={index}
                  className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2"
                >
                  <Text className="text-sm text-green-900">{specialty}</Text>
                  <Trash2
                    className="w-4 h-4 text-red-500"
                    onClick={() => removeSpecialty(index)}
                  />
                </View>
              ))}
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
              <View style={{ flex: 1, backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '8px 12px' }}>
                <Input
                  className="w-full bg-transparent text-sm"
                  placeholder="添加专业领域"
                  value={newSpecialty}
                  onInput={(e) => setNewSpecialty(e.detail.value)}
                  placeholderClass="text-gray-400"
                />
              </View>
              <Button
                className="flex-shrink-0 bg-green-700 text-white rounded-lg px-3"
                onClick={addSpecialty}
              >
                <Plus className="w-4 h-4 text-white" />
              </Button>
            </View>
          </View>

          {/* 荣誉成就 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="block text-base font-bold text-gray-900 mb-4">荣誉成就（可选）</Text>

            <View className="space-y-2 mb-3">
              {formData.achievements.map((achievement, index) => (
                <View
                  key={index}
                  className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2"
                >
                  <Text className="text-sm text-blue-900">{achievement}</Text>
                  <Trash2
                    className="w-4 h-4 text-red-500"
                    onClick={() => removeAchievement(index)}
                  />
                </View>
              ))}
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
              <View style={{ flex: 1, backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '8px 12px' }}>
                <Input
                  className="w-full bg-transparent text-sm"
                  placeholder="添加荣誉成就"
                  value={newAchievement}
                  onInput={(e) => setNewAchievement(e.detail.value)}
                  placeholderClass="text-gray-400"
                />
              </View>
              <Button
                className="flex-shrink-0 bg-blue-500 text-white rounded-lg px-3"
                onClick={addAchievement}
              >
                <Plus className="w-4 h-4 text-white" />
              </Button>
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

            <View className="space-y-2 mb-3">
              {formData.cases.map((case_, index) => (
                <View
                  key={index}
                  className="flex items-center justify-between bg-purple-50 rounded-lg px-3 py-2"
                >
                  <Text className="text-sm text-purple-900">{case_}</Text>
                  <Trash2
                    className="w-4 h-4 text-red-500"
                    onClick={() => removeCase(index)}
                  />
                </View>
              ))}
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
              <View style={{ flex: 1, backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '8px 12px' }}>
                <Input
                  className="w-full bg-transparent text-sm"
                  placeholder="添加典型案例"
                  value={newCase}
                  onInput={(e) => setNewCase(e.detail.value)}
                  placeholderClass="text-gray-400"
                />
              </View>
              <Button
                className="flex-shrink-0 bg-purple-600 text-white rounded-lg px-3"
                onClick={addCase}
              >
                <Plus className="w-4 h-4 text-white" />
              </Button>
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
