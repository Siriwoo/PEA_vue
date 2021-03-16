<template>
  <div class="app-container-lise">
    <el-card style="text-align:center;" v-if="allorsingle=='รวม'">
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
          <div class="mf">
            <div class="boxtextscan">
              <el-button type="primary" round @click="totable(act_sfocuswhat)">Export to CSV</el-button>
            </div>
          </div>
        </el-col>
      </el-row>

    </el-card>
    <el-card class="box-card" v-for="(e,index) in copy_act_sfocuswhat" >
      <div class="topic">
        <div class="mr">
          <img :src="arrowud" @click="exorcol(index)"
          v-bind:class="{ 'satic': true,'up': e.expand, 'down': !e.expand }" >
        </div>
        <div class="">
          {{e.category}}({{e.elements.length}})
        </div>
      </div>
      <transition name="bounce">
        <div class="" v-if="e.expand">
          {{e.elements.length}} รายการ...
        </div>
      </transition>
      <transition name="bounce2">
        <div class="" v-if="!e.expand">
          <div class="" v-for="f in e.elements" >
            <el-row >
              <el-col :xs="5" :sm="5" :lg="5">
                <div class="boxall">
                  <div class="numbox">
                    {{f.nownum}}
                  </div>
                  <div class="numunit">
                    {{f.unit}}
                  </div>
                </div>

              </el-col>
              <el-col :xs="19" :sm="19" :lg="19">
                <div class="namebox">
                  {{f.name}}
                </div>
                <div class="smallname">
                  <div class="" v-if="activetoolorequipt=='พัสดุสำรองแก้ไฟฯ'">
                    Max; กฟฟ.ชั้น 1-3 {{f.n_location_o}},กฟส. {{f.n_location_s}},กฟย. {{f.n_location_y}}
                  </div>
                  <div class="" v-else>
                    Max;คน {{f.n_per_person}},1 ตัน {{f.per_car_1ton}},2 3 ตัน {{f.per_car2n3ton}},กระเช้า2 3 ตัน {{f.per_car_kachao}},ศูนย์ {{f.per_center}}
                  </div>
                </div>
                <div class="eachcar" v-if="allorsingle=='รวม'">
                  <div class="dcar" v-for="x in f.all">
                    <div class="c2">
                      {{x.nownum}}
                    </div>
                    <div class="c1">
                      <div class="c1_l1">
                        {{x.name1}} :
                      </div>
                      <div class="c1_l2">
                        {{x.name2}}
                      </div>
                    </div>

                  </div>
                </div>
              </el-col>
            </el-row>
            <hr>
          </div>
        </div>

      </transition>
    </el-card>
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
  </div>

</template>

<script>
import { toggleClass } from '@/utils'
import { getUserData,
  setUserclick,
  getUserclick,
  setQrcodescheme,
  getQrcodescheme} from '@/utils/auth'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import {frefucqr} from '@/views/qrcodescheme/mixins/frefucqr'
import parrowud from "@/assets/qrscheme/arrows.png"
const Instascan = require('instascan');
export default {
  name: 'Theme',
  mixins: [frefucqr],
  props: ['sfocuswhat','activetoolorequipt','allorsingle'],
  data() {
    return {
      arrowud: '',
      cameras: [],
      titledialog_Qrscan: 'SCAN',
      dialog_Qrscan: false,
      theme: false,
      slideValue: 50,
      radio: 3,
      act_sfocuswhat: [],
      copy_act_sfocuswhat: [],
      activeCameraId: null,
      scanner: null
    }
  },
  watch: {
    theme() {
      toggleClass(document.body, 'custom-theme')
    },
    dialog_Qrscan(v){
      if(!v){
        //console.log(Instascan.Camera)
        this.closedialog()
      }
    }
  },
  methods: {
    exorcol(o){
      this.copy_act_sfocuswhat[o].expand = !this.copy_act_sfocuswhat[o].expand
      this.copy_act_sfocuswhat.push([])
      this.copy_act_sfocuswhat.splice(-1,1)
    },
    showdialog_Qrscan(c){
      this.commit_showdialog_Qrscan(c)
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
      var tmp = {
        selcamid:camera.id
      }
      setQrcodescheme(tmp)
    },
    closedialog(){
      this.scanner.stop()
      this.scanner = null
      this.cameras = []
      this.scans = []
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
    processcontent(c){
      var d = c.split('?')[1]
      var e = d.split('=')[1]
      console.log(d);
      console.log(this.act_sfocuswhat);
      for (var i = 0; i < this.act_sfocuswhat.length; i++) {
        var tool = this.act_sfocuswhat[i].elements.find(f=>{
          return f.toolid == e
        })
        if(typeof tool != 'undefined'){
          console.log('is here');
          this.copy_act_sfocuswhat = []
          this.copy_act_sfocuswhat[0] = {
            category:this.act_sfocuswhat[i].category,
            elements:[
              tool
            ]
          }
        }
      }
      this.dialog_Qrscan = false
      return d
    },
    formatName: function (name) {
      return name || '(unknown)';
    },
    t_scancam(){

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
    totable(v){
      console.log(v);
      var n = []
      //console.log(v.length);
      for (var i = 0; i < v.length; i++) {
        //console.log(v[i]);
        for (var j = 0; j < v[i].elements.length; j++) {
          var t = {}
          t['ประเภท'] = v[i].elements[j].type
          t['ชนิด'] = v[i].category

          t['รายการ'] = v[i].elements[j].name
          t['กฟฟ.ชั้น1-3'] = v[i].elements[j].n_location_o
          t['กฟส.'] = v[i].elements[j].n_location_s
          t['กฟย.'] = v[i].elements[j].n_location_y
          t['หน่วย'] = v[i].elements[j].unit
          for (var k = 0; k < v[i].elements[j].all.length; k++) {
            t[v[i].elements[j].all[k].name1] = v[i].elements[j].all[k].nownum
          }
          t['รวม'] = v[i].elements[j].nownum
          //console.log(t);
          n.push(t)
        }

      }
      this.exporttocsv(n,'reporttools')
    },
    groupBy(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },
    sortlist(){
      console.log(this.copy_act_sfocuswhat);
    },
    comact_focuswhat(x){
      var t = []
      var b = []
      for (var i = 0; i < x.length; i++) {
        var entries = Object.entries(this.groupBy(x[i].elements, 'code'))

        b = []
        for (var j = 0; j < entries.length; j++) {
          //console.log(entries[j][1][0].name);
          var a = {}
          a = entries[j][1][0]
          a.all = []
          var c=0
          for (var k = 0; k < entries[j][1].length; k++) {

            var ta = {
              name1:entries[j][1][k].name1,
              name2:entries[j][1][k].name2,
              nownum:entries[j][1][k].nownum,
            }
            a.all.push(ta)
            //console.log(entries[j][1][k].name1+'>'+entries[j][1][k].nownum);
            c+=entries[j][1][k].nownum
          }
          a.nownum = c
          b.push(a)
        }
        var h = {
          category:entries[0][1][0].category,
          elements:b
        }
        t.push(h)
      }
      this.act_sfocuswhat = t
      console.log(this.act_sfocuswhat);
    }
  },
  mounted() {
    //do something after mounting vue instance

    //console.log(this.allorsingle);
    console.log(this.sfocuswhat);
    if(this.allorsingle!='รวม'){
      console.log('here+++');
      this.act_sfocuswhat = this.sfocuswhat
    }else{
      console.log('should here');
      this.comact_focuswhat(this.sfocuswhat)
    }
    this.arrowud = parrowud
    this.copy_act_sfocuswhat = this.act_sfocuswhat
    for (var i = 0; i < this.copy_act_sfocuswhat.length; i++) {
      this.copy_act_sfocuswhat[i].expand = true
    }
    this.sortlist()
  }
}
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
.bounce2-enter-active {
  animation: bounce2-in .5s;
}
.bounce2-leave-active {
  animation: bounce2-in .5s reverse;
}
@keyframes bounce2-in {
  0% {
    opacity: 0;
    margin-top: 40px;
  }
  50% {

  }
  100% {
    margin2-top: 40px;
  }
}
.field-label{
  vertical-align: middle;
}
.lr{
  border-right: 1px solid grey;
  height: 50px;
}
.satic{
  width: 25px;
  transform:rotate(45deg);
}
.up{
  transform:rotate(45deg);
  transition: all 0.3s;
}
.down{
  transform:rotate(225deg);
  transition: all 0.3s;
}
.dcar{
  display: flex;
  align-items: center;
}
.c1{
  width: 80%;
  margin-left: 7px;
}
.mf>*{
  display: inline-block;
  vertical-align: middle
}
.c1_l2{
  font-size: 12px;
  color:grey;
  margin-top: -8px;
}
.c2{
  width: 15%;
  font-size: 21px;
}
.dcar>*{
  display: inline-block;
}
.box-card {
  width: 400px;
  max-width: 100%;
  margin: 20px auto;
}
.mr{
  margin-right: 7px;
}
.topic{
  padding-bottom: 10px;
  color: #9c27b0;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
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
  margin-top: -8px;
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
