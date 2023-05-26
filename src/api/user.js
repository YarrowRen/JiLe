import request from '@/utils/axiosReq'


export function copyFile(source, dest) {
  return request({
    url: '/user/copyFile',
    method: 'get',
    isParams: true,
    timeout: 120000, //设置一分钟响应时间避免大文件复制问题
    data: {
      source: source,
      dest: dest
    }
  })
}

export function loginReq(data) {
  return request({
    url: '/integration-front/user/loginValid',
    data,
    method: 'post',
    bfLoading: false,
    isParams: true,
    isAlertErrorMsg: false
  })
}

export function getInfoReq() {
  return request({
    url: '/integration-front/user/getUserInfo',
    bfLoading: false,
    method: 'post',
    isAlertErrorMsg: false
  })
}

export function logoutReq() {
  return request({
    url: '/integration-front/user/loginOut',
    method: 'post'
  })
}


export function testFrontend() {
  return request({
    url: '/user/frontendState',
    method: 'get'
  })
}
