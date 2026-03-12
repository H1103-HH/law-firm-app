const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 简单的密码加密函数（实际项目中应使用更安全的加密方式）
function hashPassword(password) {
  return password // 这里简化处理，实际应该加密
}

exports.main = async (event, context) => {
  try {
    const { username, password } = event

    if (!username || !password) {
      return {
        code: 400,
        msg: '缺少必要参数',
        data: null
      }
    }

    // 查询管理员
    const result = await db.collection('admin')
      .where({
        username,
        password: hashPassword(password)
      })
      .get()

    if (result.data.length === 0) {
      return {
        code: 401,
        msg: '用户名或密码错误',
        data: null
      }
    }

    const admin = result.data[0]

    // 生成 token
    const token = `admin_token_${admin._id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      code: 200,
      msg: 'success',
      data: {
        admin: {
          _id: admin._id,
          username: admin.username
        },
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
