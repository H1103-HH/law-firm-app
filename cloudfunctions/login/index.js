const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { openid, role, nickname, avatar } = event

    if (!openid || !role) {
      return {
        code: 400,
        msg: '缺少必要参数',
        data: null
      }
    }

    // 查询用户是否已存在
    const userResult = await db.collection('users')
      .where({ openid })
      .get()

    let user

    if (userResult.data.length > 0) {
      // 更新用户信息
      user = userResult.data[0]

      await db.collection('users')
        .doc(user._id)
        .update({
          data: {
            nickname: nickname || user.nickname,
            avatar: avatar || user.avatar,
            role: role || user.role,
            updated_at: new Date()
          }
        })
    } else {
      // 创建新用户
      const createResult = await db.collection('users')
        .add({
          data: {
            openid,
            nickname: nickname || '',
            avatar: avatar || '',
            role,
            created_at: new Date(),
            updated_at: new Date()
          }
        })

      user = {
        _id: createResult._id,
        openid,
        nickname: nickname || '',
        avatar: avatar || '',
        role,
        created_at: new Date(),
        updated_at: new Date()
      }
    }

    // 生成 token
    const token = `token_${user._id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      code: 200,
      msg: 'success',
      data: {
        user,
        token
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
