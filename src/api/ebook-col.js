import request from '@/utils/axiosReq'


export function refreshEcData(ecID) {
    return request({
      url: '/ec/refreshEcData',
      method: 'get',
      isParams: true,
      data: { ecID }
    })
  }
  

export function addEc(data) {
  return request({
    url: '/ec/addEc',
    method: 'post',
    data
  })
}

export function getEc() {
  return request({
    url: '/ec/getEc',
    method: 'get'
  })
}

export function getEBookCol(ec_id, page, pageSize) {
  return request({
    url: '/ec/getEBookCol',
    method: 'get',
    isParams: true,
    data: {
      ec_id: ec_id,
      page: page,
      pageSize: pageSize
    }
  })
}

export function updateEBookDetails(data) {
  return request({
    url: '/ec/updateEBookDetails',
    method: 'post',
    data
  })
}