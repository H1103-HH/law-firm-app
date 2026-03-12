const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { id, name, title, description, avatar, specialties, phone, email } = event

    if (!id) {
      return {
        code: 400,
        msg: '缺少参数 id',
        data: null
      }
    }

    // 构建更新数据
    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (avatar !== undefined) updateData.avatar = avatar
    if (specialties !== undefined) updateData.specialties = specialties
    if (phone !== undefined) updateData.phone = phone
    if (email !== undefined) updateData.email = email
    updateData.updated_at = new Date()

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

    // 更新
    await db.collection('lawyers')
      .doc(existResult.data[0]._id)
      .update({
        data: updateData
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
