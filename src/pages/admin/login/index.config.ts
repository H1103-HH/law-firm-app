export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '管理员登录',
      navigationStyle: 'custom',
      disableScroll: true
    })
  : {
      navigationBarTitleText: '管理员登录',
      navigationStyle: 'custom',
      disableScroll: true
    }
