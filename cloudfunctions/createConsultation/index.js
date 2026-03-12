const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { user_id, lawyer_id, user_name, phone, message } = event

    if (!user_id || !lawyer_id || !user_name || !phone || !message) {
      return {
        code: 400,
        msg: '缺少必要参数',
        data: null
      }
    }

    const result = await db.collection('consultations')
      .add({
        data: {
          user_id,
          lawyer_id: parseInt(lawyer_id),
          user_name,
          phone,
          message,
          status: 'pending',
          reply: '',
          created_at: new Date(),
          updated_at: new Date()
        }
      })

    return {
      code: 200,
      msg: 'success',
      data: {
        _id: result._id
      }
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
