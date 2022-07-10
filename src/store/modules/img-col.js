import { addIc } from '@/api/img-col'

const getDefaultState = () => {
  return {}
}

const state = getDefaultState()

const mutations = {}

const actions = {
  addIc({ commit },ic_info) {
    const {ic_name,ic_path,ic_desc,id}=ic_info
    return new Promise((resolve, reject) => {
      addIc({ "ic_name": ic_name, "ic_path": ic_path, "ic_desc": ic_desc })
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
