import {
  addEc,
  getEc,
  getEBookCol,
  refreshEcData,
  updateEBookDetails,
  testSleep,
  getRandomEBook,
  deleteEC,
  updateEC,
  deleteEBook,
  searchEC
} from '@/api/ebook-col'

const getDefaultState = () => {
  return {}
}

const state = getDefaultState()

const mutations = {}

const actions = {
  deleteEBook({ commit }, { eBookID }) {
    return new Promise((resolve, reject) => {
      deleteEBook(eBookID)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteEC({ commit }, { ec_id }) {
    return new Promise((resolve, reject) => {
      deleteEC(ec_id)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  searchEC({ commit }, {ec_id,type,searchList}) {
    return new Promise((resolve, reject) => {
      searchEC(ec_id,type,searchList)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateEBookDetails({ commit }, data) {
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

  updateEC({ commit }, data) {
    return new Promise((resolve, reject) => {
      updateEC(data)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  testSleep({ commit }) {
    return new Promise((resolve, reject) => {
      testSleep()
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
  getRandomEBook({ commit }, { num }) {
    return new Promise((resolve, reject) => {
      getRandomEBook(num)
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
    const { ec_name, ec_path, ec_desc, id, ec_cover } = ec_info
    return new Promise((resolve, reject) => {
      addEc({ ec_name: ec_name, ec_path: ec_path, ec_desc: ec_desc, ec_cover: ec_cover })
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
