<template>
  <div class="scheme-container">
    <div class="title-container">
      <h3 class="title">กรุณาเลือกโครงการที่ต้องการใช้งาน</h3>
    </div>
    <div class="center">
      <cardmenu/>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserActivity,getUserData } from '@/utils/auth'
import Cardmenu from '@/layout/components/Cardmenu'
export default {
  components: {
    Cardmenu
  },
  name: 'menuscheme',
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  data() {
    return {
      scheme: []
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    console.log('ไม่ควรเข้า component นี้ ควรมาสาเหตุว่ามายังไงแล้วแก้ไขให้ไปเข้าที่ @layout ตรงๆ');
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {

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
  .scheme-container .el-input input {
    color: $cursor;
  }
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
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.scheme-container {
  padding-top: 50px;
  min-height: 100%;
  width: 100%;
  background-color: $bg;
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
