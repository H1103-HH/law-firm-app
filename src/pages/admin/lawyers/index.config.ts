export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '律师管理',
      navigationStyle: 'custom'
    })
  : {
      navigationBarTitleText: '律师管理',
      navigationStyle: 'custom'
    }
