import { addVc,getVc,getVideoCover,getFirstVC,refreshVcData } from '@/api/video-col'

const getDefaultState = () => {
  return {}
}

const state = getDefaultState()

const mutations = {}

const actions = {
  addVc({ commit },vc_info) {
    const {vc_name,vc_path,vc_desc,id}=vc_info
    return new Promise((resolve, reject) => {
      addVc({ "vc_name": vc_name, "vc_path": vc_path, "vc_desc": vc_desc })
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getVideoCover({ commit },vc_info) {
    console.log(vc_info)
    const {vc_name,vc_path,vc_desc,id}=vc_info
    var savaPath='I:\\JiLeFile\\video\\cover'
    // console.log(savaPath)
    return new Promise((resolve, reject) => {
      getVideoCover({"id":id, "vc_name": vc_name, "vc_path": vc_path, "vc_desc": vc_desc })
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getVc({ commit }) {
    return new Promise((resolve, reject) => {
      getVc()
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  refreshVcData({ commit },{vcID}) {
    return new Promise((resolve, reject) => {
      console.log(vcID)
      refreshVcData(vcID)
        .then((response) => {
          const data = response
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getFirstVC({ commit }) {
    return new Promise((resolve, reject) => {
      getFirstVC()
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
