<template>
  <div class="app-container-lise">
    <el-card class="box-card" v-for="e in liststory" >
      <div class="">
        <div class="">
          {{e.whodo}}
        </div>
        <div class="">
          {{datetostr(e.timedo)}}
        </div>
      </div>

    </el-card>
  </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import { toggleClass } from '@/utils'
import picon_addhis from "@/assets/qrscheme/addhis.png"
import picon_decresehis from "@/assets/qrscheme/decresehis.png"
import { freqmethods } from '@/mixins/freqmethods'
import { getUserData, setUserclick, getUserclick } from '@/utils/auth'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import { fetchpic } from '@/mixins/fetchpic'
export default {
  name: 'Theme',
  mixins: [freqmethods,fetchpic],
  props: ['alldo'],
  data() {
    return {
      theme: false,
      slideValue: 50,
      radio: 3,
      liststory: []
    }
  },
  watch: {
    theme() {
      toggleClass(document.body, 'custom-theme')
    }
  },
  methods: {

    queryfirstvalue(){
      this.liststory = this.alldo
      //this.fetchpictimeline(this.alldo)
      console.log();
    },

  },
  mounted() {
    //do something after mounting vue instance
    if(!this.loadingmainpage){
      //console.log('again');
      this.queryfirstvalue()
    }
  }
}
</script>

<style scoped>
.banlist{
  position: relative;
  display: flex;
  align-items: center;
}
.field-label{
  vertical-align: middle;
}
.banlist>*{
  display: inline-block;
}
.line1{
  font-size: 15px;
  font-weight: bold;
}
.line3{
  font-size: 12px;
  color: grey;
}
.line2{
  color:red;
}
.type1 {
    width: 54px;
    height: 54px;
    background: #eaeaea;
    border: 1px solid #809dc1;
}
.eximg{
  margin-top: -17px;
}
.c1{
  border-radius: 50%;
  text-align: center;
  font-size: 13px;
  color:grey;
}
.c2{
  margin-left: 10px;
}
.avatartoolsty_small{
  width: 30px;
  float: right;
  margin-top: -10px;
}
.box-card {
  width: 400px;
  max-width: 100%;
  margin: 20px auto;
}
.avatartoolsty{
  width: 40px;
}
.topic{
  padding-bottom: 10px;
  color: #9c27b0;
  font-size: 18px;
  font-weight: bold;
}
.block {
  padding: 30px 24px;
}
.boxall{
  text-align: center;
}
.smallname{
  font-size: 11px;
  color:#afafaf;
}
.numbox{
  font-size: 34px;
  color: #3f51b5;
}
.numunit{
  font-size: 13px;
  line-height: 1.2;
}
.namebox{
  font-size: 16px;
  color: #736a6a;
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
