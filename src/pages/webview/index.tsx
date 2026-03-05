import { View, WebView } from '@tarojs/components'
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { useState } from 'react'
import type { FC } from 'react'
import './index.css'

const WebViewPage: FC = () => {
  const router = useRouter()
  const [url, setUrl] = useState('')

  useLoad(() => {
    const urlParam = router.params?.url || ''
    const titleParam = router.params?.title || '网页'
    setUrl(decodeURIComponent(urlParam))
    Taro.setNavigationBarTitle({ title: titleParam })
  })

  return (
    <View className="h-full w-full">
      <WebView src={url} />
    </View>
  )
}

export default WebViewPage
