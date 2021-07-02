<template>
  <div class="navbardevice">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <el-row :gutter="10" type="flex" justify="space-between" class="vercenter">
      <el-col :xs="8" :sm="6" :md="4" class="hidden-xs-only">
        ระบบสำรวจสินทรัพย์
      </el-col>
       <el-col :xs="12" :sm="12" :md="4">
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      </el-col>

      <el-col :xs="5" :sm="5" :md="5" :lg="3" :xl="1">
        <div class="right-menu">
          <!--<template v-if="device!=='mobile'">
            <search id="header-search" class="right-menu-item" />

            <error-log class="errLog-container right-menu-item hover-effect" />

            <screenfull id="screenfull" class="right-menu-item hover-effect" />

            <el-tooltip content="Global Size" effect="dark" placement="bottom">
              <size-select id="size-select" class="right-menu-item hover-effect" />
            </el-tooltip>

          </template>-->
          <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
            <div class="avatar-wrapper">

              <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/as_profile/index">
                <el-dropdown-item>Profile</el-dropdown-item>
              </router-link>
              <router-link to="/">
                <el-dropdown-item>Dashboard</el-dropdown-item>
              </router-link>
              <!--<a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
                <el-dropdown-item>Github</el-dropdown-item>
              </a>-->
              <el-dropdown-item>
                <span style="display:block;" @click="centerDialogVisible=true">Scheme</span>
              </el-dropdown-item>

              <el-dropdown-item divided>
                <span style="display:block;" @click="logout">Log Out</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </div>
      </el-col>
    </el-row>
    <el-dialog
      title="เลือกโครงการที่ต้องการใช้งาน"
      :visible.sync="centerDialogVisible"
      :width="w_dialog"
      center>
        <cardmenu @click.native="centerDialogVisible=false"/>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters, mapState } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Cardmenu from '@/layout/components/Cardmenu'
import { getUserData } from '@/utils/auth'
import { fetchpic } from '@/mixins/fetchpic'
import loading from "@/assets/loading/loadpic.gif"
import avatar from "@/assets/toppup/avatar.png"

export default {
  mixins: [fetchpic],
  components: {
    Hamburger,
    Cardmenu
  },
  data(){
    return{
      centerDialogVisible: false,
      scheme: [],
      w_dialog: '50vw'
    }
  },
  mounted() {
    store.dispatch('globalvar/getprofileurl', loading)
    //do something after mounting vue instance
    const mq = window.matchMedia( "(min-width: 500px)" )
    if(mq.matches){
      this.w_dialog = '45vw'
    }else{
      this.w_dialog = '90vw'
    }

    store.dispatch('globalvar/getauthtoken')
      .then((token) => {
        var authtoken = token.access_token
        //console.log(authtoken);
        var avatarId = JSON.parse(getUserData()).avatar
        //console.log(getUserData());
        if(avatarId==''){
          //console.log('avatarrrrrr');
          store.dispatch('globalvar/getprofileurl', avatar)
        }else{
          console.log('start fetchpic from mounted in Navbar.vue');
          this.fetchpic(avatarId,authtoken).then(r=>{

            var baseUrl = r.baseUrl
            //console.log(baseUrl);
            store.dispatch('globalvar/getprofileurl', baseUrl)
          }).catch((e) => {
            console.log('cannot fetchpic from mounted');
          })
        }

      })
      .catch((e) => {
        console.log(e);
      })

    //
    //console.log(this.w_dialog);
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    ...mapState({
      device: state => state.app.device
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
<style lang="scss">
@media print {
  @page { size: landscape; }
  .navbar_as {
    display: none;
  }
  .sidebar-container{
    display: none;
  }
  .handle-button{
    display: none;
  }
}
.topmenuqr{
  margin-top: 16px;
  width: 44%;
  display: inline-block;
}
.navbar_as {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }
.auto-center {
  text-align: center;
}
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
