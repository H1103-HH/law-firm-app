const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { page = 1, pageSize = 20 } = event

    const result = await db.collection('lawyers')
      .orderBy('id', 'asc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()

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
