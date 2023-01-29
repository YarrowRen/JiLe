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