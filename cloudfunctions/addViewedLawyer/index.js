const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { user_id, lawyer_id } = event

    if (!user_id || !lawyer_id) {
      return {
        code: 400,
        msg: '缺少必要参数',
        data: null
      }
    }

    // 添加浏览记录
    await db.collection('viewed_lawyers')
      .add({
        data: {
          user_id,
          lawyer_id: parseInt(lawyer_id),
          viewed_at: new Date()
        }
      })

    return {
      code: 200,
      msg: 'success',
      data: null
    }
  } catch (err) {
    console.error(err)
    return {
      code: 500,
      msg: err.message,
      data: null
    }
  }
}
