const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { name, title, description, avatar, specialties, phone, email } = event

    if (!name || !title) {
      return {
        code: 400,
        msg: '缺少必要参数',
        data: null
      }
    }

    // 获取最大的 ID
    const maxResult = await db.collection('lawyers')
      .orderBy('id', 'desc')
      .limit(1)
      .get()

    const nextId = maxResult.data.length > 0 ? maxResult.data[0].id + 1 : 1

    const result = await db.collection('lawyers')
      .add({
        data: {
          id: nextId,
          name,
          title,
          description: description || '',
          avatar: avatar || '',
          specialties: specialties || '',
          phone: phone || '',
          email: email || '',
          created_at: new Date(),
          updated_at: new Date()
        }
      })

    return {
      code: 200,
      msg: 'success',
      data: {
        _id: result._id,
        id: nextId
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
