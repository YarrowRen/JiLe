import { addIc, getIc, getImgCol, refreshIcData, getImageTag, updateImageInfo,getImageDetails,changeFollowedState } from '@/api/img-col'

const getDefaultState = () => {
  return {}
}

const state = getDefaultState()

const mutations = {}

const actions = {
  getImgCol({ commit }, { ic_id, page, pageSize }) {
    return new Promise((resolve, reject) => {
      // console.log(videoID)
      getImgCol(ic_id, page, pageSize)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getImageTag({ commit }, { imageID }) {
    return new Promise((resolve, reject) => {
      // console.log(videoID)
      getImageTag(imageID)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getImageDetails({ commit }, { imageID }) {
    return new Promise((resolve, reject) => {
      // console.log(videoID)
      getImageDetails(imageID)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  addIc({ commit }, ic_info) {
    const { ic_name, ic_path, ic_desc, id } = ic_info
    return new Promise((resolve, reject) => {
      addIc({ ic_name: ic_name, ic_path: ic_path, ic_desc: ic_desc })
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getIc({ commit }) {
    return new Promise((resolve, reject) => {
      getIc()
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  refreshIcData({ commit }, { icID }) {
    return new Promise((resolve, reject) => {
      console.log(icID)
      refreshIcData(icID)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateImageInfo({ commit }, data) {
    return new Promise((resolve, reject) => {
      updateImageInfo(data)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  changeFollowedState({ commit }, { imageID }) {
    return new Promise((resolve, reject) => {
      changeFollowedState(imageID)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
