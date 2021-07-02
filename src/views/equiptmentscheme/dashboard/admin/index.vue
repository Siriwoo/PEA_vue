<template>
  <div class="dashboard-editor-container">
    <!--<github-corner class="github-corner" />-->
    <el-row style="padding:5px 5px 5px;" align="top">
      <el-col :xs="24" :sm="24" :lg="11" class='suitbox'>
        <el-card class="box-card">
          <el-row>
            <el-col :xs="7" :sm="7" :lg="7">
              <span class="topic1">{{allequipt}}</span>
            </el-col>
            <el-col :xs="16" :sm="16" :lg="16">
              <div class="box_des">
                <div class="topic">อุปกรณ์ในความรับผิดชอบ</div>
                <div class="suptopic"
                @click="showpick_depart()">[{{depart}}]</div>
                <div class="type_user">[{{typeuser}}]</div>
              </div>

            </el-col>
          </el-row>
          <hr>
          <div v-for="o in equiptypemo" class="text item">
            <img class="previewfull"
            :src="o.avatar">
            {{o.equip }}<span class="big_font">{{o.sum}}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="boxsel">
          <el-radio-group v-model="bartype" size="small">
            <el-radio-button label="week" type="warning">สัปดาห์</el-radio-button>
            <el-radio-button label="month" type="warning">เดือน</el-radio-button>
            <el-radio-button label="year" type="warning">ปี</el-radio-button>
          </el-radio-group>
        </div>
        <panel-group @handleSetLineChartData="handleSetLineChartData"
        :datashowpanel="datashowpanel"
        :is_data_fetched="is_data_fetched"/>
      </el-col>
    </el-row>
    <el-dialog
      :title="titlePickSingleLine"
      :visible.sync="dialogPickSingleLine"
      width="50%">
      <PickSingleLine
      :scheme="scheme_pick"
      @whatpick="whatpick"/>
    </el-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import { getUserData, setUserclick, getUserclick } from '@/utils/auth'
import GithubCorner from '@/components/GithubCorner'
import PickSingleLine from '@/views/components/pick_singleline_avatar_and_title'
import PanelGroup from './components/PanelGroup'
//import LineChart from './components/LineChart'
import { fetchpic } from '@/mixins/fetchpic'
import { freqmethods } from '@/mixins/freqmethods'
//import RaddarChart from './components/RaddarChart'
//import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import tooldefault from '@/assets/default/tools.png'
import imgload from '@/assets/loading/loadpic.gif'
//import TransactionTable from './components/TransactionTable'
//import TodoList from './components/TodoList'
//import BoxCard from './components/BoxCard'
import { mapGetters } from 'vuex'


export default {
  name: 'DashboardAdmin',
  mixins: [fetchpic,freqmethods],
  components: {
    GithubCorner,
    PanelGroup,
    BarChart,
    PickSingleLine
  },
  computed: {
    ...mapGetters([
      'roles',
      'locations',
      'equiptype',
      'loadingmainpage',
      'tokenStr'
    ])
  },
  watch:{
    bartype(v){
      if(typeof getUserclick() !== 'undefined'){
        var tmp = JSON.parse(getUserclick())
        if(typeof JSON.parse(getUserclick()).dashscheme !== 'undefined'){
          tmp.dashscheme.bartype = v
        }else{
          tmp.dashscheme = {
            bartype:v
          }
        }
        setUserclick(tmp)
        this.loadsumalljob()
        this.querygraph()

      }
    },
    seldatetype(v){
      if(typeof getUserclick() !== 'undefined'){
        var tmp = JSON.parse(getUserclick())
        if(typeof JSON.parse(getUserclick()).dashscheme !== 'undefined'){
          tmp.dashscheme.seldatetype = v
        }else{
          tmp.dashscheme = {
            seldatetype:v
          }
        }
        setUserclick(tmp)
      }

    },
    loadingmainpage(v){
      //console.log(v);
      if(!v){
        //console.log('is here');
        this.queryfirstvalue()
      }
    }
  },
  data() {
    return {
      seldatetype: '',
      dialogPickSingleLine: false,
      datashowpanel: [],
      is_data_fetched: false,
      equiptypemo: [],
      depart: '',
      typeuser: '',
      allequipt: 0,
      bartype: 'week',
      titlePickSingleLine: '',
      scheme_pick: [{
        title: ''
      }],
      flagloadgraph:{
      }
    }
  },
  mounted() {
    if(!this.loadingmainpage){
      //console.log('again');
      this.queryfirstvalue()
    }
    //do something after mounting vue instance
    //console.log(this.equiptype);
  },
  methods: {
    whatpick(e){
      console.log(e);
      this.dialogPickSingleLine = false
      this.depart = this.getandsetUserclick('view_depart',e.title)
      this.typeuser = this.getandsetUserclick('view_typeuser',e.typeelem)
      this.loadequiptype()
      this.loadallequipttype('reload dashboard')

    },
    showpick_depart(){
      this.titlePickSingleLine = "กรุณาเลือกหน่วยงานที่ต้องการดู"
      this.dialogPickSingleLine = true
      this.scheme_pick.name = 'pick_depart'
      if(typeof JSON.parse(getUserData()) !== 'undefined'){
        let v = JSON.parse(getUserData()).viewer.split(',')
        let d = JSON.parse(getUserData()).depart
        if(!v.includes(d)){
          v.unshift(d);
        }
        this.scheme_pick.list = v.map(e=>{
          let nv = {}
          if(d===e){
            nv.typeelem = 'admin'
          }else{
            nv.typeelem = 'viewer'
          }
          nv.title = e
          return nv
        })
      }else{
      }
    },
    handleSetLineChartData(type) {
      //console.log(type);
      if(typeof getUserclick() !== 'undefined'){
        var tmp = JSON.parse(getUserclick())
        console.log(tmp);
        if(typeof JSON.parse(getUserclick()).dashscheme !== 'undefined'){
          tmp.dashscheme.typejob = type
        }else{
          tmp.dashscheme = {
            typejob:type
          }
        }
        setUserclick(tmp)
      }
      console.log(this.seldatetype);
      //find between date by bartype


    },
    loaduserdata(){
      let v = JSON.parse(getUserclick()).view_depart
      let t = JSON.parse(getUserclick()).view_typeuser
      if(typeof v !=='undefined' ){
        this.depart = v
        this.typeuser = t
      }else if(typeof JSON.parse(getUserData()).depart !=='undefined' ){
        this.depart = JSON.parse(getUserData()).depart
        this.typeuser = 'admin'
      }else{
        console.log('no userdata redirect to login page, should not here');
      }

    },
    loadavatarequipt(){
      console.log('++loadavatarequipt++');
      console.log(this.equiptype);
      if(this.equiptype.length>0){
        this.equiptypemo = this.equiptype.filter(c=>{
          //console.log(e.equip.includes("ยังไม่ทราบ"));
          return !c.equip.includes("ยังไม่ทราบ")
        }).map(e=>{

            var tn = ''
            if(e.equip_short!=''){
              tn+=`(${e.equip_short})`
            }
            var o ={}
            var t = ''
            var x = ''
            if(typeof JSON.parse(e.detail).pictures[0] !='undefined'){
              t = JSON.parse(e.detail).pictures[0].picturetoken

            }
            o.equip = e.equip+tn
            o.avatar = imgload
            o.equiptypeID = e.id
            o.meid = t
            return o

        })
        var st = ''
        var up = []
        for (var i = 0; i < this.equiptypemo.length; i++) {
          up.push(this.equiptypemo[i].meid)
        }
        var uq = [...new Set(up)];
        //console.log(uq);
        for (var i = 0; i < uq.length; i++) {
          if(uq[i]!=''){
            st+='mediaItemIds='+uq[i]
            if(i<uq.length-1){
              st+='&'
            }
          }

        }
        this.fetchmultipic(st,this.tokenStr).then(r=>{
          //console.log(r);
          var h = this.equiptypemo.map(e=>{
            var oj = {}
            oj.equip = e.equip
            oj.equiptypeID = e.equiptypeID
            oj.sum = e.sum
            var g = r.mediaItemResults.find(f=>{
              return f.mediaItem.id == e.meid
            })
            //console.log(g);
            if(typeof g!= 'undefined'){
              oj.avatar = g.mediaItem.baseUrl
            }else{
              oj.avatar = tooldefault
            }

            return oj
          })
          this.equiptypemo = h
          var tmp = {
            info: 'saveavatar',
            equiptypeavatar: this.equiptypemo
          }
          this.$store.dispatch('info/commitinfo', tmp)
          console.log(this.equiptypemo);
        })
      }else{
        this.equiptypemo = []
      }

      //console.log(this.equiptypemo);


    },
    loadsumalljob(){
      //console.log();
      var tmp = {}
      tmp.info = 'sumalljob'
      tmp.param1 = this.optionst.map(e=>{
        var o = {
          value:e.value,
          headvalue:e.value.replace(/\/|-/g, "_")
        }
        return o
      })
      tmp.param2 = {}
      tmp.param2.depart = this.depart
      tmp.param2.bartype = this.bartype
      console.log(tmp);
      this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          console.log(r);
          this.datashowpanel = r.data
          this.is_data_fetched =  true
          //this.isloadequiptype = true
          //r= r.data
          //console.log(this.equiptypemo);
          //NProgress.done()
        })
    },
    loadsumallequipt(){
      var em = this.equiptypemo.map(e=>{
        var oj = {
          id:e.equiptypeID,
          equiptype:e.equip
        }
        return oj
      })
      //console.log(em);
      var tmp = {}
      tmp.info = 'sumallequipt'
      tmp.param1 = em
      this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          console.log(r);
          r = r.data
          this.allequipt = 0
          this.equiptypemo = this.equiptypemo.map(e=>{
            var oj = {}
            oj.equip = e.equip
            oj.equiptypeID = e.equiptypeID
            oj.avatar = e.avatar
            oj.meid = e.meid
            oj.sum = r[0][`e${oj.equiptypeID}`]
            this.allequipt+=oj.sum
            return oj
          })
          //this.isloadequiptype = true
          //r= r.data
          //console.log(this.equiptypemo);
          //NProgress.done()
        })
    },
    getuserclick(){
      if(typeof getUserclick() !== 'undefined'){
        var tmp = JSON.parse(getUserclick())
        if(typeof JSON.parse(getUserclick()).dashscheme !== 'undefined'){
          this.bartype = tmp.dashscheme.bartype
          this.seldatetype = tmp.dashscheme.seldatetype
        }
      }
    },
    querygraph(){
      if(typeof JSON.parse(getUserData()).depart !=='undefined' ){
        var tmp = {
          info: 'datagraph',
          param1: {}
        }
        if(typeof JSON.parse(getUserclick()).dashscheme !=='undefined' ){
          tmp.param1.bartype = JSON.parse(getUserclick()).dashscheme.bartype
        }else{
          tmp.param1.bartype = 'week'
        }
        tmp.param1.depart = this.depart
        this.$store.dispatch('info/loadinfo', tmp)
          .then((r) => {
            console.log(r);
          })
        //tmp.param1.jobtype = 'ติดตั้ง'
        //tmp.param1.seldatetype = 'opendate'
        /*
        this.$store.dispatch('info/loadinfo', tmp).then((r) =>{
          this.flagloadgraph.week.opendate.info = r.data[0]
          this.flagloadgraph.week.opendate.flag = true
        })
        tmp.param1.seldatetype = 'getdate'
        this.$store.dispatch('info/loadinfo', tmp).then((r) =>{
          this.flagloadgraph.week.getdate.info = r.data[0]
          this.flagloadgraph.week.getdate.flag = true
        })
        tmp.param1.seldatetype = 'operation'
        this.$store.dispatch('info/loadinfo', tmp).then((r) =>{
          this.flagloadgraph.week.operation.info = r.data[0]
          this.flagloadgraph.week.operation.flag = true
        })
        tmp.param1.seldatetype = 'finish'
        this.$store.dispatch('info/loadinfo', tmp).then((r) =>{
          this.flagloadgraph.week.finish.info = r.data[0]
          this.flagloadgraph.week.finish.flag = true
        })*/
      }else{
        console.log('no userdata redirect to login page, should not here');
      }
    },
    queryfirstvalue(){
      this.getuserclick()
      this.loadavatarequipt()
      this.loadsumallequipt()
      this.loadsumalljob()
      this.loaduserdata()

      this.querygraph()
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Kanit');

html, body {
  font-family: 'Kanit', sans-serif;
}
#app {
  font-family: 'Kanit', sans-serif !important;
}
.box_des{
  display: flex;
  flex-direction:column;
  justify-content:flex-end;
}
.box_des>*{
  text-align: right;
}
.text {
    font-size: 17px;
}
.big_font{
  font-size: 28px;
  font-weight: bold;
  padding-left: 20px;
}

.topic1{
  font-size: 43px;
  float: right;
  font-weight: bold;
}
.topic{
  font-size: 24px;
  float: right;
  font-weight: bold;
}

.suptopic{
  font-size: 22px;
  float: right;
  color: orange;
  cursor: pointer;
}
.boxtopic{

}
.item {
  padding: 5px 0;
  transition: 0.6s;
  display: flex;
  align-items:center;
}
.item:hover{
  background-color: #eff0f1;
  transition: 0.6s;
}
.box-card {
  width: 100%;
}
.previewfull{
  margin-right: 7px;
  width: 40px;
}
.boxsel{
  padding-bottom: 5px;
}
.suitbox{
  padding-top: 0px;
  padding-right: 15px;
}
.selseh{
  font-size: 13px;
  margin-right: 5px;
  border: 1px solid orange;
  padding: 5px;
  border-radius: 3px;
  transition: all 0.6s;
  color: orange;
}
.selseh:hover{
  background-color: orange;
  color: white;
  transition: all 0.6s;
  cursor: pointer;
}

.selseh_f{
  font-size: 13px;
  background-color: orange;
  color: white;
  padding: 5px;
  border: 1px solid orange;
  border-radius: 3px;
  transition: all 0.6s;
}
.dashboard-editor-container {
  width: 1300px;
  margin: auto;
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
@media (max-width:768px) {
  .big_font{
    font-size: 24px;
    font-weight: bold;
    padding-left: 20px;
  }
  .text {
      font-size: 15px;
  }
  .previewfull{
    margin-right: 7px;
    width: 35px;
  }
  .topic1{
    font-size: 37px;
    float: right;
    font-weight: bold;
    padding-right: 6px;
  }
  .topic{
    font-size: 17px;
    float: right;
    font-weight: bold;
  }

  .suptopic{
    font-size: 14px;
    float: right;
    color: orange
  }
  .dashboard-editor-container{
    width: 100%;
    padding: 3px;
    background-color: #f0f2f5;
    position: relative;
    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
  .suitbox{
    padding-top: 0px;
    padding-right: 0px;
  }
}
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
