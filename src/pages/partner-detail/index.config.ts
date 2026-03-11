export default typeof definePageConfig === 'function'
  ? definePageConfig({
    navigationBarTitleText: '',
    enableShareAppMessage: true,
    enableShareTimeline: true
  })
  : {
    navigationBarTitleText: '',
    enableShareAppMessage: true,
    enableShareTimeline: true
  }
