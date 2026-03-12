const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { user_id, lawyer_id, role, page = 1, pageSize = 20 } = event

    let query = db.collection('consultations')

    // 根据角色过滤
    if (role === 'customer') {
      // 客户只能看到自己的咨询
      if (!user_id) {
        return {
          code: 400,
          msg: '缺少 user_id',
          data: null
        }
      }
      query = query.where({ user_id })
    } else if (role === 'partner') {
      // 合伙人可以看到所有咨询
      if (lawyer_id) {
        query = query.where({ lawyer_id: parseInt(lawyer_id) })
      }
    }

    // 分页查询
    const result = await query
      .orderBy('created_at', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()

    // 获取总数
    const countResult = await db.collection('consultations').count()

    return {
      code: 200,
      msg: 'success',
      data: {
        list: result.data,
        total: countResult.total,
        page,
        pageSize
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
