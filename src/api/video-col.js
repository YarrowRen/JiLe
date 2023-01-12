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

export function refreshVcData(vcID) {
  return request({
    url: '/vc/refreshVcData',
    method: 'get',
    isParams: true,
    data: { vcID }
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

export function videoRename(newName, videoID) {
  return request({
    url: '/vc/videoRename',
    method: 'post',
    isParams: true,
    data: {
      newName: newName,
      videoID: videoID
    }
  })
}

export function videoDelete(videoID) {
  return request({
    url: '/vc/videoDelete',
    method: 'post',
    isParams: true,
    data: {
      videoID
    }
  })
}

export function editVideoCover(videoID, coverPath) {
  return request({
    url: '/vc/editVideoCover',
    method: 'post',
    isParams: true,
    data: {
      videoID: videoID,
      coverPath: coverPath
    }
  })
}

export function autoGetCover(videoID) {
  return request({
    url: '/vc/autoGetCover',
    method: 'post',
    isParams: true,
    data: {
      videoID
    }
  })
}


export function getVideoDetails(videoID) {
  return request({
    url: '/vc/getVideoDetails',
    method: 'get',
    isParams: true,
    data: {
      videoID
    }
  })
}