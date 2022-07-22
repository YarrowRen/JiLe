import request from '@/utils/axiosReq'

export function addIc(data) {
  return request({
    url: '/ic/addIc',
    method: 'post',
    data
  })
}

export function getIc() {
  return request({
    url: '/ic/getIc',
    method: 'get'
  })
}