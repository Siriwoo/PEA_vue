<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">{{titleform}}</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="รหัสพนักงาน"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual v-if="bmain=='ลงทะเบียน'">
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password2"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="3"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary"
      style="width:100%;margin-bottom:17px;"
      @click.native.prevent="handleLogin">{{bmain}}</el-button>

      <div class="blocksign">
        <div >
          <img src="@/assets/toppup/peadigitaluitility.png"
            alt="PEA DIGITAL UTILITY" title="" align="right"/>
        </div>
        <div class="">
          <el-button type="primary" class="c-rigth" @click="doswap">
            Or {{bsecond}}
          </el-button>
        </div>

      </div>
    </el-form>

    <el-dialog title="นี่คือข้อมูลของคุณใช่หรือไม่" :visible.sync="showDialog">

    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import SocialSign from './components/SocialSignin'
import { mapGetters } from 'vuex'
import { getUserActivity } from '@/utils/auth'
export default {
  name: 'Login',
  components: { SocialSign },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('The password can not be less than 3 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        password2: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      titleform: 'Login Form',
      bmain: 'Login',
      bsecond: 'ลงทะเบียน'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    doswap(){
      var tmp = this.bmain
      this.bmain = this.bsecond
      this.bsecond = tmp
      //console.log(this.bmain);
      if(this.bmain === 'Login'){
        this.titleform= 'Login Form'
      }else{
        this.titleform= 'Sign Up Form'
      }
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    errormessage(message) {
        this.$notify.error({
          title: 'Error',
          message: message
        });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if(this.bmain=="ลงทะเบียน"){
            if(this.loginForm.password === this.loginForm.password2){

              this.$store.dispatch('user/signup', this.loginForm)
                .then((r) => {
                  //console.log({ path: this.redirect || '/', query: this.otherQuery });
                  //console.log(this.roles);
                  console.log(r);
                  //console.log(this.getUserActivity);
                  if(this.getUserActivity){
                    this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                  }else{
                    console.log('redirect for pick menu scheme')
                    this.$router.push({ path: '/pickscheme'})

                  }

                  this.loading = false//cs
                })
                .catch(() => {
                  this.loading = false
                })
            }else{
              this.errormessage('เย้ย การยืนยันรหัสผ่านไม่ถูกต้อง')
            }
            this.loading = false
          }else {
            this.$store.dispatch('user/loginme', this.loginForm)
              .then(() => {
                //console.log({ path: this.redirect || '/', query: this.otherQuery });
                //console.log(this.roles);//
                //console.log(this.getUserActivity);
                if(this.getUserActivity){
                  this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                }else{
                  console.log('redirect to request path')
                  
                  this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                  //this.$router.push({ path: '/pickscheme'})

                }

                this.loading = false//cs
              })
              .catch(() => {
                this.loading = false
              })
          }

        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.blocksign > *{
  display: inline-block;
}
.c-rigth{

}
.blocksign{
  display: table;
}
.blocksign > * {
  display: table-cell;
  vertical-align: middle;
}
.blocksign img{
  width: 319px;
  margin-right: 6px;
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
@media only screen and (max-width: 470px) {
  .blocksign img{
    width: 160px;
    border-radius: 4px;
  }
}
.tips {
  font-size: 14px;
  color: #fff;
  span {
    &:first-of-type {
      margin-right: 16px;
    }
  }
}
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 126px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }



  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }


}
</style>
