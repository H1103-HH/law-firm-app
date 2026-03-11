export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '发起咨询' })
  : { navigationBarTitleText: '发起咨询' }
