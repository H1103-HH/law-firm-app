export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '律师信息',
      navigationStyle: 'custom'
    })
  : {
      navigationBarTitleText: '律师信息',
      navigationStyle: 'custom'
    }
