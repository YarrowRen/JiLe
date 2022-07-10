import request from '@/utils/axiosReq'

export function getList(params) {
  return request({
    url: '/vue3-admin-template/table/list',
    method: 'get',
    params
  })
}
