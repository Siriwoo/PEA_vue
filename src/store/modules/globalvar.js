import { getauthtoken } from '@/api/user'
var state = {
  orientation: [
    { key: 'PT', display_name: 'Protrait' },
    { key: 'LS', display_name: 'Landscape' }
  ],
  profilepic : '',
  tokenStr:"ya29.ImGpB-BILae6gajd-cBJs_ENmD41cj_ZsGWIMdKMXg1Ah0eckpWyAzNPJG7E1QijhGm0BJdkLJlLYKO_w_uYXW_csK3XSWltMC9ciZCUnEcqAvlDpF3wZUYsf2fDP80C_YPt"
}

const mutations = {
  GET_PROFILE_URL: (state, url) => {
    state.profilepic = url
    //console.log(state.profilepic);
  },
  CLEAR_ERROR_LOG: (state) => {
    state.logs.splice(0)
  },
  SET_AUTH: (state, token) => {
    state.tokenStr = token
    //console.log(state.tokenStr);
  }
}

const actions = {
  getprofileurl({ commit }, url) {
    commit('GET_PROFILE_URL', url)
  },
  clearErrorLog({ commit }) {
    commit('CLEAR_ERROR_LOG')
  },
  getauthtoken({ commit, state }){
    return new Promise((resolve, reject) => {
      getauthtoken(state.token).then(response => {
        //console.log(response.data);
        const { data } = response
        commit('SET_AUTH', data.access_token)
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        resolve(data)
      }).catch(error => {
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
