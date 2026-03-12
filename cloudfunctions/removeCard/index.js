const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { user_id, lawyer_id } = event
    if (!user_id || !lawyer_id) return { code: 400, msg: '缺少必要参数', data: null }

    const existResult = await db.collection('saved_cards')
      .where({ user_id, lawyer_id: parseInt(lawyer_id) })
      .get()

    if (existResult.data.length === 0) {
      return { code: 404, msg: '收藏不存在', data: null }
    }

    await db.collection('saved_cards').doc(existResult.data[0]._id).remove()

    return { code: 200, msg: 'success', data: null }
  } catch (err) {
    console.error(err)
    return { code: 500, msg: err.message, data: null }
  }
}
