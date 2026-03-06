export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationStyle: 'custom',
      disableScroll: true
    })
  : {
      navigationStyle: 'custom',
      disableScroll: true
    }
