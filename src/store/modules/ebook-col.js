import { addEc, getEc, getEBookCol, refreshEcData,updateEBookDetails } from '@/api/ebook-col'

const getDefaultState = () => {
  return {}
}

const state = getDefaultState()

const mutations = {}

const actions = {
  updateEBookDetails({ commit },  data ) {
    return new Promise((resolve, reject) => {
      updateEBookDetails(data)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  refreshEcData({ commit }, { ecID }) {
    return new Promise((resolve, reject) => {
      console.log(ecID)
      refreshEcData(ecID)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getEBookCol({ commit }, { ec_id, page, pageSize }) {
    return new Promise((resolve, reject) => {
      // console.log(videoID)
      getEBookCol(ec_id, page, pageSize)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  addEc({ commit }, ec_info) {
    const { ec_name, ec_path, ec_desc, id } = ec_info
    return new Promise((resolve, reject) => {
      addEc({ ec_name: ec_name, ec_path: ec_path, ec_desc: ec_desc })
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getEc({ commit }) {
    return new Promise((resolve, reject) => {
      getEc()
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
