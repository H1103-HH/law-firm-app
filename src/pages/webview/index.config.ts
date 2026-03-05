export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '网页' })
  : { navigationBarTitleText: '网页' }
