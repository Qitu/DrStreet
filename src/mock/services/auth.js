import Mock from 'mockjs2'
import storage from 'store'
import { builder, getBody } from '../util'

const username = ['admin', 'super']
// '21232f297a57a5a743894a0e4a801fc3',
const password = ['8914de686ab28dc22f30d3d8e107ff6c', '21232f297a57a5a743894a0e4a801fc3'] // admin, ant.design

const login = (options) => {
  const body = getBody(options)
  console.log('mock: body', body)
  if (!username.includes(body.username) || !password.includes(body.password)) {
    return builder({ isLogin: true }, '账户或密码错误', 401)
  }
  const tokenVal = 'Token 8ac6da706ef0c56fa01bdb2d9696abc04fe5ff10'
  storage.set('Authorization', tokenVal)

  return builder({
    'id': Mock.mock('@guid'),
    'name': Mock.mock('@name'),
    'username': 'admin',
    'password': '',
    'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
    'status': 1,
    'creatorId': 'admin',
    'createTime': 1497160610259,
    'deleted': 0,
    'roleId': 'admin',
    'lang': 'zh-CN',
    'token': tokenVal
  }, '', 200, { 'Custom-Header': Mock.mock('@guid') })
}

const logout = () => {
  return builder({}, '[info] logout success')
}

const smsCaptcha = () => {
  return builder({ captcha: Mock.mock('@integer(10000, 99999)') })
}

const twofactor = () => {
  return builder({ stepCode: Mock.mock('@integer(0, 1)') })
}

Mock.mock(/\/auth\/login/, 'post', login)
Mock.mock(/\/auth\/logout/, 'post', logout)
Mock.mock(/\/account\/sms/, 'post', smsCaptcha)
Mock.mock(/\/auth\/2step-code/, 'post', twofactor)
