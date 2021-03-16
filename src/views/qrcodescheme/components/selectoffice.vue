<template>
  <div class="app-container-lise">
    <div class="masterbar" v-for="e in menuall" v-if="e.ishow" @click="show_dialogactivity(e)">
      <div class="bim">
        <img :src="e.icon" class="user-avatar" >
      </div>
      <div class="m_c2">
        <div class="mto">{{e.topic}}</div>
        <div class="msu">{{e.suptopic}}</div>
      </div>
    </div>



  </div>
</template>

<script>
import { toggleClass } from '@/utils'
import avatar from "@/assets/toppup/avatar.png"
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import { getUserData, setUserclick, getUserclick } from '@/utils/auth'
import {frefucqr} from '@/views/qrcodescheme/mixins/frefucqr'
import pavatar_office from "@/assets/qrscheme/home.png"

export default {
  name: 'Theme',
  mixins: [frefucqr],
  components: {

  },
  props:['focuswarehouse'],
  data() {
    return {
      menuall:[],
      theme: false,
      avatar_wh: '',
      componentKey: 0,
    }
  },
  watch: {
  },
  methods: {

    queryfirstvalue(){
      //this.getuserclick()
      //this.querygraph()
      this.querypicture()
      ///this.showbutton()
      this.querymenu()
    },
    querymenu(){
      var t = JSON.parse(getUserData())
      console.log(t.viewer);
      if(t.viewer!==null){
        var m = t.viewer.split(',')

        for (var i = 0; i < m.length; i++) {
          var tmp = {
            icon:pavatar_office,
            topic:m[i],
            suptopic: 'x',
            ishow: true
          }
          if(t.depart==m[i]){
            tmp.suptopic='Admin'
          }else{
            tmp.suptopic='Viewer'
          }

          this.menuall.push(tmp)

          //console.log(this.menuall)
        }
      }

      //this.menuall.push([])
      //this.menuall.splice(-1,1)
    },
    show_dialogactivity(v){
      var h = {
        info:v,
        type:'selectoffice'
      }
      this.$emit('clickSelectoffice', h)
    },
    querypicture(){
      this.avatar_wh = avatar
    }
  },
  mounted() {
    //do something after mounting vue instance
    if(!this.loadingmainpage){
      //console.log('again');
      //console.log(this.focuswarehouse);
      this.queryfirstvalue()
    }
  }
}
</script>

<style scoped>
.m_c2{
  margin-left: 9px;
}
.bim{
  padding-left: 10px;
}
.mto{
  font-size: 16px;
  font-weight: bold;
}
.msu{
  font-size: 14px;
  color: #adadad;
}
.field-label{
  vertical-align: middle;
}
.box-card {
  width: 400px;
  max-width: 100%;
  margin: 20px auto;
}
.masterbar{
  display: flex;
  align-items: center;
  padding: 5px;
  margin: 4px;
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #fff;
}
.block {
  padding: 30px 24px;
}
.box-name2{
  margin-bottom: 5px;
  padding-left: 5px;
}
.tag-item {
  margin-right: 15px;
}
.box-card {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.app-container-lise{

}
.box-card-nav{
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #fff;
  overflow: hidden;
  color: #626b7d;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  padding: 6px;
  font-size: 13px;

}
</style>
