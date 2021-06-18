<template>
  <div class="app-container-lise">
    <el-row v-for="o in listnome" >
      <el-col :xs="5" :sm="5" :lg="5" >
        <img :src="avatar_wh+'?imageView2/1/w/90/h/90'"
        @click="clickware(o)"
        class="user-avatar" >
      </el-col>
      <el-col :xs="19" :sm="19" :lg="19">
        <div class="" @click="clickware(o)">
          <div class="topic">{{o.name1}}</div>
          <div class="suptopic">{{o.name2}}</div>
        </div>
      </el-col>
    </el-row>


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
export default {
  name: 'Theme',
  mixins: [frefucqr],
  components: {
  },
  props:['whatmelist','nome'],
  data() {
    return {
      theme: false,
      avatar_wh: '',
      listnome: []
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
      this.avatar_wh = avatar
      this.listnome = []
      for (var i = 0; i < this.whatmelist.length; i++) {
        if(this.whatmelist[i].codename !== this.nome){
          this.listnome.push(this.whatmelist[i])
        }
      }
      //console.log(this.listnome);
    },
    clickware(o){
      this.$emit('clickware', o)
    }
  },
  mounted() {
    //do something after mounting vue instance
    if(!this.loadingmainpage){
      //console.log('again');
      console.log(this.whatmelist);
      this.queryfirstvalue()
    }
  }
}
</script>

<style scoped>
.field-label{
  vertical-align: middle;
}
.box-card {
  width: 400px;
  max-width: 100%;
  margin: 20px auto;
}

.block {
  padding: 30px 24px;
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
