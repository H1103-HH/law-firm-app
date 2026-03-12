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

    // 先查询是否存在
    const existResult = await db.collection('lawyers')
      .where({ id: parseInt(id) })
      .get()

    if (existResult.data.length === 0) {
      return {
        code: 404,
        msg: '律师不存在',
        data: null
      }
    }

    // 删除
    await db.collection('lawyers')
      .doc(existResult.data[0]._id)
      .remove()

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
