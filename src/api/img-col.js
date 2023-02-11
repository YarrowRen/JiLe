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

export function getImgCol(ic_id, page,pageSize) {
  return request({
    url: '/ic/getImgCol',
    method: 'get',
    isParams: true,
    data: {
      ic_id: ic_id,
      page: page,
      pageSize: pageSize
    }
  })
}

export function refreshIcData(icID) {
  return request({
    url: '/ic/refreshIcData',
    method: 'get',
    isParams: true,
    data: { icID }
  })
}

export function getImageTag(imageID) {
  return request({
    url: '/ic/getImageTag',
    method: 'get',
    isParams: true,
    data: { imageID }
  })
}

export function updateImageInfo(data) {
  return request({
    url: '/ic/updateImageInfo',
    method: 'post',
    data
  })
}

export function getImageDetails(imageID) {
  return request({
    url: '/ic/getImageDetails',
    method: 'get',
    isParams: true,
    data: { imageID }
  })
}

export function changeFollowedState(imageID) {
  return request({
    url: '/ic/changeFollowedState',
    method: 'post',
    isParams: true,
    data: {
      imageID
    }
  })
}