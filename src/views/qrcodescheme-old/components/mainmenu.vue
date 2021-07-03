<template>
  <div class="app-container-lise">
    <div class="box-name2">
      {{focuswarehouse.name2}}
    </div>
    <div class="masterbar" v-for="e in menuall" v-if="e.ishow" @click="show_dialogactivity(e.func)">
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
// eslint-disable-next-line
/* eslint-disable */
import { toggleClass } from '@/utils'
import avatar from "@/assets/toppup/avatar.png"
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import { getUserData, setUserclick, getUserclick } from '@/utils/auth'
import {frefucqr} from '@/views/qrcodescheme/mixins/frefucqr'
import picon_increse from "@/assets/qrscheme/addhis.png"
import picon_decrese from "@/assets/qrscheme/decresehis.png"
import picon_move from "@/assets/qrscheme/movehis.png"
import picon_alarm from "@/assets/qrscheme/alarm.png"
import picon_edit from "@/assets/qrscheme/edit.png"
import picon_carcheck from "@/assets/qrscheme/car-check.png"
import picon_equiptcheck from "@/assets/qrscheme/checklist.png"


export default {
  name: 'Theme',
  mixins: [frefucqr],
  components: {

  },
  props:['focuswarehouse'],
  data() {
    return {
      menuall:[
        {icon:'',topic:'เพิ่ม',func:'เพิ่ม',suptopic:'การเพิ่มอุปกรณ์จากใบเบิกเข้าคลัง',ishow:false},
        //{icon:'',topic:'ลด',func:'ลด',suptopic:'การนำอุปกรณ์ไปใช้งาน',ishow:false},
        {icon:'',topic:'ย้าย',func:'ย้าย',suptopic:'การย้ายอุปกรณ์จากที่หนึ่งไปยังอีกที่หนึ่ง',ishow:false},
        {icon:'',topic:'เชคยานพาหนะ',func:'เชคยานพาหนะ',suptopic:'ตรวจสอบสภาพยานพาหนะแต่ละกะ',ishow:false},
        {icon:'',topic:'เชคเครื่องมือ',func:'เชคเครื่องมือ',suptopic:'ตรวจสอบสภาพเครื่องมือแต่ละกะ',ishow:false},
        {icon:'',topic:'สรุป',func:'สรุป',suptopic:'สรุปรายการอุปกรณ์คงเหลือ',ishow:false},
        {icon:'',topic:'แก้ไข',func:'แก้ไข',suptopic:'แก้ไขข้อมูล',ishow:false},
      ],
      theme: false,
      avatar_wh: '',
      componentKey: 0,
    }
  },
  watch: {
    theme() {
      toggleClass(document.body, 'custom-theme')
    }
  },
  methods: {

    queryfirstvalue(){
      //this.getuserclick()
      //this.querygraph()
      this.querypicture()
      this.showbutton()
    },
    show_dialogactivity(v){
      var h = {
        name:v,
        type:'insert'
      }
      this.$emit('clickMainmenu', h)
    },
    querypicture(){
      this.menuall[0].icon = picon_increse
      this.menuall[1].icon = picon_decrese
      this.menuall[2].icon = picon_move
      this.menuall[3].icon = picon_carcheck
      this.menuall[4].icon = picon_equiptcheck
      this.menuall[5].icon = picon_alarm
      this.menuall[6].icon = picon_edit
      this.avatar_wh = avatar
    },
    showbutton(){
      if(this.isadmin()){
        if(typeof this.focuswarehouse.typewarehouse === 'undefined'){
          this.menuall[5].ishow = true
        }else if (this.focuswarehouse.typewarehouse === 'building') {
          this.menuall[0].ishow = true
          this.menuall[2].ishow = true
          this.menuall[4].ishow = true
          this.menuall[5].ishow = true
          this.menuall[6].ishow = true
        }else if (this.focuswarehouse.typewarehouse === 'car') {
          this.menuall[1].ishow = true
          //this.menuall[2].ishow = true ไม่เอาย้ายจากรถแล้ว
          this.menuall[3].ishow = true
          this.menuall[4].ishow = true
          this.menuall[5].ishow = true
          this.menuall[6].ishow = true
        }
      }else{
        this.menuall[5].ishow = true
      }

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
  font-size: 20px;
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
