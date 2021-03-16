import { asyncRoutes,
  constantRoutes,
  resetRouter,
  pubLisher,
  deVices,
  loCation,
  stocKecar,
  pickScheme,
  fillForms,
  meetingBooking,
  stockExcavation,
  lineMgm } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {

      /*let accessedRoutes
      if (!roles.includes('admin')) {
        console.log('do');
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }*/
      //console.log(asyncRoutes);
      commit('SET_ROUTES', asyncRoutes)
      resolve(asyncRoutes)
    })
  },
  generateRoutesScheme({ commit }, Scheme) {
    return new Promise(resolve => {
      console.log('Client pick '+Scheme);
      resetRouter()
      if(Scheme=='publisher'){
        commit('SET_ROUTES', pubLisher)
        resolve(pubLisher)
      }else if (Scheme =='devices') {
        commit('SET_ROUTES', deVices)
        resolve(deVices)
      }else if (Scheme =='location') {
        commit('SET_ROUTES', loCation)
        resolve(loCation)
      }else if (Scheme =='stockecar') {
        commit('SET_ROUTES', stocKecar)
        resolve(stocKecar)
      }else if (Scheme =='pickscheme') {
        commit('SET_ROUTES', pickScheme)
        resolve(pickScheme)
      }else if (Scheme =='fillforms') {
        commit('SET_ROUTES', fillForms)
        resolve(fillForms)
      }else if (Scheme =='meetingbooking') {
        commit('SET_ROUTES', meetingBooking)
        resolve(meetingBooking)
      }else if (Scheme =='stockexcavation') {
        commit('SET_ROUTES', stockExcavation)
        resolve(stockExcavation)
      }else {
        commit('SET_ROUTES', lineMgm)
        resolve(lineMgm)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
