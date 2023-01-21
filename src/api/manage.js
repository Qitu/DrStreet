import request from '@/utils/request'

const api = {
  management: '/analysis'
}

export default api

export function getPredictResult () {
  return request({
    url: api.management,
    method: 'get'
  })
}
export function updatePredictStatus (res) {
  return request({
    url: api.management,
    method: 'post',
    params: res
  })
}
