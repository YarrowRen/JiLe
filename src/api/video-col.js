import request from '@/utils/axiosReq'

export function addVc(data) {
  return request({
    url: '/vc/addVc',
    method: 'post',
    data
  })
}

export function getVc() {
  return request({
    url: '/vc/getVc',
    method: 'get'
  })
}

export function getFirstVC() {
  return request({
    url: '/vc/getFirstVC',
    method: 'get'
  })
}

export function getVideoCover(data) {
  return request({
    url: '/vc/getVideoCover',
    method: 'post',
    data
    
  })
}