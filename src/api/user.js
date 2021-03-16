import request from '@/utils/request'

export function loginme(data) {
  return request({
    url: '/user/loginme',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function updatepicprofile(data) {
  return request({
    url: '/user/picprofile',
    method: 'post',
    data
  })
}

export function getauthtoken() {
  return request({
    url: '/user/getauthtoken',
    method: 'get'
  })
}

export function signup(data) {
  return request({
    url: '/user/signup',
    method: 'post',
    data
  })
}
