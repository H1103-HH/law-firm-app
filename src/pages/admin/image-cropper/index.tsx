import { View, Text, Button, Canvas, Image, Slider } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Check, RotateCw } from 'lucide-react-taro'
import type { FC } from 'react'
import './index.css'

const ImageCropperPage: FC = () => {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState('')
  const [imageInfo, setImageInfo] = useState({ width: 0, height: 0 })
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [cropping, setCropping] = useState(false)

  const canvasRef = useRef<any>(null)
  const canvasContextRef = useRef<any>(null)

  useEffect(() => {
    const { url } = router.params
    if (url) {
      setImageUrl(decodeURIComponent(url))
      getImageInfo(decodeURIComponent(url))
    }
  }, [])

  useEffect(() => {
    if (canvasRef.current) {
      canvasContextRef.current = Taro.createCanvasContext('cropper', canvasRef.current)
    }
  }, [canvasRef])

  const getImageInfo = (url: string) => {
    Taro.getImageInfo({
      src: url,
      success: (res) => {
        console.log('图片信息:', res)
        setImageInfo({ width: res.width, height: res.height })
      },
      fail: (err) => {
        console.error('获取图片信息失败:', err)
        Taro.showToast({
          title: '获取图片信息失败',
          icon: 'none'
        })
      }
    })
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleTouchStart = (e: any) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    })
  }

  const handleTouchMove = (e: any) => {
    if (!isDragging) return

    e.preventDefault()
    const touch = e.touches[0]
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleCrop = async () => {
    setCropping(true)

    try {
      // 获取裁剪区域信息
      const query = Taro.createSelectorQuery()
      query.select('#cropperCanvas')
        .fields({ node: true, size: true })
        .exec(async (res) => {
          if (!res[0]) {
            throw new Error('Canvas 不存在')
          }

          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const canvasWidth = res[0].width
          const canvasHeight = res[0].height

          // 设置 canvas 尺寸为裁剪后的尺寸（正方形）
          const cropSize = Math.min(canvasWidth, canvasHeight)
          canvas.width = cropSize
          canvas.height = cropSize

          // 计算绘制参数
          let drawWidth = imageInfo.width * scale
          let drawHeight = imageInfo.height * scale

          // 处理旋转
          if (rotation === 90 || rotation === 270) {
            drawWidth = imageInfo.height * scale
            drawHeight = imageInfo.width * scale
          }

          // 计算中心偏移（考虑拖动位置）
          const centerX = cropSize / 2 + position.x
          const centerY = cropSize / 2 + position.y

          // 绘制图片
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, cropSize, cropSize)

          ctx.save()
          ctx.translate(centerX, centerY)
          ctx.rotate((rotation * Math.PI) / 180)

          const img = canvas.createImage()
          img.src = imageUrl
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
          })

          ctx.drawImage(
            img,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight
          )
          ctx.restore()

          // 导出裁剪后的图片
          const tempFilePath = await Taro.canvasToTempFilePath({
            canvas,
            width: cropSize,
            height: cropSize,
            fileType: 'jpg',
            quality: 0.9
          })

          console.log('裁剪成功:', tempFilePath.tempFilePath)

          // 返回上一页并传递裁剪后的图片路径
          Taro.navigateBack({
            success: () => {
              // 通过全局事件或缓存传递结果
              Taro.setStorageSync('croppedImage', tempFilePath.tempFilePath)
            }
          })
        })
    } catch (error) {
      console.error('裁剪失败:', error)
      Taro.showToast({
        title: '裁剪失败',
        icon: 'none'
      })
    } finally {
      setCropping(false)
    }
  }

  const handleCancel = () => {
    Taro.navigateBack()
  }

  // 计算显示尺寸
  const containerSize = 300 // 容器尺寸
  const displayScale = Math.min(
    containerSize / imageInfo.width,
    containerSize / imageInfo.height
  ) * scale

  const displayWidth = imageInfo.width * displayScale
  const displayHeight = imageInfo.height * displayScale

  return (
    <View className="image-cropper-page">
      {/* 顶部导航栏 */}
      <View className="navbar">
        <Button
          className="navbar-btn"
          onClick={handleCancel}
        >
          <ArrowLeft size={20} color="#333" />
        </Button>
        <Text className="navbar-title">裁剪头像</Text>
        <Button
          className={`navbar-btn ${cropping ? 'disabled' : ''}`}
          onClick={handleCrop}
          disabled={cropping}
        >
          <Check size={20} color={cropping ? '#999' : '#1890ff'} />
        </Button>
      </View>

      {/* 裁剪区域 */}
      <View className="cropper-container">
        <View className="cropper-area">
          {/* Canvas 用于最终裁剪 */}
          <Canvas
            id="cropperCanvas"
            type="2d"
            className="cropper-canvas"
            ref={canvasRef}
          />

          {/* 图片预览 */}
          <Image
            className={`cropper-image ${rotation !== 0 ? 'rotated' : ''}`}
            src={imageUrl}
            mode="aspectFit"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              width: `${displayWidth}px`,
              height: `${displayHeight}px`,
              transform: `rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
            }}
          />

          {/* 裁剪框 */}
          <View className="crop-box">
            <View className="crop-border top-left" />
            <View className="crop-border top-right" />
            <View className="crop-border bottom-left" />
            <View className="crop-border bottom-right" />
            <View className="crop-grid">
              <View className="grid-line horizontal-1" />
              <View className="grid-line horizontal-2" />
              <View className="grid-line vertical-1" />
              <View className="grid-line vertical-2" />
            </View>
          </View>
        </View>

        <View className="cropper-hint">
          <Text className="hint-text">拖动调整图片位置，确保人脸在圆形框内</Text>
        </View>
      </View>

      {/* 控制区域 */}
      <View className="cropper-controls">
        {/* 旋转按钮 */}
        <View className="control-row">
          <Button
            className="control-btn"
            onClick={handleRotate}
          >
            <RotateCw size={20} color="#333" />
            <Text className="btn-text">旋转</Text>
          </Button>
        </View>

        {/* 缩放滑块 */}
        <View className="control-row">
          <Text className="control-label">缩放</Text>
          <Slider
            className="control-slider"
            value={scale}
            min={0.5}
            max={3}
            step={0.1}
            onChange={(e) => setScale(e.detail.value)}
            activeColor="#1890ff"
            backgroundColor="#e0e0e0"
            showValue
          />
        </View>
      </View>
    </View>
  )
}

export default ImageCropperPage
