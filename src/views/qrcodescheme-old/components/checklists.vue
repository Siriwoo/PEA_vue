<template>
  <div class="app-container-lise">
    <el-row style="padding:5px 5px 5px;" align="top">
      <el-col :xs="24" :sm="24" :lg="11">
        <div class="box-card box-card-nav box-img-banner fixheight">
          <img :src="iconmain+'?imageView2/1/w/90/h/90'" class="avatartool" >
          <img src="@/assets/qrscheme/bannerbg2.png">
          <div class="ban-box1">
            {{schemedo.name}} ใน
          </div>
          <div class="ban-box2">
            {{focuswarehouse.name1}}
          </div>
          <div class="ban-box3">
            {{focuswarehouse.name2}}
          </div>
        </div>
        <div class="box-card box-card-nav">
          <div class="topic2">
            การตรวจสอบสภาพ
            <span v-if="schemedo.name=='เชคยานพาหนะ'">ยานพาหนะ</span>
            <span v-if="schemedo.name=='เชคเครื่องมือ'">เครื่องมือ</span>
            ประจำวัน
          </div>
          <div class="topic3">
            <span v-if="typeshow=='edit'">{{datetostr(moredetal_qrac.timestamp)}}</span>
            <span v-else>{{datetostr('now')}}</span>
            <div class="kall">
              <div v-bind:class="{ 'k1n': !ks['k1'], 'k1f': ks['k1'] }" @click="shifttime('k1')">กะ 1</div>
              <div v-bind:class="{ 'k1n': !ks['k2'], 'k1f': ks['k2'] }" @click="shifttime('k2')">กะ 2</div>
              <div v-bind:class="{ 'k1n': !ks['k3'], 'k1f': ks['k3'] }" @click="shifttime('k3')">กะ 3</div>
            </div>
          </div>
          <div class="topic4">
            ผู้ตรวจสอบ {{nameuser.name}}
          </div>
        </div>
        <div class="box-card box-card-nav">

          <div v-if="schemedo.name=='เชคยานพาหนะ'" class="barcheck" v-for="(x,index) in checkdetail" @click="barcheck(index)">
            <div class="">
              <img :src="x.iconcheck" class="checkpat" >
            </div>
            <div class="">
              {{x.checklistname}}
            </div>
          </div>
          <div v-if="schemedo.name=='เชคเครื่องมือ'" class="mbar" v-for="(x,index) in checkdetail" >
            <div class="" >
              <div class="line">
                <!--img :src="x.iconcheck" class="checkpat" @click="barcheck(index)"-->
              </div>
              <div class="line tp1">
                {{x.category}}
              </div>
            </div>
            <div class="ml1">
              <div class="b-line" v-for="(e,i) in x.elements" >
                <div class="bar2" @click="barcheck(index,i)">
                  <div class="line c1">
                    <img :src="e.iconcheck" class="checkpat" >
                  </div>
                  <div class="line c1_5">
                    ({{e.nownum}})
                  </div>
                  <div class="line c2">
                    {{e.name}}
                  </div>
                </div>
                <div class="newline"
                v-if="!checkdetail[index].elements[i].whatcheck">
                  <el-input
                    type="textarea"
                    :rows="2"
                    :disabled="typeshow=='edit'"
                    placeholder="หมายเหตุ"
                    v-model="e.whynot">
                  </el-input>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="box-card box-card-nav">

        </div>
      </el-col>
    </el-row>
  <el-row style="padding:5px 5px 5px;" align="top">
    <el-button type="primary" :loading="isloadsave" v-if="typeshow!='edit'" @click="entermasterscheme_qr()">บันทึกการตรวจสอบ</el-button>
  </el-row>
  <el-dialog
    :title="dialog_header_confirm"
    :visible.sync="dialog_confirm"
    append-to-body
    width="95%">
    <span>{{dialog_detail_confirm}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog_confirm = false">ไม่</el-button>
      <el-button type="primary" @click.native="con_del()">ใช่</el-button>
    </span>
  </el-dialog>
  <!--el-dialog
    :title="name_Reasondetail"
    :visible.sync="dialog_Reasondetail"
    append-to-body
    width="100%">
    <Reasondetail
    :moredetail = 'moredetail'
    :whatmelist = 'truwhatmelist'
    @confirmdetail="confirmdetail"
    :key="componentKey_Reasondetail"
    />
  </el-dialog-->
  </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import { toggleClass } from '@/utils'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import Selectdest from '@/views/qrcodescheme/components/select'
import Detailedit from '@/views/qrcodescheme/components/detailedit'
import { getUserData,
  setUserclick,
  getUserclick,
  setQrcodescheme,
  getQrcodescheme} from '@/utils/auth'
import {frefucqr} from '@/views/qrcodescheme/mixins/frefucqr'
import {freqmethods} from '@/mixins/freqmethods'
import picon_increse from "@/assets/qrscheme/increse.png"
import picon_decrese from "@/assets/qrscheme/decrese.png"
import picon_move from "@/assets/qrscheme/move.png"
import picon_alarm from "@/assets/qrscheme/alarm.png"
import picon_edit from "@/assets/qrscheme/edit.png"
import picon_carcheck from "@/assets/qrscheme/car-check.png"
import picon_equiptcheck from "@/assets/qrscheme/checklist.png"
import picon_right from "@/assets/qrscheme/correct.png"
import picon_wrong from "@/assets/qrscheme/wrong.png"
const Instascan = require('instascan');
export default {
  name: 'Theme',
  mixins: [frefucqr,freqmethods],
  components: {
    Selectdest,Detailedit
  },
  props:['schemedo','focuswarehouse','typeshow','moredetal_qrac'],
  data() {
    return {
      ks:{
        k1:true,
        k2:false,
        k3:false,
      },
      checkdetail: [],
      checklistscheme: {},
      nome: '',
      toolfromqr: [],
      toolfromqrdest: [],
      cameras: [],
      scanner: null,
      activeCameraId: null,
      titledialog_Qrscan:'SCAN',
      dialog_Qrscan: false,
      iconmain: '',
      whatmelist: [],
      name_select: 'กรุณาเลือก',
      dialog_selectlist: false,
      theme: false,
      slideValue: 50,
      radio: 3,
      activetoolorequipt: 'พัสดุสำรองแก้ไฟฯ',
      sfocuswarehouse: '',
      sfocuswhat: '',
      componentKey: 0,
      all_equipt: [],
      all_tool: [],
      dialog_confirm: false,
      dialog_detail_confirm: '',
      dialog_header_confirm: '',
      bdel: 0,
      name_Detailedit: '',
      dialog_Detailedit: false,
      con_type: '',
      isloadsave: false,
      iconcheck:  '',
      nameuser:{
        code:'',
        name:''
      }
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
    },
    dialog_Qrscan(v){
      if(!v){
        //console.log(Instascan.Camera)
        this.closedialog()
      }
    }
  },
  methods: {
    shifttime(k){
      if(this.typeshow=='insert'){
        if(k=='k1'){
          this.ks.k1 = true
          this.ks.k2 = false
          this.ks.k3 = false
        }else if(k=='k2'){
          this.ks.k1 = false
          this.ks.k2 = true
          this.ks.k3 = false
        }else if(k=='k3'){
          this.ks.k1 = false
          this.ks.k2 = false
          this.ks.k3 = true
        }
      }

    },
    barcheck(i,j){
      console.log(i);
      if(this.typeshow!=='edit'){
        if(this.schemedo.name=='เชคยานพาหนะ'){
          this.checkdetail[i].whatcheck = !this.checkdetail[i].whatcheck
          if(this.checkdetail[i].whatcheck){
            this.checkdetail[i].iconcheck = picon_right
          }else{
            this.checkdetail[i].iconcheck = picon_wrong
          }

        }else if (this.schemedo.name=='เชคเครื่องมือ') {
          this.checkdetail[i].elements[j].whatcheck = !this.checkdetail[i].elements[j].whatcheck
          if(this.checkdetail[i].elements[j].whatcheck){
            this.checkdetail[i].elements[j].iconcheck = picon_right
          }else{
            this.checkdetail[i].elements[j].iconcheck = picon_wrong
          }
        }
        this.checkdetail.push([])
        this.checkdetail.splice(-1,1)
      }


    },
    entermasterscheme_qr(){

      this.dialog_confirm = true
      this.dialog_detail_confirm = 'คุณต้องการบันทึก ใช่หรือไม่'
      this.dialog_header_confirm = 'Sure?'
      this.con_type = 'savemaster'
      console.log(this.checkdetail);
    },
    validateallscheme(){
      return true
    },
    con_del(){
      console.log(this.checkdetail);
      if(this.con_type == 'deltoolfromqr'){
        this.toolfromqr.splice(this.bdel, 1)
        this.toolfromqrdest.splice(this.bdel, 1)
      }else if(this.con_type == 'savemaster'){
        //console.log(this.checkdetail);
        console.log(this.focuswarehouse)
        console.log('do save all scheme')
        //push scheme to server
        if(this.validateallscheme()){
          var tmp = {}
          console.log(this.checkdetail);
          var tchk = this.checkdetail
          var t = {
            typeHistory:this.schemedo.name,
            focuswarehouse:this.focuswarehouse,
            detail:tchk,
            shift:this.ks
          }
          //console.log(this.checkdetail);
          //console.log(this.schemedo.name);
          if(this.schemedo.name=='เชคเครื่องมือ'){
            //console.log('isเชคเครื่องมือ');
            var tx ={
              detail:[]
            }
            for (var i = 0; i < tchk.length; i++) {
              tx.detail[i] = {}
              tx.detail[i].category = tchk[i].category
              tx.detail[i].elements = []
              for (var j = 0; j < tchk[i].elements.length; j++) {
                tx.detail[i].elements[j] = {}
                tx.detail[i].elements[j].whatcheck = tchk[i].elements[j].whatcheck
                tx.detail[i].elements[j].whynot = tchk[i].elements[j].whynot
                tx.detail[i].elements[j].toolid = tchk[i].elements[j].toolid
                tx.detail[i].elements[j].nownum = tchk[i].elements[j].nownum
                tx.detail[i].elements[j].name = tchk[i].elements[j].name
                tx.detail[i].elements[j].warehouseid = tchk[i].elements[j].warehouseid
              }
            }
            t.detail = tx.detail
          }

          tmp.info = 'savemaster_qrcode_checklist'
          tmp.param1 = t
          var u = JSON.parse(getUserData())
          //console.log(u);
          tmp.param2 = {
            whodo:u.empcode,
            depart:u.depart,
            typeshow:'insert'
          }
          console.log(tmp)
          /**/const loading = this.$loading({
            lock: true,
            text: 'กำลังบันทึก...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$store.dispatch('info/fetchandupdate', tmp)
          .then(r=>{
            try {
            } catch (e) {

            } finally {
              loading.close();
            }
            console.log(r);

          })/**/
        }
      }

      this.dialog_confirm = false
    },
    confirmdetail(v){
      this.dialog_Detailedit = false
      this.detailnap = v
      console.log(v);
    },
    showdialog_Detailedit(x){
      this.dialog_Detailedit = true
      this.name_Detailedit = `รายละเอียดแนบการ${this.schemedo.name}จำนวนอุปกรณ์`
    },
    confirm(i){
      this.dialog_confirm = true
      this.dialog_detail_confirm = 'คุณต้องการลบ ใช่หรือไม่'
      this.dialog_header_confirm = 'Sure?'
      this.bdel = i
      this.con_type = 'deltoolfromqr'
      //console.log('confirm');
    },
    queryfirstvalue(){
      //console.log(this.focuswarehouse)
      //console.log(this.typeshow);
      this.loadpicavatar()
      this.initvalue()
      this.qmasterwarehous()
    },
    async qmasterwarehous(){
      var tmp = {}
      console.log(this.focuswarehouse)
      if(this.schemedo.name=='เชคยานพาหนะ'){
        tmp.info = 'load_qr_car_checklist'
        if(this.typeshow=='edit'){
          console.log(this.moredetal_qrac);
          this.checkdetail = this.moredetal_qrac.detail
          this.ks = this.moredetal_qrac.shift
          for (var i = 0; i < this.checkdetail.length; i++) {
            if(this.checkdetail[i].whatcheck){
              this.checkdetail[i].iconcheck = picon_right
            }else{
              this.checkdetail[i].iconcheck = picon_wrong
            }


          }
          //this.destwarehouse = this.moredetal_qrac.destwarehouse
          //this.toolfromqr = JSON.parse(this.moredetal_qrac.toolfromqr)
          //this.toolfromqrdest = JSON.parse(this.moredetal_qrac.toolfromqrdest)
          //this.moredetail = JSON.parse(this.moredetal_qrac.detailnap)
        }else{
          var r = await this.$store.dispatch('info/loadinfo', tmp)
          r = r.data
          this.checkdetail = r
          this.ks = this.abouttime('NowShift')
          for (var i = 0; i < this.checkdetail.length; i++) {
            this.checkdetail[i].whatcheck = true
            this.checkdetail[i].iconcheck = picon_right
          }
        }

      }else if (this.schemedo.name=='เชคเครื่องมือ') {
        var x = this.focuswarehouse.codename
        tmp.param1 = x
        tmp.info = 'load_qr_equipt_checklist'
        if(this.typeshow=='edit'){
          console.log(this.moredetal_qrac);
          this.ks = this.moredetal_qrac.shift
          this.checkdetail = this.moredetal_qrac.detail
          for (var i = 0; i < this.checkdetail.length; i++) {
            for (var j = 0; j < this.checkdetail[i].elements.length; j++) {
              if(this.checkdetail[i].elements[j].whatcheck){
                this.checkdetail[i].elements[j].iconcheck = picon_right
              }else{
                this.checkdetail[i].elements[j].iconcheck = picon_wrong
              }
            }
          }
        }else{
          var r = await this.$store.dispatch('info/loadinfo', tmp)
          r = this.regroupallequipt(r.data)
          this.checkdetail = r
          this.ks = this.abouttime('NowShift')
          for (var i = 0; i < this.checkdetail.length; i++) {
            this.checkdetail[i].whatcheck = true
            this.checkdetail[i].iconcheck = picon_right
            for (var j = 0; j < this.checkdetail[i].elements.length; j++) {
              this.checkdetail[i].elements[j].whatcheck = true
              this.checkdetail[i].elements[j].iconcheck = picon_right
            }
          }
        }


      }


      console.log(this.checkdetail);
      return r
    },
    initvalue(){
      this.warehouseid = this.focuswarehouse.codename
      var t = JSON.parse(getUserData())
      this.nameuser.code = t.empcode
      this.nameuser.name = t.fullname
    },
    closedialog(){
      this.scanner.stop()
      this.scanner = null
      this.cameras = []
      this.scans = []
    },
    processcontent(c){
      var d = c.split('?')[1]
      this.actionscanscheme(d)
      this.dialog_Qrscan = false
      return d
    },
    focustool(x){
      for (var i = 0; i < this.toolfromqr.length; i++) {
        if(x==i){
          this.toolfromqr[i].isfocus = true
        }else {
          this.toolfromqr[i].isfocus = false
        }
      }
      this.toolfromqr.push([])
      this.toolfromqr.splice(-1,1)
      //console.log(this.toolfromqr);
    },
    showdialog_Qrscan(c){
      if(typeof this.destwarehouse.codename === 'undefined'&&this.schemedo.name==='ย้าย'){
        this.notierror('กรุณาเลือกปลายทาง')
      }else{
        this.commit_showdialog_Qrscan(c)
      }

    },
    tmp_commit_showdialog_Qrscan(c){
      this.scanscheme = 'tool'
      var s1 = 'https://www.peatelecom.com/peaflow/#/qrnumberequipt/index?equip='
      var s2 = ['1020010005','1020200002','1020420105','1020010002','1020300102']
      this.processcontent(s1+s2[Math.floor(Math.random()*s2.length)])
    },
    commit_showdialog_Qrscan(c){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.scanscheme = c
      //this.turnCameraOn()
      this.dialog_Qrscan=true
      this.$nextTick(() => {
        loading.close();
        this.scancam()
      });
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
      var tmp = {
        selcamid:camera.id
      }
      setQrcodescheme(tmp)
    },
    formatName: function (name) {
      return name || '(unknown)';
    },
    loadpicavatar(){
      if(this.schemedo.name=='ลด'){
        this.iconmain = picon_decrese
      }else if(this.schemedo.name=='ย้าย'){
        this.iconmain = picon_move
      }else if(this.schemedo.name=='เพิ่ม'){
        this.iconmain = picon_increse
      }else if(this.schemedo.name=='เชคยานพาหนะ'){
        this.iconmain = picon_carcheck
      }else if(this.schemedo.name=='เชคเครื่องมือ'){
        this.iconmain = picon_equiptcheck
      }
      /*this.iconmain = picon_increse
      this.iconmain = picon_decrese
      this.iconmain = picon_move
      this.iconmain = picon_alarm
      this.iconmain = picon_edit*/
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

<style lang="scss">
.dis_input{

}
.mbar{
  font-size: 19px;
}
.checkpat{
  width: 25px;
}
.newline{
  display: block;

}
.b-line{
  border-bottom: 1px solid #d6d6d6;
  border-bottom-style: dotted;
}
.line{
  display: inline-block;
}
.ml1{
  margin-left: 25px;
}
.barcheck{
  margin-bottom: 3px;
  display: flex;
}
.c1{
  width:10%;
}
.c1_5{
  width:10%;
}
.c2{
  width:75%;
}
.kall{

}
.k1n{
  border: 1px solid #857bec;
  color: #857bec;
  background-color: white;
  transition: all .5s;
}
.k1f{
  color: white;
  background-color: #857bec;
  transition: all .5s;
}
.kall>*{
  display:inline-block;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 20px;
  font-weight: bold;

  border-radius: 10px;

}
.topic2{
  font-size: 16px;
  font-weight: bold;
}
.topic3{
  font-size: 15px;
  color: red;
}
.topic4{
  font-size: 16px;
  font-weight: bold;
}
.tp1{
  font-weight: bold;
}
.bar2{

  display: flex;
}
.barcheckin{
  margin-bottom: 3px;
}
.barcheck>*{
  display: inline-block;
  font-size: 19px;
}
.field-label{
  vertical-align: middle;
}
.box-card {
  width: 400px;
  max-width: 100%;
  margin: 20px auto;
}
.box-img-banner img{
  width: 100%;
}
.block {
  padding: 30px 24px;
}
.wdinput {

  width: 144px !important;
}

.tag-item {
  margin-right: 15px;
}
.fullcam{
  transform: scaleX(1) !important;
  width: 100%;
}
.box-card {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.app-container-lise{

}
.fixheight{
  height: 95px;
}
.mf>*{
  display: inline-block;
  vertical-align: middle
}
.boxtextscan{
  font-size: 14px;
  font-weight: bold;
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

  position: relative;
}
.ban-box1{
  position: absolute;
  top: 8px;
  left: 58px;
  font-size: 14px;
}
.ban-box2{
  position: absolute;
  top: 30px;
  left: 58px;
  font-size: 24px;
}
.ban-box3{
  position: absolute;
  top: 54px;
  left: 58px;
  font-size: 12px;
}
.lr{
  border-right: 1px solid grey;
  height: 50px;
}
.pl{
  margin-left: 10px;
}
.avatartool{
  width: 40px !important;
  position: absolute;
  top: 24px;
  left: 10px;
}
.mf{

}
.basefocus{
  padding: 5px;
}
.focus{
  border: 1px solid red;
  transition: .5s;
}
.boxqrscan img{
  width: 50px;
}
</style>
