const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { id } = event

    if (!id) {
      return {
        code: 400,
        msg: '缺少参数 id',
        data: null
      }
    }

    const result = await db.collection('lawyers')
      .where({ id: parseInt(id) })
      .get()

    if (result.data.length === 0) {
      return {
        code: 404,
        msg: '律师不存在',
        data: null
      }
    }

    return {
      code: 200,
      msg: 'success',
      data: result.data[0]
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
