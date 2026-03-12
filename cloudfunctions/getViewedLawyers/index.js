const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    const { user_id, page = 1, pageSize = 20 } = event
    if (!user_id) return { code: 400, msg: '缺少 user_id', data: null }

    const result = await db.collection('viewed_lawyers')
      .where({ user_id })
      .orderBy('viewed_at', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()

    const lawyerIds = result.data.map(item => item.lawyer_id)
    const lawyersResult = await db.collection('lawyers').where({ id: _.in(lawyerIds) }).get()

    const lawyerMap = {}
    lawyersResult.data.forEach(lawyer => { lawyerMap[lawyer.id] = lawyer })

    const combined = result.data.map(item => ({
      ...item,
      lawyer: lawyerMap[item.lawyer_id] || null
    }))

    return { code: 200, msg: 'success', data: { list: combined, total: result.data.length, page, pageSize } }
  } catch (err) {
    console.error(err)
    return { code: 500, msg: err.message, data: null }
  }
}
