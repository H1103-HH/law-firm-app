const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { keyword = '', page = 1, pageSize = 20 } = event

    let query = db.collection('lawyers')

    // 搜索过滤
    if (keyword) {
      query = query.where({
        name: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      })
    }

    // 分页查询
    const result = await query
      .orderBy('id', 'asc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()

    // 获取总数
    const countResult = await db.collection('lawyers').count()

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
