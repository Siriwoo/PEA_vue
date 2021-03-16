import { loginme, logout, getInfo, signup } from '@/api/user'
import { getToken, setToken, removeToken, setUserData, getUserData } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  fullname: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_FULLNAME: (state, fullname) => {
    state.fullname = fullname
  }
}

const actions = {
  // user login
  loginme({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      loginme({ username: username.trim(), password: password }).then(response => {
        //console.log('this is login response');
        //console.log(response);
        const { data, roles, name, avatar, introduction, fullname } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setUserData(response)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_FULLNAME', fullname)
        resolve()
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },
  signup({ commit }, userInfo) {
    const { username, password, password2 } = userInfo
    return new Promise((resolve, reject) => {
      signup({ username: username.trim(),
        password: password,
        password2: password2}).then(response => {
        //console.log('this is login response');
        //console.log(response);
        const { data, roles, name, avatar, introduction, fullname } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setUserData(response)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_FULLNAME', fullname)
        resolve(response)
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        //console.log(response);
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }



        // roles must be a non-empty array
        /*if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }*/


        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
