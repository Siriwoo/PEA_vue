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
      </div>
      <app-main />
      <!--right-panel v-if="showSettings">
        <settings />
      </right-panel-->
    </div>
    <v-footer color="secondary" app inset>
        <!--span class="cw">
          &copy; 2020
        </span-->
        <div id="xxx">
          <v-speed-dial
            v-model="bottombuttom.show"
            :top="top"
            :bottom="bottom"
            :right="right"
            :left="left"
            :direction="direction"
            :open-on-hover="hover"
            :transition="transition"
          >

            <v-btn
              fab
              dark
              small
              color="red"
              v-if="bottombuttom.deleteIntent"
              @click = "do_click_speed_dail('deleteIntent')"
            >
              <i class="el-icon-delete"></i>
            </v-btn>
            <v-btn
              fab
              dark
              small
              color="#212121"
              v-if="bottombuttom.mergeIntent"
              @click = "do_click_speed_dail('mergeIntent')"
            >
              <i class="el-icon-document-copy"></i>
            </v-btn>
            <v-btn
              fab
              dark
              small
              color="#212121"
              @click = "do_click_speed_dail('deSelect')"
              v-if="bottombuttom.deSelect"
            >
              <i class="el-icon-thumb"></i>
            </v-btn>
            <v-btn
              fab
              dark
              small
              color="#212121"
              v-if="bottombuttom.editIntent"
              @click = "do_click_speed_dail('editIntent')"
            >
              <i class="el-icon-edit"></i>
            </v-btn>
            <v-btn
              fab
              dark
              small
              color="#212121"
              v-if="bottombuttom.editIntent"
              @click = "do_click_speed_dail('useThisintent')"
            >
              <i class="el-icon-phone-outline"></i>
            </v-btn>
          </v-speed-dial>
        </div>

      </v-footer>
      <v-dialog
     v-model="dialogvueapp"
     width="500"
   >

     <v-card>
       <v-card-title
         class="headline grey lighten-2"
         primary-title
       >
         <v-icon>{{AlertIcon}}</v-icon> {{textAlertTitle}}
       </v-card-title>

       <v-card-text>
         {{textalert}}
       </v-card-text>

       <v-divider></v-divider>

       <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn
           color="primary"
           flat
           @click="dialogvueapp = false"
         >
           ตามนั้น
         </v-btn>
       </v-card-actions>
     </v-card>
   </v-dialog>
   <v-dialog
     v-model="g_dialog.single_img.model"
     scrollable fullscreen
     max-width="500px"
     transition="dialog-transition"
   >
   <v-card>
     <v-toolbar dark color="primary" height="30px;">
       <v-btn icon dark @click="g_dialog.single_img.model = false">
         <v-icon>close</v-icon>
       </v-btn>

     </v-toolbar>

     <div class="mt-4 px-2 py-1 parentimg">
       {{g_dialog.single_img.title}}
       <img :src="g_dialog.single_img.url"/>
       {{g_dialog.single_img.description}}
     </div>
   </v-card>
   </v-dialog>
  </div>

</template>

<script>
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
    ...mapGetters(['usermenu','locations','loadingmainpage'
    ,'bottombuttom','g_dialog']),
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
      isloadallequipttype: false,
      lmenu : false,
      dialogvueapp: false,
      textalert: '',
      textAlertTitle: '',
      AlertIcon: '',
      clipped: false,
      drawer: false,
      fixed: false,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      direction: 'top',
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: 'slide-y-reverse-transition'
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
    do_click_speed_dail: function (whatClick) {
      // console.log('i click')
      console.log(this.bottombuttom)
      var data = {}
      if (whatClick === 'deSelect') {
        console.log('deSelect')
        data.dialogEdit = false
        data.deSelectClick = true
        //this.$store.dispatch('chatbot/c_bottombuttom', data)
        //this.c_bottombuttom(data)
        // console.log(this.bottombuttom.deSelectClick)
      } else if (whatClick === 'editIntent') {
        console.log('editIntent')
        data.dialogEdit = true
        //this.$store.dispatch('chatbot/c_bottombuttom', data)
      } else if (whatClick === 'mergeIntent') {
        console.log('mergeIntent')
        data.mergeIntentClick = true
        //this.$store.dispatch('chatbot/c_bottombuttom', data)
      } else if (whatClick === 'useThisintent') {
        console.log('useThisintent')
        data.useThisintentClick = true

      }
      this.$store.dispatch('chatbot/c_bottombuttom', data)
      console.log(this.bottombuttom)
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
    loadequiptype(){
      //NProgress.start()
      var tmp = {}
      tmp.info = 'equiptype'
      tmp.param1 = this.defaultdepart()
      this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          var ddpart = {
            admin: this.defaultdepart()
          }
          console.log(ddpart);
          this.$store.dispatch('info/loadallequipttype', ddpart)
            .then((r) => {
              this.isloadequiptype = true
              //NProgress.done()
            })
            .catch((e) => {
              console.log(e);
              //NProgress.done()
            })

          //r= r.data
          //console.log(r);
          //NProgress.done()
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
  #xxx .v-speed-dial {
    position: absolute;
    margin-right: 11px;
    /*margin-bottom: 25px;*/
  }
  .parentimg img{
    width: 100%;
  }
  #xxx .v-btn--floating {
    position: relative;
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
