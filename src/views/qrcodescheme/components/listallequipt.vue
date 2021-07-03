<template>
  <div class="app-container-lise">
  <div class="box-name2-list">
    {{focuswarehouse.name2}}
  </div>
  <el-radio-group v-model="activetoolorequipt">
    <el-radio-button label="พัสดุสำรองแก้ไฟฯ">พัสดุสำรองแก้ไฟฯ</el-radio-button>
    <el-radio-button label="อุปกรณ์และเครื่องมือ">อุปกรณ์และเครื่องมือ</el-radio-button>
  </el-radio-group>

  <Panellist
  :sfocuswhat = 'sfocuswhat'
  :activetoolorequipt = 'activetoolorequipt'
  :allorsingle = 'allorsingle'
  :key="componentKey"
  />


  </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import { toggleClass } from '@/utils'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import Panellist from '@/views/qrcodescheme/components/panellist'
import { getUserData, setUserclick, getUserclick } from '@/utils/auth'
import {frefucqr} from '@/views/qrcodescheme/mixins/frefucqr'
import { freqmethods } from '@/mixins/freqmethods'
export default {
  name: 'Theme',
  mixins: [frefucqr,freqmethods],
  components: {
    Panellist
  },
  props:['focuswarehouse','tru_allorsingle'],
  data() {
    return {
      theme: false,
      slideValue: 50,
      radio: 3,
      activetoolorequipt: 'พัสดุสำรองแก้ไฟฯ',
      sfocuswarehouse: '',
      sfocuswhat: '',
      allorsingle: '',
      componentKey: 0,
      all_equipt: [],
      all_tool: []
    }
  },
  watch: {
    theme() {
      toggleClass(document.body, 'custom-theme')
    },
    activetoolorequipt(v){
      //console.log(this.focuswarehouse);
      this.whatactive('from_watch_activetoolorequipt')
      //console.log(this.activetoolorequipt);


      //console.log(this.sfocuswhat);
    }
  },
  methods: {
    whatactive(r){
      console.log(r);
      this.allorsingle = this.tru_allorsingle
      console.log(this.allorsingle);
      if(this.activetoolorequipt=='พัสดุสำรองแก้ไฟฯ'){
        console.log(this.all_equipt);
        this.sfocuswhat = this.all_equipt
      }else{
        this.sfocuswhat = this.all_tool
      }
      this.componentKey += 1;
    },
    queryfirstvalue(){
      //this.getuserclick()
      //this.loadavatarequipt()
      //this.loadsumallequipt()
      //this.loadsumalljob()
      //this.loadrestequipt()
      this.loadallequipt()
      this.loadfirstlist()
      //this.querygraph()
    },
    loadfirstlist(){



    },
    loadallequipt(){
      //find d for someware house of user
      //console.log('trig warehouse');
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if(this.focuswarehouse.name1=='รวม'){
        console.log('รวม');
        this.qmasterwarehous().then(r=>{
          var x = r.data[0].master_warehouse
          this.sumalltool(x).then(r=>{
            console.log('++sumalltool++');
            console.log(r);
            this.whatactive('from_setTimeout')
            loading.close();
            console.log('++sumalltool++');
          })
        })
      }else{
        console.log('เจาะจง');
        var r2 = {
          data:[{
            codename: this.focuswarehouse.codename,
            profile: this.focuswarehouse.tool_in_warehouse
          }]
        }
        var tmp = {}
        tmp.param2 = ''
        var soa = 'all'
        console.log(this.focuswarehouse);

        this.func_load_all_tool_in_all_give_warehouse(r2,tmp,soa).then(r=>{
          this.whatactive('from_setTimeout')
          loading.close();
        })

      }

      //
    },
    async qmasterwarehous(){
      var tmp = {}
      tmp.info = 'load_masterwarehouse_from_depart'
      var x = JSON.parse(getUserclick()).viewscheme.office
      tmp.param1 = this.cropdepart(x,'for_query')
      var r = await this.$store.dispatch('info/loadinfo', tmp)
      console.log(r);
      return r
    }
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
