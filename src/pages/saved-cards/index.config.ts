export default typeof definePageConfig === 'function'
  ? definePageConfig({
    navigationBarTitleText: '我的收藏',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black'
  })
  : {
    navigationBarTitleText: '我的收藏',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black'
  }