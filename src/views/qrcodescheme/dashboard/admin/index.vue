<template>
  <div class="dashboard-editor-container">
    <!--<github-corner class="github-corner" />-->
        <el-card class="box-card">
          <el-row>
            <el-col :xs="5" :sm="5" :lg="5" >
              <img :src="avatar_office"
              @click="showselectoffice()"
              class="user-avatar" >
            </el-col>
            <el-col :xs="19" :sm="19" :lg="19">
              <div class="" @click="showselectoffice()">
                <div class="topicdepart">{{cropdepart(viewscheme.office,'just_view')}}</div>
                <div class="suptopic">{{viewscheme.typeview}}</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
        <div class="" v-if="iseditprofile(viewscheme.office)">
          <el-card class="box-card">
            <div class="grid-content bg-purple-light">
              <form class="" enctype="multipart/form-data">
                <label for="file">Upload file</label>
                <input type="file" @change="processFile()" ref="file">
                <el-button @click="uploadfile">upload file</el-button>
              </form>
            </div>
          </el-card>

        </div>
        <div class="" v-if="iseditprofile(viewscheme.office)">
          <el-card>
            <Crudtable
              :key="componentKey_Crudtable"
            />
          </el-card>
        </div>

        <div class="" v-else-if="listbuilding.length==0">
          <el-card class="box-card">
            ไม่พบฐานข้อมูล รถ คลังอุปกรณ์ เครื่องมือ แก้ไฟฯ
          </el-card>
        </div>
        <div class="" v-else>
          <div class="box-card box-card-nav box-img-banner">
            <img src="@/assets/qrscheme/bannerhis.png"
            @click="showhistorylis_qr()">
          </div>
          <el-card class="box-card">
            <el-row >
              <el-col :xs="5" :sm="5" :lg="5" >
                <img :src="avatar_building"
                @click="showmainmenu()"
                class="user-avatar" >
              </el-col>
              <el-col :xs="19" :sm="19" :lg="19">
                <div class="" @click="showmainmenu()">
                  <div class="topic">{{namemain.name1}}</div>
                  <div class="suptopic">{{namemain.name2}}</div>
                </div>
              </el-col>
            </el-row>
          </el-card>
          <el-card class="box-card">
            <el-row v-for="o in listbuilding" >
              <el-col :xs="5" :sm="5" :lg="5" >
                <img :src="avatar_subbuilding"
                @click="showmainmenu(o)"
                class="user-avatar" >
              </el-col>
              <el-col :xs="19" :sm="19" :lg="19">
                <div class="" @click="showmainmenu(o)">
                  <div class="topic">{{o.name1}}</div>
                  <div class="suptopic">{{o.name2}}</div>
                </div>
              </el-col>
            </el-row>
          </el-card>
          <el-card class="box-card">
            <el-row v-for="o in listcar" style="margin-bottom:15px;">
              <el-col :xs="5" :sm="5" :lg="5">
                <img :src="avatar_car"
                @click="showmainmenu(o)"
                class="user-avatar">
              </el-col>
              <div class="" @click="showmainmenu(o)">
                <div class="topic">{{o.name1}}</div>
                <div class="suptopic">{{o.name2}}</div>
              </div>
            </el-row>
          </el-card>
        </div>

    <el-dialog
      :title="nameTitle_dialogListallequipt"
      :visible.sync="dialogListallequipt"
      class="qrdia"
      fullscreen
      width="30%">
      <Listallequipt
      :tru_allorsingle="tru_allorsingle"
      :focuswarehouse="focuswarehouse"
      :key="componentKey_Listallequipt"
      />
    </el-dialog>
    <el-dialog
      :title="nameTitle_MainmenuQr"
      :visible.sync="dialogMainmenuQr"
      class="qrdia"
      width="95%">
      <Mainmenuqr
      :menuscheme="menuscheme"
      :focuswarehouse="focuswarehouse"
      :key="componentKey_Mainmenuqr"
      @clickMainmenu="clickMainmenu"
      />
    </el-dialog>
    <el-dialog
      :title="nameTitle_dialogactivity"
      :visible.sync="dialogactivity"
      class="qrdia"
      fullscreen>
      <Qractivity
      :typeshow="typeshow_activity"
      :truwhatmelist="listallware"
      :focuswarehouse="focuswarehouse"
      :moredetal_qrac="moredetal_qrac"
      :schemedo="schemedo"
      :key="componentKey_Qractivity"
      />
    </el-dialog>
    <el-dialog
      :title="nameTitle_dialogChecklists"
      :visible.sync="dialogChecklists"
      class="qrdia"
      fullscreen>
      <Checklists
      :focuswarehouse="focuswarehouse"
      :schemedo="schemedo"
      :typeshow="typeshow_activity"
      :moredetal_qrac="moredetal_qrac"
      :key="componentKey_Checklists"
      />
    </el-dialog>
    <el-dialog
      :title="nameTitle_dialogstorylist"
      :visible.sync="dialogstorylist"
      class="qrdia"
      fullscreen>
      <Storylist
      @whathisedit="whathisedit"
      :key="componentKey"
      />
    </el-dialog>
    <el-dialog
      :title="nameTitle_Selectoffice"
      class="qrdia"
      :visible.sync="dialogSelectoffice"
      width="95%">
      <Selectoffice
      :key="componentKey_Selectoffice"
      @clickSelectoffice="clickSelectoffice"
      />
    </el-dialog>

  </div>
</template>

<script>
import Listallequipt from '@/views/qrcodescheme/components/listallequipt'
import Mainmenuqr from '@/views/qrcodescheme/components/mainmenu'
import Qractivity from '@/views/qrcodescheme/components/qractivity'
import Checklists from '@/views/qrcodescheme/components/checklists'
import Storylist from '@/views/qrcodescheme/components/storylist'
import Selectoffice from '@/views/qrcodescheme/components/selectoffice'
import Crudtable from '@/views/qrcodescheme/components/crudtable'
import PickProfileTable from '@/views/qrcodescheme/components/pick_profile_table'
//import LineChart from './components/LineChart'
import { fetchpic } from '@/mixins/fetchpic'
import { freqmethods } from '@/mixins/freqmethods'
import { qrhistory } from '@/mixins/qrhistory'
import axios from 'axios'
//import RaddarChart from './components/RaddarChart'
//import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import tooldefault from '@/assets/default/tools.png'
import imgload from '@/assets/loading/loadpic.gif'
//import TransactionTable from './components/TransactionTable'
//import TodoList from './components/TodoList'
//import BoxCard from './components/BoxCard'
import { mapGetters } from 'vuex'

import { getUserData, setUserclick, getUserclick } from '@/utils/auth'

import pavatar_building from "@/assets/qrscheme/buildingicon.png"
import pavatar_subbuilding from "@/assets/qrscheme/subbuildingicon.png"
import pavatar_car from "@/assets/qrscheme/caricon.png"
import pavatar_office from "@/assets/qrscheme/home.png"

export default {
  name: 'DashboardAdmin',
  mixins: [fetchpic,freqmethods,qrhistory],
  components: {
    PickProfileTable,
    Listallequipt,
    Mainmenuqr,
    Qractivity,
    Storylist,Checklists,Selectoffice,
    Crudtable
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
  data() {
    return {
      viewscheme:{
        office: '',
        typeview: ''
      },
      typeoffice: '',
      np:{
        nowpage: 'main',
        nowtext: 'xx',
        main:'หน้าหลัก/',
        history:'..หลัก/ประวัติการดำเนินการ/'
      },
      tru_allorsingle: '',
      moredetal_qrac: {
        idupdate: 0
      },
      predesserts: {details:[]},
      typeshow_Checklists: '',
      detailshow_Checklists: {},
      dialogChecklists: false,
      nameTitle_PickProfileTable: '',
      dialogPickProfileTable: false,
      componentKey_PickProfileTable: 0,
      nameTitle_dialogChecklists: '',
      componentKey_Selectoffice: 0,
      componentKey_Mainmenuqr: 0,
      componentKey_Checklists: 0,
      componentKey_Listallequipt: 0,
      componentKey_Qractivity: 0,
      componentKey_Crudtable: 0,
      typepickprofile: '',
      typeshow_activity: '',
      nameTitle_dialogstorylist: '',
      dialogstorylist: false,
      schemedo: {},
      nameTitle_dialogactivity: '',
      dialogactivity: false,
      nameTitle_MainmenuQr: '',
      dialogMainmenuQr: false,
      menuscheme: '',
      componentKey: 0,
      focuswarehouse: '',
      dialogListallequipt: false,
      listbuilding: [],
      listcar: [],
      listallware: [],
      seldatetype: '',
      avatar_building: '',
      avatar_subbuilding: '',
      avatar_car: '',
      avatar_office: '',
      nameTitle_Selectoffice: '',
      depart: '',
      dialogSelectoffice: false,
      nameTitle_dialogListallequipt: '',
      namemain:{
        name1: 'รวม',
        name2: 'อุปกรณ์ฯ และ เครื่องมือฯ ทั้งหมดจากคลังสำรองและรถแก้ไฟ'
      }
    }
  },
  methods: {
    iseditprofile(v){
      return v.includes("ผตบ. กบษ.");
    },
    processFile(event) {
      this.fileupload = this.$refs.file.files[0]
    },
    async uploadfile(){
      const formData = new FormData();
      formData.append("file", this.fileupload);
      var userdata = JSON.parse(getUserData())
      //console.log(userdata);
      formData.append("admin", userdata.depart);
      console.log(this.fileupload)
      try {
        await axios.post(process.env.VUE_APP_BASE_SERVER+"/info/uploadprofile", formData)
          .then( (res)=> {
            //console.log('here result na');
            //this.tableData = result.data

            res = res.data
            console.log(res);
            if(res.code===50072){
              this.dialogthispage = true
              var l = res.all.length
              this.servererror = true
              this.dialogtitle = 'Error ทั้งหมด '+l+' แห่ง'
              this.dialogmessage = res.all
            }else{
              this.notisuccess(res.message)
            }
            this.queryfirstvalue()
            //console.log(res);
          }, function (error) {
            console.log(error);
          });
      } catch (e) {
        console.log(e);
      } finally {

      }

        //return false
    },
    setqrclick(ddpart,type){
      var t = JSON.parse(getUserclick())
      this.viewscheme.office = ddpart
      this.viewscheme.typeview = type
      t.viewscheme = this.viewscheme
      setUserclick(t)
      console.log(JSON.parse(getUserclick()));
    },
    clickSelectoffice(v){
      //console.log(v)
      this.loadallwarehouse(v.info.topic)
      this.setqrclick(v.info.topic,v.info.suptopic)

      this.dialogSelectoffice = false
    },
    showselectoffice(){
      this.dialogSelectoffice = true
      this.nameTitle_Selectoffice = this.np.main+'หน่วยงานที่ต้องการดู'
      this.np.nowpage = 'selectoffice'
      this.componentKey_Selectoffice += 1;
    },
    showhistorylis_qr(){
      this.nameTitle_dialogstorylist = this.np.main+'ประวัติการดำเนินการ'
      this.np.nowpage = 'history'
      this.dialogstorylist = true
      this.componentKey += 1;
    },
    showmainmenu(v){
      var f = {}
      f = this.actualname(v)
      this.tru_allorsingle = f.name1
      this.np.nowpage = 'mainqr'
      this.np.nowtext = this.np.main+f.name1+'/'
      this.nameTitle_MainmenuQr = this.np.main+f.name1
      this.focuswarehouse = f
      this.componentKey_Mainmenuqr += 1;
      this.dialogMainmenuQr = true
    },
    actualname(v){
      if(typeof v!='undefined'){
      }else{
        v = this.namemain
      }
      return v
    },
    loadrestequipt(){
      var tmp = {}
      tmp.info = 'loadrestequipt'
      tmp.param1 = this.defaultdepart()
      this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          console.log(r);

          //r= r.data
          //console.log(r);
          //NProgress.done()
        })
    },
    loadallwarehouse(ddpart){
      //console.log('1');
      //console.log(getUserData());
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.loading = true;
      var tmp = {}
      tmp.info = 'loadallwarehouse'
      tmp.param1 = this.cropdepart(ddpart,'for_query')
      //console.log(tmp);
      this.$store.dispatch('info/loadinfo', tmp)
      .then((r) => {
        console.log(r);
        this.normalizer(r.data)
        loading.close()
        //console.log(r);
      })
      .catch((e) => {
        console.log(e);
        //NProgress.done()
      })
    },
    normalizer(r){
      console.log('normalizer');
      this.listbuilding = []
      this.listcar = []

      r.map(e=>{
        if(e.typewarehouse == "building"&&e.belong_to!=='fuc'){
          this.listbuilding.push(e)
        }else if (e.typewarehouse == "car") {
          this.listcar.push(e)
        }
      })
      this.listallware = this.listbuilding.concat(this.listcar)
      //console.log(this.listcar)
      console.log(this.listbuilding)
    },
    querypicture(){
      this.avatar_building = pavatar_building
      this.avatar_subbuilding = pavatar_subbuilding
      this.avatar_office = pavatar_office
      this.avatar_car = pavatar_car
    },
    loadtypeofview(){
      var ddpart = JSON.parse(getUserData()).depart
      this.setqrclick(ddpart,'Admin')
      this.loadallwarehouse(ddpart)
    },
    queryfirstvalue(){
      //this.getuserclick()
      //this.loadavatarequipt()
      //this.loadsumallequipt()
      //this.loadsumalljob()
      //this.loadrestequipt()
      //this.loadallequipt()
      this.loadtypeofview()

      this.querypicture()
      this.initparameter()
      //this.querygraph()
    },
    initparameter(){
      this.moredetal_qrac.ownscheme = {
        crop:this.cropdepart(JSON.parse(getUserData()).depart,'for_query'),
        typeoffice:this.typeoffice
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
  watch:{
    loadingmainpage(v){
      //console.log(v);
      if(!v){
        //console.log('is here');
        this.queryfirstvalue()
      }
    }
  }
}
</script>

<style lang="scss" >
@import url('https://fonts.googleapis.com/css?family=Kanit');

html, body {
  font-family: 'Kanit', sans-serif;
}
#app {
  font-family: 'Kanit', sans-serif !important;
}
body{

  background-color: #f0f2f5;
}
.box-img-banner img{
  width: 100%;
}
.box-img-banner{
  padding: 0 !important;
}
.user-avatar {
  width: 45px;
  height: 45px;
}
.text {
    font-size: 17px;
}
.big_font{
  font-size: 28px;
  font-weight: bold;
  padding-left: 20px;
}
.qrdia .el-dialog.is-fullscreen {
    width: 100%;
    margin-top: 0;
    margin-bottom: 0;
    height: 98%;
    //overflow: hidden;???
}
.topic1{
  font-size: 43px;
  float: right;
  font-weight: bold;
}
.topic{
  font-size: 24px;
  font-weight: bold;
}

.suptopic{
  font-size: 14px;
  padding-top: 4px;
  color: #949494;
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
  margin-top: 10px;
  margin-bottom: 10px;
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
.previewfull{
  margin-right: 7px;
  width: 40px;
}
.boxsel{
  padding-bottom: 5px;
}
.suitbox{
  margin: auto;
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
.el-dialog{
  width: 700px !important;
}
.dashboard-editor-container {
  padding: 0px;
  background-color: rgb(240, 242, 245);
  position: relative;
  margin: auto;
  width: 720px;

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
  .el-input-number.is-controls-right .el-input__inner .el-input-number--large .el-input {

    padding-left: 15px !important;
    padding-right: 50px!important;
    padding-bottom: 10px !important;
    padding-top: 5px !important;
  }
  .el-dialog__title{
    font-size: 16px;
  }
  .el-dialog{
    margin-top: 1vh !important;
    width: 97% !important;
  }
  .el-input{
    font-size: 38px !important;
  }
  .listtext{
    font-size: 14px;
  }
  .el-message-box {
    width:100% !important;
  }
  .el-input__inner {
    height: 64px;
  }
  .nofull .el-dialog{
    margin-top: 30vh !important;
  }
  .nofull .el-dialog__body {
    background-color: #f0f2f5 !important;
    padding: 0px 0px 2px !important;
    overflow: auto;
    height: auto !important;
  }
  .el-dialog__body{
    background-color: #f0f2f5 !important;
    padding: 0px 0px 2px !important;
    overflow: auto;
    height: 90vh;
  }
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
    font-size: 21px;
    font-weight: bold;
  }
  .topicdepart{
    font-size: 20px;
    font-weight: bold;
    color:#9c27b0
  }
  .dashboard-editor-container{
    padding: 3px;
    background-color: #f0f2f5;
    position: relative;
    width: 98%;
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

</style>
