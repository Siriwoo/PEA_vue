<template>
  <div class="app-container_add">
    <div class="containner">
      <!--el-steps :active="active" finish-status="success" align-center>
        <el-step title="" description="ทะเบียนรถ/คลัง"></el-step>
        <el-step title="" description="เพิ่ม/ลด อุปกรณ์"></el-step>
        <el-step title="" description="เลขใบสั่ง"></el-step>
      </el-steps-->
      <div class="boxadd">
        <div class="barscan" @click="showDialog('car')">
          scan qrcode รถหรือคลัง <img :src="require(`@/assets/toppup/qrcode.png`)">
        </div>

        <div class="camerascreen">
          <p class="decode-result">{{typewarehouse}} : <b>{{ namewarehouse }}</b></p>
          <div class="description2">
            {{name2warehouse}}
          </div>

        </div>
      </div>

      <div class="boxadd" v-if="step2">
        <div class="barscan" @click="showDialog('tool')">
          scan qrcode อุปกรณ์ <img :src="require(`@/assets/toppup/qrcode.png`)">
        </div>
        <el-row>
          <p class="decode-result">{{istool}} <b>{{ nametool }}</b></p>
          <div class="description2">
            {{name2tool}}
          </div>
        </el-row>
          <editorImage color="#1890ff" v-if="isimage"
          :key="refresheditimg"
          class="editor-upload-btn"
          @listendata="datafromeimg"
          :imagedetail="isview('view')"
          :infoelem="1"/>
        <el-tabs type="border-card" @tab-click="clicktab" v-if="step3">
          <el-tab-pane label="เพิ่ม/ลด">
            <div class="camerascreen">
              <el-row :gutter="20">

              <el-input-number
              size="large"
              class="wdinput"
              v-model="number"
              controls-position="right"
              @change="changenumber" ></el-input-number> /{{maxequipt}} {{unit}}

              </el-row>
              <div class="description2">
                ทั้งหมดในคลัง : {{allware}} {{unit}}
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="โยกย้าย">
            <el-row :gutter="20">
              <el-col :xs="10" :sm="10">
                ต้นทาง
                <el-select v-model="value_ori" disabled placeholder="Select">
                  <el-option
                    :label="value_ori"
                    :value="value_ori">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :xs="3" :sm="3">
                >>
              </el-col>
              <el-col :xs="10" :sm="10">
                ปลายทาง
                <el-select v-model="value_dest" placeholder="Select">
                  <el-option
                    v-for="item in dest"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
            <el-input-number
            size="large"
            class="wdinput"
            v-model="numberx"
            controls-position="right"
            @change="changenumber" :min="0" :max="maxequipt"></el-input-number> /{{maxequipt}} {{unit}}
          </el-row>
          <div class="description2">
            ทั้งหมดในคลัง : {{allware}} {{unit}}
          </div>

          </el-tab-pane>
        </el-tabs>


      </div>
      <el-button class="blockstyle" @click="savenownum()" v-if="step3">บันทึก</el-button>

      <el-dialog :title="titledialog" :visible.sync="dialogFormVisible">
        <div class="" v-if="loaddialog">wait..</div>
        <video id="preview" autoplay="autoplay" class="active fullcam" ></video>
        <!--qrcode-stream :camera="camera" @decode="onDecode" @init="onInit">
          <div v-if="validationSuccess" class="validation-success">
            OK
          </div>

          <div v-if="validationFailure" class="validation-failure">
            ล้มเหลว....
          </div>

          <div v-if="validationPending" class="validation-pending">
            กำลังประมวลผล....
          </div>
        </qrcode-stream-->
        <ul>
            <li v-if="cameras.length === 0" class="empty">No cameras found</li>
            <li v-for="camera in cameras">
              <span v-if="camera.id == activeCameraId" :title="formatName(camera.name)" class="active">{{ formatName(camera.name) }}</span>
              <span v-if="camera.id != activeCameraId" :title="formatName(camera.name)">
                <a @click.stop="selectCamera(camera)">{{ formatName(camera.name) }}</a>
              </span>
            </li>
        </ul>
      </el-dialog>
      <el-dialog title="ผิดพลาด" :visible.sync="dialogpleasecar">
        กรุณา SCAN QR CODE รถหรือคลัง ก่อน
      </el-dialog>
    </div>

  </div>

</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import editorImage from '../@/views/components/Editimage'
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { getUserData } from '@/utils/auth'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import NProgress from 'nprogress' // progress bar
import { freqmethods } from '@/mixins/freqmethods'
import { QrcodeStream } from 'vue-qrcode-reader'
import { setQrcodescheme, getQrcodescheme} from '@/utils/auth'
import {frefucqr} from '@/views/qrcodescheme/mixins/frefucqr'
const Instascan = require('instascan');

//NProgress.configure({ showSpinner: false })
let id = 1000;
export default {
  components: { editorImage, QrcodeStream },
  watch: {
      filterText(val) {
        //console.log(this.equiptall);
        this.$refs.tree.filter(val);
      },
      dialogFormVisible(v){
        if(!v){
          //console.log(Instascan.Camera)
          this.closedialog()
        }
      }
  },
  data() {
    return {
      loaddialog: false,
      mystery: 0,
      scanner: null,
      activeCameraId: null,
      cameras: [],
      scans: [],
      warehousescheme: '',
      toolscheme: '',
      allware : 0,
      unit : '',
      dest: [],
      value_ori: 'somewhere',
      value_dest: '',
      isimage: false,
      istool: '',
      nametool: '',
      name2tool: '',
      step2: false,
      //step2_5: false,
      step3: false,
      warehouseid: '',
      toolid: '',
      typewarehouse: '',
      namewarehouse: '',
      name2warehouse: '',
      scanscheme: '',
      dialogpleasecar: false,
      typeactivity: 'เพิ่ม/ลด',
      number: 0,
      numberx: 0,
      active: 0,
      isValid: undefined,
      camera: 'auto',
      result: null,
      titledialog:'SCAN',
      dialogFormVisible: false,
      refresheditimg: '',
      isblock: 11,
      maxequipt: 300,
    };
  },
  created() {
    //do something after creating vue instance
    //console.log(freqmethods);
    //NProgress.start()
    //console.log(this.$route.query.car)
    if(typeof this.$route.query.car === 'undefined'){
      console.log('raised dialog scan car first');
      this.dialogpleasecar = true
    }else {
      console.log(this.$route.query.car);
      this.scanscheme = 'car'
      var d = 'x='+this.$route.query.car
      this.actionscanscheme(d)
    }

  },
  computed: {
    validationPending () {
      console.log('validationPending');
      return this.isValid === undefined
        && this.camera === 'off'
    },

    validationSuccess () {
      //this.camera = 'off'
      console.log('validationSuccess');

      return this.isValid === true
    },

    validationFailure () {
      console.log('validationFailure');
      return this.isValid === false
    }
  },
  mounted() {
    //do something after mounting vue instance
    if(!this.loadingmainpage){
      this.queryfirstvalue()
      //this.scancam()
    }


    //console.log(this.data)
  },
  mixins: [freqmethods,frefucqr],
  methods: {
    queryfirstvalue(){
      this.loadallwarehouse()
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
    closedialog(){
      this.scanner.stop()
      this.scanner = null
      this.cameras = []
      this.scans = []
    },
    formatName: function (name) {
      return name || '(unknown)';
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
      var tmp = {
        selcamid:camera.id
      }
      setQrcodescheme(tmp)
    },
    loadallwarehouse(){
      //console.log('1');
      //console.log(getUserData());
      var ddpart = JSON.parse(getUserData()).depart

      //this.loading = true;
      var tmp = {}
      tmp.info = 'loadallwarehouse'
      tmp.param1 = ddpart
      //console.log(tmp);
      this.$store.dispatch('info/loadinfo', tmp)
      .then((r) => {
        //r = this.normalizer(r.data)
        console.log(r.data);
        this.dest = r.data.map(e=>{
          var robj = {
            value:e.codename,
            label:e.name1
          }
          return robj
        })
        //console.log(this.data);
        //this.loading = false;
        //console.log(r);
      })
      .catch((e) => {
        console.log(e);
        //NProgress.done()
      })
    },
    isview(e){
      if(e=='edit'){
        var e= {}
        e.actscheme = 'edit'
      }else{
        var e= {}
        e.actscheme = 'view'
      }
      return e
    },
    onclose(){
      this.turnCameraOff()
      console.log('close');
    },
    onInit (promise) {
      promise
        .catch(console.error)
        .then(()=>{
          console.log('onInit');
          this.resetValidationState
          //this.dialogFormVisible = false
          //this.turnCameraOff()
        })
    },

    resetValidationState () {
      //this.dialogFormVisible = false
      console.log('resetValidationState');
      console.log(this.dialogFormVisible);
      this.isValid = undefined
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
      this.dialogFormVisible = false
      return d
    },
    async onDecode (content) {
      this.result= this.processcontent(content)
      this.turnCameraOff()

      // pretend it's taking really long
      await this.timeout(2000)
      this.dialogFormVisible = false
      console.log('onDecode timeout(3000)');
      //this.turnCameraOff()
      //this.isValid = content.startsWith('http')

      // some more delay, so users have time to read the message
      //await this.timeout(3000)
      //console.log('onDecode timeout(2000)');


    },
    clicktab(v,e){
      this.typeactivity = v.label
      if(this.typeactivity=='เพิ่ม/ลด'){
        this.number = this.maxequipt
      }else{
        this.numberx = 0
      }


    },
    savenownum(){
      //console.log(this.userdata().empcode);
      console.log(this.toolscheme);
      console.log(this.warehousescheme);

      var found = this.dest.find((element) => {
        //console.log(element)
        //console.log(this.value_dest)
        return element.value === this.value_dest}
      );
      if(typeof found ==='undefined'){
        var found = {
          label:'no dest warehouse'
        }
      }
      console.log(found);
      var tmp = {}
      var activitydetail = ``
      var nownumber = 0
      var newnum = 0
      if (this.typeactivity=='เพิ่ม/ลด') {
        activitydetail+='เพิ่ม/ลด อุปกรณ์ '+this.toolscheme[0].name+' ที่ '+this.toolscheme[0].name1+' คงเหลือ '+this.number+' '+this.toolscheme[0].unit
        nownumber = this.number
        newnum = this.number
      } else {
        activitydetail+='โยกย้าย อุปกรณ์ '+this.toolscheme[0].name+' จาก '+this.toolscheme[0].name1+' ไป '+found.label+' จำนวน '+this.numberx+' '+this.toolscheme[0].unit
        nownumber = this.maxequipt-this.numberx
        newnum = this.numberx
      }
      tmp.info = 'updatenownum'
      tmp.param1 = {
        warehouseid: this.warehouseid,
        toolid:this.toolid,
        nownum:nownumber,
        newnum:newnum,
        whoCreate:this.userdata().empcode,
        typeHistory:this.typeactivity,
        nameproject: activitydetail,
        locationID:this.warehousescheme[0].masterlocationid,
        adminstr:this.warehousescheme[0].adminstr,
        towarehouseid:this.value_dest,
        towarehousename:found.label,
        equiptypeID:76,
        idequipmentsql:99999
      }
      tmp.param2 = {
        stepjob:{
          info: 'finish'
        },
        opendate:{
          detail: new Date()
        },
        getdate:{
          detail: new Date()
        },
        operation:{
          detail: new Date()
        },
        finish:{
          detail: new Date()
        }
      }
      console.log(tmp);
      this.$confirm('คุณกำลังจะ '+activitydetail, 'กรุณายืนยัน', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.commitnumberstock(tmp)
        }).catch((e) => {
          console.log(e);
        });

    },
    commitnumberstock(tmp){
      this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          console.log(r);
          this.scanscheme = 'tool'
          var d = 'x='+this.toolid
          this.actionscanscheme(d)
          if(r.data.length>0){
          }
        })
    },
    datafromeimg(value){
      console.log(value[0]);
      var t = value[0].masterinfo
      var rcc3 = value.map(obj4 =>{
         var rObj4 = {};
         rObj4.picturetoken = obj4.mediaItem.id;
         rObj4.explanation = ''
         return rObj4;
      });
      this.groupradio[t].info.list = rcc3
      console.log(this.groupradio);
      //this.masterScheme[t].list = this.masterScheme[t].list.concat(rcc3)
      //console.log(this.masterScheme);
      //console.log(rcc3)

      //this.imagedetail = rcc3
      //console.log(this.imagedetail);
    },
    showDialog(c){
      this.loaddialog = true
      this.scanscheme = c
      //this.turnCameraOn()
      this.dialogFormVisible=true
      this.$nextTick(() => {
        this.loaddialog = false
        this.scancam()
      });

    },
    turnCameraOn () {
      this.camera = 'auto'
    },

    turnCameraOff () {
      this.camera = 'off'
    },

    timeout (ms) {
      return new Promise(resolve => {
        window.setTimeout(resolve, ms)
      })
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    changenumber(value) {
      //console. log(value);
    }
  }
}
</script>
<style >
video {
    object-fit: contain;
}

.wdinput{
  margin-top: 10px;
  width: 70%;
}
.blockstyle{
  margin-top: 5px;
  width: 100%;
}
  .boxadd{
    padding: 3px;
    border: 1px solid #c5c3c3;
    border-radius: 3px;
  }
  .barscan{
    width: 100%;
    background-color: #a7a7a7;
    height: 27px;
    border-radius: 3px;
    line-height: 1.7;
    padding-left: 5px;
    font-size: 13px;
  }
  .description2{
    background-color: #585858;
    color: #fff;
    font-size: 12px;
    line-height: 1.5;
    padding-left: 5px;
  }
  .barscan img{
    float: right;
    height: 25px;
    padding-top: 3px;
    padding-right: 3px;
  }
  .containner{
    width: 700px;
    margin: auto;
  }
  .app-container_add{

    padding: 7px;
  }
  .camerascreen{
    margin: auto;
    width: 500px;
  }
  .el-message-box {
    width:35% !important;
  }
  @media screen and (max-width: 768px) {
    .el-message-box {
      width:100% !important;
    }
    .wdinput .el-input{
      font-size: 65px !important;
    }
    .el-input-number.is-controls-right .el-input__inner {
        padding-left: 15px !important;
        padding-right: 50px!important;
        padding-bottom: 10px !important;
        padding-top: 5px !important;
    }
    .el-input__inner{
      height: 74px;
    }
    .blockstyle{
      margin-top: 5px;
      width: 100%;
    }
    .containner{
      width: 100%;
      margin: auto;
    }
    .camerascreen{
      margin: auto;
      width: 98%;
    }
    .el-dialog{
      margin-top: 1vh !important;
      width:98% !important;
    }

    .app-container_add{
      overflow: auto;
    }
  }

  .validation-success,
  .validation-failure,
  .validation-pending {
    position: absolute;
    width: 100%;
    height: 100%;

    background-color: rgba(255, 255, 255, .8);
    text-align: center;
    font-weight: bold;
    font-size: 1.4rem;
    padding: 10px;

    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
  }
  .validation-success {
    color: green;
  }
  .validation-failure {
    color: red;
  }
  .fullcam{
    transform: scaleX(1) !important;
    width: 100%;
  }
</style>
