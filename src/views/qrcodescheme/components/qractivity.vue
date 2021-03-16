<template>
  <div class="app-container-lise">
    <el-row style="padding:5px 5px 5px;" align="top">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-card class="box-card" v-if="typeshow=='edit'">
          <div class="banlist" >
            <div class="c1 c1mo">
              <div class="img">
                <img :src="baseUrlprofile" class="img-circle" @click="showuser(moredetal_qrac)">
              </div>
            </div>
            <div class="c2">
              <div class="line2">
                <div class="" v-for="ex in getarrayjob(moredetal_qrac.statusjob)">
                  {{ex}}
                </div>
              </div>
              <div class="line3">
                {{datetostr(moredetal_qrac.timestamp)}} ({{getshift(moredetal_qrac.activitydetail)}})

              </div>
            </div>

          </div>
          <img :src="icon_history" class="avatartoolsty_small" @click="showallhistory(moredetal_qrac)">

        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="box-card box-card-nav box-img-banner fixheight">
          <img :src="iconmain+'?imageView2/1/w/90/h/90'" class="avatartool" >
          <img src="@/assets/qrscheme/bannerbg2.png">
          <div class="ban-box1">
            {{schemedo.name}} จำนวนอุปกรณ์ ใน
          </div>
          <div class="ban-box2">
            {{focuswarehouse.name1}}
          </div>
          <div class="ban-box3">
            {{focuswarehouse.name2}}
          </div>
        </div>
        <div class="box-card box-card-nav box-img-banner fixheight" v-if="schemedo.name=='ย้าย'">
          <img :src="iconmain+'?imageView2/1/w/90/h/90'" class="avatartool" >
          <img src="@/assets/qrscheme/bannerbg2.png"
          @click="showselect()">
          <div class="ban-box1">
            {{schemedo.name}} ไปยัง
          </div>
          <div class="ban-box2">
            {{destwarehouse.name1}}
          </div>
          <div class="ban-box3">
            {{destwarehouse.name2}}
          </div>
        </div>

        <div class="box-card box-card-nav">
          <el-row style="padding:5px 5px 5px;" align="top">
            <el-col :xs="9" :sm="9" :lg="9" class='suitbox'>
              <div class="mf lr" @click="showdialog_Qrscan('tool')">
                <div class="boxqrscan">
                  <img src="@/assets/qrscheme/qrcodescan.png">
                </div>
                <div class="boxtextscan">
                  SCAN
                </div>
              </div>

            </el-col>
            <el-col :xs="14" :sm="14" :lg="11" class='suitbox'>
              <div class="mf" @click="showdialog_Detailedit('tool')">
                <div class="boxqrscan pl">
                  <img src="@/assets/qrscheme/detail.png">
                </div>
                <div class="boxtextscan">
                  กรอกรายละเอียด
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <div class="boxwd" v-if="schemedo.name=='ลด'||schemedo.name=='เพิ่ม'">
              <div class="headerwd" v-if="schemedo.name=='ลด'">หมายเลขใบสั่ง</div>
              <div class="headerwd" v-if="schemedo.name=='เพิ่ม'">หมายเลขใบเบิก</div>
              <div class="detailwd" >: {{detailnap.workordercode}}</div>
            </div>
          </el-row>
        </div>
        <div class="box-card box-card-nav">
          <div class="basefocus" v-bind:class="{ 'focus': e.isfocus }" v-for="(e,index) in toolfromqr">
            <div class="listtext ">{{e.name}}({{e.unit}})</div>
            <div class="dis_input">
              <div class="">
                <div class="">
                  <el-input-number
                  size="large"
                  class="wdinput"
                  width="140px"
                  v-model="toolfromqr[index].tonum"
                  controls-position="right"
                  @change="changenumber" :min="0"
                  :max="nummax(e.nownum)"></el-input-number>
                </div>
                <div class="bex">
                  <span v-if="schemedo.name=='ลด'">จำนวนที่ใช้งาน</span>
                  <span v-if="schemedo.name=='เพิ่ม'">จำนวนที่ต้องการเพิ่ม</span>
                  <span v-if="schemedo.name=='ย้าย'">จำนวนที่ต้องการย้าย</span>
                </div>
              </div>
              <div class="pb">
                <div class="">
                  <span v-if="schemedo.name=='เพิ่ม'">/{{e.nownum}} ==> {{e.nownum+toolfromqr[index].tonum}}</span>
                  <span v-if="schemedo.name=='ย้าย'" >
                    <table class="blueTable">
                      <tr>
                        <th colspan="2">ต้นทาง</th>
                        <th colspan="2">ปลายทาง</th>
                      </tr>
                      <tr>
                        <td><div class="w5">เดิม</div></td>
                        <td>เหลือ</td>
                        <td><div class="w5">เดิม</div></td>
                        <td>เหลือ</td>
                      </tr>
                      <tr>
                        <td>{{e.nownum}}</td>
                        <td>{{e.nownum-toolfromqr[index].tonum}}</td>
                        <td>{{toolfromqrdest[index].nownum}}</td>
                        <td>{{toolfromqrdest[index].nownum+toolfromqr[index].tonum}}</td>
                      </tr>
                    </table>
                  </span>
                </div>
                <!--div class="bex">
                  จำนวนคงเหลือ
                </div-->
              </div>

              <el-button type="info"
                icon="el-icon-delete"
                style="float:right;"
                circle
                v-if="isadmin()"
                @click="confirm(index)"
                ></el-button>
            </div>

            <hr>
          </div>
        </div>
      </el-col>
    </el-row>
  <el-row style="padding:5px 5px 5px;" align="top">
    <el-button type="primary"
    v-if="isadmin()"
    :loading="isloadsave" @click="entermasterscheme_qr()">บันทึกข้อมูล</el-button>
  </el-row>
  <el-dialog
    :title="name_select"
    :visible.sync="dialog_selectlist"
    append-to-body
    width="100%">
    <Selectdest
    :whatmelist = 'truwhatmelist'
    :nome = 'nome'
    :key="componentKey"
    @clickware="clickware"
    />
  </el-dialog>
  <el-dialog
    :title="name_Detailedit"
    :visible.sync="dialog_Detailedit"
    append-to-body
    width="100%">
    <Detailedit
    :moredetail = 'moredetail'
    :whatmelist = 'truwhatmelist'
    @confirmdetail="confirmdetail"
    :tru_schemedo='schemedo'
    :key="key_dialog_Detailedit"
    />
  </el-dialog>
  <el-dialog :title="titledialog_Qrscan"
  fullscreen
  append-to-body
  :visible.sync="dialog_Qrscan">
    <video id="preview" autoplay="autoplay" class="active fullcam" ></video>
    <ul>
        <li v-if="cameras.length === 0" class="empty">No cameras found</li>
        <li v-for="camera in cameras">
          <span v-if="camera.id == activeCameraId" :title="formatName(camera.name)" class="active">
            {{ formatName(camera.name) }}
          </span>
          <span v-if="camera.id != activeCameraId" :title="formatName(camera.name)">
            <a @click.stop="selectCamera(camera)">{{ formatName(camera.name) }}</a>
          </span>
        </li>
    </ul>
  </el-dialog>
  <el-dialog
    :title="nameTitle_dialog_Historydo"
    :visible.sync="dialog_Historydo"
    append-to-body
    fullscreen>
    <Historydo
    :alldo="alldo"
    :key="componentKey"
    />
  </el-dialog>
  <el-dialog
    :title="dialog_header_confirm"
    :visible.sync="dialog_confirm"
    append-to-body
    class="nofull"
    width="95%">
    <span>{{dialog_detail_confirm}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog_confirm = false">ไม่</el-button>
      <el-button type="primary" @click="con_del()">ใช่</el-button>
    </span>
  </el-dialog>
  <el-dialog
  append-to-body
    :visible.sync="dialogVisible">
      <user-card :user="user" :whoshow="whoshow" :refresh="refresh"/>
  </el-dialog>
  </div>
</template>

<script>
import { toggleClass } from '@/utils'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import Selectdest from '@/views/qrcodescheme/components/select'
import Detailedit from '@/views/qrcodescheme/components/detailedit'
import Historydo from '@/views/qrcodescheme/components/historydo'
import { getUserData,
  setUserclick,
  getUserclick,
  setQrcodescheme,
  getQrcodescheme} from '@/utils/auth'
import avatar from '@/assets/toppup/avatar.png'
import {frefucqr} from '@/views/qrcodescheme/mixins/frefucqr'
import {freqmethods} from '@/mixins/freqmethods'
import {fetchpic} from '@/mixins/fetchpic'
import picon_increse from "@/assets/qrscheme/addhis.png"
import picon_decrese from "@/assets/qrscheme/decresehis.png"
import picon_history from "@/assets/qrscheme/history.png"
import picon_move from "@/assets/qrscheme/movehis.png"
import picon_alarm from "@/assets/qrscheme/alarm.png"
import picon_edit from "@/assets/qrscheme/edit.png"
import UserCard from '@/views/profile/components/UserCard'

const Instascan = require('instascan');
export default {
  name: 'Theme',
  mixins: [frefucqr,freqmethods,fetchpic],
  components: {
    Selectdest,Detailedit,Historydo,UserCard
  },
  props:['truwhatmelist','focuswarehouse','schemedo','typeshow','moredetal_qrac'],
  data() {
    return {
      ks:{
        k1:true,
        k2:false,
        k3:false,
      },
      dialogVisible: false,
      user: '',
      whoshow: 'whoCreate',
      moredetail: {},
      refresh: 0,
      detailnap: {},
      destwarehouse: {},
      nome: '',
      toolfromqr: [],
      toolfromqrdest: [],
      alldo: [],
      componentKey: 0,
      nameTitle_dialog_Historydo: '',
      dialog_Historydo: false,
      cameras: [],
      scanner: null,
      icon_history: '',
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
      key_dialog_Detailedit: 0,
      baseUrlprofile: ''
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
    nummax(e){
      if(this.schemedo.name==='ย้าย'||this.schemedo.name==='ลด'){
        return e
      }else{
        return 99999
      }
    },
    getarrayjob(t){
      return JSON.parse(t.slice(1,-1))
    },
    getshift(t){
      var a = JSON.parse(t.slice(1,-1)).shift
      if(typeof a!== 'undefined'){
        if(a.k1){
          return 'กะ 1'
        }else if (a.k2) {
          return 'กะ 2'
        }else if (a.k3) {
          return 'กะ 3'
        }
      }else{
        return ''
      }
    },
    showuser(e) {
      console.log(e);
        this.user = {
          baseUrlprofile:this.baseUrlprofile,
          position:e.position,
          depart:e.full_name_short,
          tel:e.tel,
          email:e.email,
          name:`${e.prename}${e.nameuser} ${e.lastname}`,
          empcode:e.username
        }
      this.refresh = Math.floor(Math.random() * 10)
      this.dialogVisible = true
      //console.log(this.user);

    },
    clickware(o){
      this.destwarehouse = o
      this.dialog_selectlist = false
    },
    showselect(){
      if(this.typeshow=='insert'&&this.isadmin()){
        this.dialog_selectlist = true
      }
      this.componentKey+=1

    },
    entermasterscheme_qr(){
      this.dialog_confirm = true
      this.dialog_detail_confirm = 'คุณต้องการบันทึก ใช่หรือไม่'
      this.dialog_header_confirm = 'Sure?'
      this.con_type = 'savemaster'
    },
    confirmdetail(v){
      this.dialog_Detailedit = false
      this.detailnap = v
      console.log(v);
    },
    showdialog_Detailedit(x){
      //if(this.isadmin()){
        this.dialog_Detailedit = true
        this.name_Detailedit = `รายละเอียดแนบการ${this.schemedo.name}จำนวนอุปกรณ์`
        this.key_dialog_Detailedit+=1
      //}

    },
    confirm(i){
      this.dialog_confirm = true
      this.dialog_detail_confirm = 'คุณต้องการลบ ใช่หรือไม่'
      this.dialog_header_confirm = 'Sure?'
      this.bdel = i
      this.con_type = 'deltoolfromqr'
      //console.log('confirm');
    },
    validateallscheme(){
      if(typeof this.destwarehouse.codename === 'undefined'&&this.schemedo.name==='ย้าย'){
        this.notierror('กรุณาเลือกปลายทาง')
        return false
      }else if(this.toolfromqr.length === 0){
        this.notierror('กรุณา Scan Qrcode อุปกรณ์')
        return false
      }else{
        return true
      }


    },
    con_del(){
      if(this.con_type == 'deltoolfromqr'){
        this.toolfromqr.splice(this.bdel, 1)
        this.toolfromqrdest.splice(this.bdel, 1)
      }else if(this.con_type == 'savemaster'){
        console.log(this.focuswarehouse)
        console.log(this.destwarehouse)
        console.log(this.detailnap)
        console.log(this.toolfromqr);
        console.log('do save all scheme')
        //push scheme to server
        if(this.validateallscheme()){
          var tmp = {}
          var t = {
            typeHistory:this.schemedo.name,
            focuswarehouse:this.focuswarehouse,
            destwarehouse:this.destwarehouse,
            detailnap:JSON.stringify(this.detailnap),
            toolfromqr:JSON.stringify(this.toolfromqr),
            toolfromqrdest:JSON.stringify(this.toolfromqrdest),
            shift:this.ks
          }
          tmp.info = 'savemaster_qrcode_scheme'
          tmp.param1 = t
          var u = JSON.parse(getUserData())
          console.log(u);
          tmp.param2 = {
            whodo:u.empcode,
            depart:u.depart,
            dosql:this.dosql(),
            typeshow:this.typeshow,
            idupdate:this.moredetal_qrac.idupdate
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
              this.toolfromqr = []
              this.toolfromqrdest = []
              /*this.$notify({
                title: 'Success',
                message: 'บันทึกสำเร็จ',
                type: 'success'
              });*/
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
    changenumber(){

    },
    showallhistory(e){
      var a = JSON.parse(e.historydo.slice(1,-1))
      console.log(a);
      this.alldo = a
      this.componentKey += 1;
      this.dialog_Historydo = true
      this.nameTitle_dialog_Historydo= 'ประวัติการดำเนินการ'
    },
    queryfirstvalue(){
      this.ks = this.abouttime('NowShift')
      //console.log(this.truwhatmelist)
      //console.log(this.typeshow);
      this.loadpicavatar()
      this.initvalue()
      this.nome = this.focuswarehouse.codename

      if(this.typeshow=='edit'){
        console.log(this.moredetal_qrac);
        this.destwarehouse = this.moredetal_qrac.destwarehouse
        this.toolfromqr = JSON.parse(this.moredetal_qrac.toolfromqr)
        this.toolfromqrdest = JSON.parse(this.moredetal_qrac.toolfromqrdest)
        this.moredetail = JSON.parse(this.moredetal_qrac.detailnap)
      }else{
        this.moredetail = {}
      }
      this.baseUrlprofile = avatar
      //console.log(this.moredetal_qrac.picprofile);
      if(typeof this.moredetal_qrac.picprofile !='undefined'){
        this.fetchpic(this.moredetal_qrac.picprofile,'').then(r=>{

          var baseUrl = r.baseUrl
          this.baseUrlprofile = baseUrl
          console.log(baseUrl);
        }).catch((e) => {
          console.log('cannot fetchpic from mounted');
        })
      }

      console.log(this.moredetail);
    },
    initvalue(){
      this.warehouseid = this.focuswarehouse.codename
    },
    closedialog(){
      this.scanner.stop()
      this.scanner = null
      this.cameras = []
      this.scans = []
    },
    actionscanscheme(d){
      if(this.scanscheme == 'car'){
        console.log('load code for warehouse and show detail');
        var tmp = {}
        tmp.info = 'loadwarehousefromqr'
        tmp.param1 = d.split('=')[1]
        this.warehouseid = tmp.param1
        this.$store.dispatch('info/loadinfo', tmp)
          .then((r) => {
            console.log(r);

            if(r.data.length>0){
              this.warehousescheme = r.data
              this.value_ori = r.data[0].name1
              if(r.data[0].typewarehouse == 'building'){
                this.typewarehouse = 'คลัง'
              }else{
                this.typewarehouse = 'ทะเบียนรถ'
              }
              this.namewarehouse = r.data[0].name1
              this.name2warehouse = r.data[0].name2
              this.step2 = true
              this.step3 = false
              this.maxequipt = 0
              this.number = 0
              this.numberx = 0
              this.nametool = ''
              this.name2tool = ''
            }else {
              this.typewarehouse = 'ไม่พบข้อมูลคลัง'
              this.namewarehouse = ''
              this.name2warehouse = ''
              this.step2 = false
              this.step3 = false
            }

          })
      }else if (this.scanscheme == 'tool') {
        console.log('load code for tool and show detail');
        this.forallware(d)
      }
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
    scancam(){
      console.log('scancam');
      var self = this;
      //await this.timeout(2000)
      self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
      self.scanner.addListener('scan', (content, image)=> {
        console.log(content);
        this.processcontent(content)
        //self.scans.unshift({ date: +(Date.now()), content: content });
      });
      Instascan.Camera.getCameras().then(function (cameras) {
        self.cameras = cameras;
        console.log(cameras);
        if (cameras.length > 0) {
          var tmp = {
            selcamid:cameras[0].id
          }
          if(typeof JSON.parse(getQrcodescheme()).selcamid !== 'undefined'){
            var tmp = JSON.parse(getQrcodescheme())
            console.log(tmp.selcamid);
            //console.log(JSON.parse(getUserclick()));
          }else{
            console.log(tmp.selcamid);
          }
          setQrcodescheme(tmp)
          var selcam = cameras.find(e=>e.id==tmp.selcamid)
          self.scanner.start(selcam);
          //if(self.activeCameraId != cameras[0].id){
          self.activeCameraId = tmp.selcamid

          //}


          //console.log(self.scanner);
        } else {
          console.error('No cameras found.');
        }
      }).catch(function (e) {
        console.error(e);
      });
    },
    showdialog_Qrscan(c){
      if(!this.isadmin()){
        this.notierror('Admin เท่านั้นที่สามารถ SCAN ได้')
      }else if(typeof this.destwarehouse.codename === 'undefined'&&this.schemedo.name==='ย้าย'){
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
      }
      this.icon_history = picon_history
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
.topic{
  display: flex;
}
.bex{
  border-radius: 4px;
  border: 1px solid #cecece;
  background-color: #dadada;
  padding-left: 3px;
  margin-top: 1px;
}
.pb{
}
.dis_input>*{
  display: inline-block;
}
.boxwd{
  display: flex;
}
.detailwd{
  font-size: 21px;
  line-height: 1;
  background-color: #383667;
  color:white;
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
  margin-top: 7px;
  margin-bottom: 7px;
}
.app-container-lise{

}
.fixheight{
  height: 79px;
}
.mf>*{
  display: inline-block;
  vertical-align: middle
}
.w5{
  width: 29px;
}
table.blueTable {
  border: 1px solid #1C6EA4;
  background-color: #EEEEEE;
  width: 100%;
  text-align: center;
  border-collapse: collapse;
}
table.blueTable td, table.blueTable th {
  border: 1px solid #AAAAAA;
}
table.blueTable tbody td {
  font-size: 13px;
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
  top: 3px;
  left: 58px;
  font-size: 14px;
}
.ban-box2{
  position: absolute;
  top: 26px;
  left: 58px;
  font-size: 24px;
}
.ban-box3{
  position: absolute;
  top: 49px;
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
