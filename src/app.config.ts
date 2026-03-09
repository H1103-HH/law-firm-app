export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/partners/index',
    'pages/profile/index',
    'pages/partner-detail/index',
    'pages/consultation-detail/index',
    'pages/new-consultation/index',
    'pages/webview/index',
    'pages/login/index',
    'pages/admin/login/index',
    'pages/admin/lawyers/index',
    'pages/admin/lawyer-form/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#164616',
    navigationBarTitleText: '德恒律师事务所',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#164616',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/tabbar/home.png',
        selectedIconPath: './assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/partners/index',
        text: '全球合伙人',
        iconPath: './assets/tabbar/users.png',
        selectedIconPath: './assets/tabbar/users-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/user.png',
        selectedIconPath: './assets/tabbar/user-active.png'
      }
    ]
  }
})
