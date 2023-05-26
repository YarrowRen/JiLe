import {
  addIc,
  getIc,
  getImgCol,
  refreshIcData,
  getImageTag,
  updateImageInfo,
  getImageDetails,
  changeFollowedState,
  getMainColor,
  deleteImage,
  getRandomImage,
  deleteIC,
  updateIC
} from '@/api/img-col'

const getDefaultState = () => {
  return {}
}

const state = getDefaultState()

const mutations = {}

const actions = {
  
  updateIC({ commit }, data) {
    return new Promise((resolve, reject) => {
      updateIC(data)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteIC({ commit }, { ic_id }) {
    return new Promise((resolve, reject) => {
      deleteIC(ic_id)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getRandomImage({ commit }, { num }) {
    return new Promise((resolve, reject) => {
      getRandomImage(num)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
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
  getMainColor({ commit }, { filePath, colorCount }) {
    return new Promise((resolve, reject) => {
      // console.log(videoID)
      getMainColor(filePath, colorCount)
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

  deleteImage({ commit }, { imageID }) {
    return new Promise((resolve, reject) => {
      // console.log(videoID)
      deleteImage(imageID)
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
    const { ic_name, ic_path, ic_desc, ic_cover, id } = ic_info
    return new Promise((resolve, reject) => {
      addIc({ ic_name: ic_name, ic_path: ic_path, ic_desc: ic_desc, ic_cover: ic_cover })
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
