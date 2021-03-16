import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  todos: [
    {
      name: 'welcome matafaka'
    }
  ],
  stk_list: [],
  usermenu: [],
  bottombuttom: {
    editIntent: false,
    mergeIntent: false,
    mergeIntentClick: false,
    deleteIntent: false,
    deSelect: false,
    deSelectClick: false,
    show: false,
    dialogEdit: false
  },
  g_tags: [],
  g_qna: [
    {
      text: '',
      dialog: false
    },
    {
      text: '',
      dialog: false,
      message: {}
    },
    {
      text: '',
      dialog: false
    }
  ],
  g_dialog:{
    single_img:{
      model: false,
      url: '',
      description: ''
    }
  },
  wanttag_sq: {},
  question_q: {},
  edit_setting: {},
  dialog_editAns: false,
  dialogEditans: false,
  selectedIntentVux: [
    {
      ask_human: [
        {
          ask: '',
          id:''
        }
      ]
    }
  ],
  selectSpeedDail:'',
  statusLogin: '',
  flag: {
    fg_editAnswer: false,
    fg_addAnswer: false
  },
  config :{
    infoServer: ''
  }
}

const mutations = {
  D_TOGGLE (state, payload) {
    //console.log(payload);
    state.g_qna[payload].dialog = !state.g_qna[payload].dialog
    //console.log(state.g_qna[payload].dialog)
  },
  SET_TAGS (state, payload) {
    state.g_tags = payload
  },
  P_WANTTAG (state, payload) {
    state.wanttag_sq = payload
  },
  D_WANTTAG (state, i) {
    state.wanttag_sq.splice(i, 1)
  },
  SET_STKLIST (state, data) {
    state.stk_list = data
    //console.log(state.stk_list);
  },
  D_QUESTION (state, data) {
    state.question_q = data
  },
  S_EDIT_SETTING (state, data) {
    state.edit_setting = ''
    state.edit_setting = data
    //console.log(data)
  },
  C_BOTTOMBUTTOM (state, data) {
    console.log(data);
    state.selectSpeedDail = data
    if (typeof data.show !== 'undefined') {
      state.bottombuttom.show = data.show
    }
    if (typeof data.deSelectClick !== 'undefined') {
      state.bottombuttom.deSelectClick = data.deSelectClick
    }
    if (typeof data.editIntent !== 'undefined') {
      state.bottombuttom.editIntent = data.editIntent
    }
    if (typeof data.dialogEdit !== 'undefined') {
      state.bottombuttom.dialogEdit = data.dialogEdit
    }
    if (typeof data.mergeIntentClick !== 'undefined') {
      state.bottombuttom.mergeIntentClick = data.mergeIntentClick
    }
    if (typeof data.useThisintentClick !== 'undefined') {
      state.bottombuttom.useThisintentClick = data.useThisintentClick
    }
    if (typeof data.ClickaddLastToText !== 'undefined') {
      state.bottombuttom.ClickaddLastToText = data.ClickaddLastToText
    }
  },
  C_DAILOGEANS (state, data) {
    state.dialog_editAns = ''
    state.dialog_editAns = data
    console.log(state.dialog_editAns)
  },
  C_DAILOGEDITANS (state, data) {
    state.dialogEditans = ''
    state.dialogEditans = data
    console.log(state.dialogEditans)
  },
  C_DAILOGEDIT (state, data) {
    state.bottombuttom.dialogEdit = data
    //console.log(state.dialogEdit)
  },
  S_INTENT (state, data) {
    if (data.length !== 0) {
      state.selectedIntentVux = data
    }
    console.log(state.selectedIntentVux)
  },
  C_ALL_QUESTION (state, data) {
    //console.log(data)
    //console.log(state.question_q)
    state.question_q[data.indexEdit] = data.asking
    state.question_q[data.indexEdit].index = data.indexEdit
    //console.log(state.question_q)
  },
  SET_FLAG_ADD_ANS (state, data) {
    state.flag.fg_addAnswer = data
  },
  SET_STATUSLOGIN (state, data) {
    state.statusLogin = data
    //console.log(state.statusLogin);
    //str.replace(/foo/g, "bar")
    var listroles = state.statusLogin.Permissions.replace(/"/g, "")
    listroles = listroles.replace("[", "")
    listroles = listroles.replace("]", "")
    listroles = listroles.split(",")
    //console.log(listroles)
    state.usermenu = []
    state.usermenu.push(state.menuall.Timeline)
    for (var i = 0; i < listroles.length; i++) {
      if (listroles[i] === "mmr") {
        state.usermenu.push(state.menuall.MeetingRoom)
      } else if (listroles[i] === "dmr") {
        state.usermenu.push(state.menuall.DetailMeeting)
      } else if (listroles[i] === "mml") {
        state.usermenu.push(state.menuall.LineBot)
      } else if (listroles[i] === "nrl") {
        state.usermenu.push(state.menuall.Permissions)
      } else if (listroles[i] === "dbs") {
        state.usermenu.push(state.menuall.Databases)
      } else if (listroles[i] === "tas") {
        state.usermenu.push(state.menuall.Tags)
      } else if (listroles[i] === "epr") {
        state.usermenu.push(state.menuall.Admin)
      }

    }
    //console.log(state.usermenu)
  },
  SET_USERMENU (state, data) {

    state.usermenu = data
    //console.log(state.set_statusLogin)
  },
  SET_PMDATA (state, data) {
    //console.log(data);
    if (data.pmtype === 'location'){
      //console.log('sdd')
      state.pmdata.location.isset = true
      state.pmdata.location.data = data.data
    }else if (data.pmtype === 'equiptmodel'){
      //console.log('sdd')
      state.pmdata.equiptmodel.isset = true
      state.pmdata.equiptmodel.data = data.data
    }
  },
  SET_GDIALOG(state, data) {
    if (data.dialogtype === 'single_img') {
      state.g_dialog.single_img.model = data.model
      state.g_dialog.single_img.url = data.url
      state.g_dialog.single_img.description = data.description
      state.g_dialog.single_img.title = data.title
      //console.log(state.g_dialog);
    }
  },
  D_CONFIGFILES (state, payload) {

  }
}


const actions = {
  d_toggle: ({commit}, cur) => commit('D_TOGGLE', cur),
  set_tags: ({commit}, newdata) => commit('SET_TAGS', newdata),
  p_wanttag: ({commit}, newdata) => commit('P_WANTTAG', newdata),
  d_wanttag: ({commit}, index) => commit('D_WANTTAG', index),
  q_question: ({commit}, data) => commit('D_QUESTION', data),
  c_bottombuttom: ({commit}, data) => commit('C_BOTTOMBUTTOM', data),
  s_edit_setting: ({commit}, data, j) => commit('S_EDIT_SETTING', data, j),
  c_DailogEANS: ({commit}, data) => commit('C_DAILOGEANS', data),
  c_DailogEditAns: ({commit}, data) => commit('C_DAILOGEDITANS', data),
  c_DailogEdit: ({commit}, data) => commit('C_DAILOGEDIT', data),
  S_Intent: ({commit}, data) => commit('S_INTENT', data),
  c_all_question: ({commit}, data) => commit('C_ALL_QUESTION', data),
  set_flag_add_ans: ({commit}, data) => commit('SET_FLAG_ADD_ANS', data),
  set_statusLogin: ({commit}, data) => commit('SET_STATUSLOGIN', data),
  set_usermenu: ({commit}, data) => commit('SET_USERMENU', data),
  set_pmdata: ({commit}, data) => commit('SET_PMDATA', data),
  set_gdialog: ({commit}, data) => commit('SET_GDIALOG', data),
  a_configfile: ({commit},payload) => commit('D_CONFIGFILES',payload),
  set_stklist: ({commit},payload) => commit('SET_STKLIST',payload)
}


export default (
  {
    namespaced: true,
    state,
    mutations,
    actions
  }
)
