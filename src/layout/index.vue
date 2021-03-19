<template>
  <div
  :class="classObj"
  class="app-wrapper"
  v-loading="loadingmainpage"
    element-loading-text="Loading..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    style="width: 100%">

    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <!--right-panel v-if="showSettings">
        <settings />
      </right-panel-->
    </div>
  </div>

</template>

<script>
// eslint-disable-next-line
/* eslint-disable */

import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState,mapGetters } from 'vuex'
import store from '@/store'
import { getUserData } from '@/utils/auth'
//import NProgress from 'nprogress' // progress bar
import {freqmethods} from '@/mixins/freqmethods'
import {fetchpic} from '@/mixins/fetchpic'
import avatar from '@/assets/toppup/avatar.png'

//NProgress.configure({ showSpinner: true })
export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin,freqmethods,fetchpic],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    ...mapGetters(['locations','loadingmainpage']),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  watch:{
    isloadlocation(v){
      //console.log('546546546');
      //console.log(v);
      if(v&&this.isloadequiptype&&this.isloadtoken&&this.isloadallequipttype){
        this.completeload()
      }
    },
    isloadequiptype(v){
      //console.log('+-+56476878');
      //console.log(v);
      if(v&&this.isloadlocation&&this.isloadtoken&&this.isloadallequipttype){
        this.completeload()
      }
    },
    isloadtoken(v){
      //console.log('+-+56476878');
      //console.log(v);
      if(v&&this.isloadlocation&&this.isloadequiptype&&this.isloadallequipttype){
        this.completeload()
      }
    },
    isloadallequipttype(v){
      //console.log('+-+56476878');
      //console.log(v);
      if(v&&this.isloadlocation&&this.isloadequiptype&&this.isloadtoken){
        this.completeload()
      }
    }
  },
  data(){
    return{
      isloadlocation: false,
      isloadequiptype: false,
      isloadtoken: false,
      isloadallequipttype: false
    }
  },
  created() {
    //do something after creating vue instance
    //console.log('loadlocation');
    this.loadlocation()
    this.loadequiptype()
    this.loadtoken()
    this.loadallequipttype()
  },
  methods: {
    completeload(){
      var tmp = {}
      tmp.info = 'loadingmainpage'
      tmp.loadingmainpage = false
      this.$store.dispatch('info/commitinfo', tmp)
    },
    loadlocation(){
      //NProgress.start()
      var tmp = {}
      tmp.info = 'locations'
      tmp.param1 = ''
      this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          console.log(r);
          this.isloadlocation = true
          //r= r.data
          //NProgress.done()
        })
    },
    loadtoken(){
      store.dispatch('globalvar/getauthtoken')
        .then((token) => {
          this.isloadtoken = true
          var authtoken = token.access_token
          //console.log(authtoken);
          var avatarId=''
          if(typeof JSON.parse(getUserData()) !== 'undefined'){
            avatarId = JSON.parse(getUserData()).avatar
          }

          //console.log(getUserData());
          if(avatarId==''){
            store.dispatch('globalvar/getprofileurl', avatar)
          }else{
            console.log('loadtoken in src/layout/index.vue');
            this.fetchpic(avatarId,authtoken).then(r=>{

              var baseUrl = r.baseUrl
              //console.log(baseUrl);
              store.dispatch('globalvar/getprofileurl', baseUrl)
            })
          }

        })
        .catch((e) => {
          console.log(e);
        })
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }
  @media print {
    .main-container {
      margin-left: 0 !important;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
