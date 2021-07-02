// eslint-disable-next-line
/* eslint-disable */
import { loadinfo, addequipt, uploadfile, uploadassetfile, loadallequipttype, fetchandupdate, externalapi } from '@/api/info'
import { getToken, setToken, removeToken, setUserData, getUserData } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
    token: getToken(),
    location: '',
    equiptype: '',
    loadingmainpage: true,
    equiptypeall: '',
    equiptypeavatar: '',
    centers: '',
    years: ''
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_LOCATIONS: (state, locations) => {
        state.locations = locations
            //console.log('++++++----+++++-');
            //console.log(state.locations);
    },
    SET_EQUIPTYE: (state, equiptype) => {
        state.equiptype = equiptype
    },
    SET_CENTERS: (state, centers) => {
        state.centers = centers
            // console.log(state.centers);
    },
    SET_YEARS: (state, years) => {
        state.years = years
            // console.log(state.years);
    },
    SET_INFO: (state, info) => {
        //console.log(info);
        if (info.info == 'loadingmainpage') {
            state.loadingmainpage = info.loadingmainpage
        } else if (info.info == 'saveavatar') {
            state.equiptypeavatar = info.equiptypeavatar
        }

    },
    SET_EQUIPTYEALL: (state, equiptypeall) => {
        console.log('save all equipt to store');
        state.equiptypeall = equiptypeall
    }
}

const actions = {
    // user login
    commitinfo({ commit }, info) {
        commit('SET_INFO', info)
    },
    fetchandupdate({ commit }, admin) {
        //console.log(admin);
        //const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            fetchandupdate(admin).then(r => {
                console.log(r);
                resolve(r)
            })
        })
    },
    loadinfo({ commit }, admin) {
        //console.log(admin);
        //const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            loadinfo(admin).then(r => {
                //console.log('this is login response');
                //console.log(response);
                //console.log('++++');
                // console.log(r.data);
                if (r.info == 'locations') {
                    // console.log('save locations to store');
                    //console.log(r.data);
                    commit('SET_LOCATIONS', r.data)
                        //console.log('++++++----+++++-');
                        //console.log(state.locations);
                } else if (r.info == 'equiptype') {
                    // console.log('save equiptype to store');
                    commit('SET_EQUIPTYE', r.data)
                } else if (r.info == 'centers') {
                    commit('SET_CENTERS', r.data)
                        // console.log('save centers to store');
                } else if (r.info == 'years') {
                    commit('SET_YEARS', r.data)
                        // console.log('save yaers to store');
                }
                resolve(r)
            }).catch(error => {
                console.log(error);
                reject(error)
            })
        })
    },
    uploadfile({ commit }, file) {
        //const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            uploadfile(file).then(response => {
                //console.log('this is login response');
                console.log(response);

                resolve()
            }).catch(error => {
                console.log(error);
                reject(error)
            })
        })
    },
    loadallequipttype({ commit }, admin) {
        //console.log(admin);
        //const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            loadallequipttype(admin).then(r => {
                commit('SET_EQUIPTYEALL', r.data)
                    //console.log('this is login response');
                    //console.log(response);

                resolve(r)
            }).catch(error => {
                console.log(error);
                reject(error)
            })
        })
    },
    addequipt({ commit }, admin) {
        //console.log(admin);
        //const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            addequipt(admin).then(response => {
                //console.log('this is login response');
                //console.log(response);

                resolve(response)
            }).catch(error => {
                console.log(error);
                reject(error)
            })
        })
    },
    externalapi({ commit }, q) {
        //console.log(admin);
        //const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            externalapi(q).then(response => {
                //console.log('this is login response');
                //console.log(response);

                resolve(response)
            }).catch(error => {
                console.log(error);
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