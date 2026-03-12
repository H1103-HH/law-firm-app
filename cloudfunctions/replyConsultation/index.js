const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { id, reply } = event

    if (!id || !reply) {
      return {
        code: 400,
        msg: '缺少必要参数',
        data: null
      }
    }

    const result = await db.collection('consultations')
      .doc(id)
      .update({
        data: {
          reply,
          status: 'replied',
          updated_at: new Date()
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
