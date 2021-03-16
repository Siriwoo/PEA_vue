<template>
  <div class="scheme-container">
    <div class="center">
      <div class="forcenter">
        <div class="" @click="domenuscheme(elem)"
        v-for="elem in scheme.list">
        <div class="mainbox_pick" v-if="scheme.name=='pick_depart'">
          <img class="pic-menuscheme"
          v-if="elem.typeelem=='admin'"
          :src="require(`@/assets/equipt-scheme/edit.png`)">
          <img class="pic-menuscheme"
          v-else
          :src="require(`@/assets/equipt-scheme/eye.png`)">
          <div class="">
            {{elem.title}}
          </div>
        </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserActivity,getUserData } from '@/utils/auth'
export default {
  name: 'menuscheme',
  props: ['scheme'],
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  data() {
    return {

    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {

  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    domenuscheme(scheme) {
      this.$emit('whatpick',scheme)
    }
  }
}
</script>

<style lang="scss" >
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .scheme-container .el-input input {
    color: $cursor;
  }
}
.mainbox_pick {

  vertical-align: middle;
  background-color: #edeff4;
  border: 1px solid #d8dfea;
  border-radius: 5px 2px;
  box-shadow: 0px 0px 5px #888888;
  margin: 10px;
  text-align: center;
  padding-top: 5px;
  display: flex;
  align-items:center;
  justify-content: flex-start;
  padding-right: 15px;
  font-size: 20px;
  color: #464646;
}

.mainbox_pick:hover {
  background-color: #656a76;
  color: white !important;
  cursor:pointer;
  border: 1px solid #656a76;
}
.mainbox_pick img{
  padding-left: 10px;
  height: 49px;
}
.hamburger.is-active {
  transform: rotate(180deg);
}
.big_font{


}
.forcenter{
  display: inline;
  margin: auto;
}
.center{
  margin: auto;
  display: inline-block;
}
/* reset element-ui css */
.scheme-container {
  text-align: center;
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
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.scheme-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
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

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
