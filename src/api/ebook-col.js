import request from '@/utils/axiosReq'

export function refreshEcData(ecID) {
  return request({
    url: '/ec/refreshEcData',
    method: 'get',
    isParams: true,
    timeout: 120000, //设置一分钟响应时间
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

export function updateEC(data) {
  return request({
    url: '/ec/updateEC',
    method: 'post',
    data
  })
}

export function testSleep() {
  return request({
    url: '/ec/testSleep',
    method: 'get'
  })
}

export function getRandomEBook(num) {
  return request({
    url: '/ec/getRandomEBook',
    method: 'get',
    isParams: true,
    data: { num }
  })
}

export function deleteEC(ec_id) {
  return request({
    url: '/ec/deleteEC',
    method: 'post',
    isParams: true,
    data: {
      ec_id
    }
  })
}

export function deleteEBook(eBookID) {
  return request({
    url: '/ec/deleteEBook',
    method: 'post',
    isParams: true,
    data: {
      eBookID
    }
  })
}

export function searchEC(ec_id,type,searchList) {
  return request({
    url: '/ec/searchEC',
    method: 'get',
    isParams: true,
    data: {
      ec_id:ec_id,
      type:type,
      searchList:searchList
    }
  })
}
