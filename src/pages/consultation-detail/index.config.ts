export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '咨询详情' })
  : { navigationBarTitleText: '咨询详情' }
