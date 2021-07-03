<template>
  <v-container class="py-1 px-1 mt-0 ">
    <v-overlay :value="loadreadonly">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-btn block @click="newbook()" color="#6b3074" dark v-if="readonly">เริ่มจอง</v-btn>
  <el-card class="box-card" v-if="rightuser=='admin'">
      <div class="box_title1">
        <svg-icon icon-class="appointment" class="meta-item__icon" />
        มีการประชุมจริงหรือไม่
        <span>
          <el-radio-group :disabled="readonly" v-model="save.realmeeting">
            <el-radio label="realmeeting">จริง</el-radio>
            <el-radio label="fakemeeting">ไม่จริง</el-radio>
          </el-radio-group>
        </span>

      </div>
    </el-card>
    <el-card class="box-card">
      <div class="box_title1" >
        <svg-icon icon-class="cashier" class="meta-item__icon" />
        หน่วยงานผู้จัด <span v-if="readonly||event.type=='editable'" class="verysmallfont">(ผู้จอง:{{namewhocreate}})</span>
        <el-select
          v-model="save.owner"
          filterable
          remote
          :disabled="readonly"
          reserve-keyword
          placeholder="เลือกหน่วยงาน"
          :remote-method="remoteselowner"
          :loading="loading">
          <el-option
            v-for="item in options_ow"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

      </div>
    </el-card>
    <el-card class="box-card">
      <div class="box_title1" >
        <svg-icon icon-class="chat" class="meta-item__icon" />
        หัวข้อการประชุม
        <v-textarea label="หัวข้อการประชุม"
        :disabled="readonly"
        outlined rows="1" v-model="save.topic"></v-textarea>
        <hr class="mt-1 mb-1 pl-1 pr-1">
        <svg-icon icon-class="stamp" class="meta-item__icon" />
        บันทึกเลขที่
        <v-text-field label="บันทึกเลขที่"
        :disabled="readonly"
        outlined  v-model="save.stamp"></v-text-field>
      </div>
    </el-card>
    <el-card class="box-card">
      <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="save.date"
          persistent
          range
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <div class="box_title1">
              <svg-icon icon-class="appointment" class="meta-item__icon" />
              วันที่จอง
              <span v-bind:class="[isborderred_duration ? 'borderred' : '']">
                <el-radio-group :disabled="readonly" v-model="save.duration" @change="queryavalible()">
                  <el-radio label="morning">เช้า</el-radio>
                  <el-radio label="afternoon">บ่าย</el-radio>
                  <el-radio label="allday">ทั้งวัน</el-radio>
                </el-radio-group>
              </span>

            </div>
            <v-text-field
              v-model="dateRangeText"
              v-bind:class="[isborderred_date ? 'borderred' : '']"
              prepend-icon="mdi-calendar"
              readonly
              :disabled="readonly"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="save.date"
            scrollable
            range
            color="#6b3074"
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="modal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="to_queryavalible()"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
    </el-card>
    <v-progress-circular indeterminate color="primary" v-if="!isloadroompick"></v-progress-circular>
    <el-card class="box-card" v-if="isshowroompick">
      <div class="">
        <div class="box_title1" >
          <div class="typemeetting">
            เลือกประเภทการประชุม
          <v-select
          v-model="save.typemeetting"
          :disabled="readonly"
          :items="items"
          item-text="state"
          item-value="abbr"
          label="Select"
          persistent-hint
          return-object
          single-line

        ></v-select>
        </div>
          <!-- <el-checkbox v-model="save.checkedvc" :disabled="readonly"></el-checkbox> -->
          <!-- <svg-icon icon-class="agenda" class="meta-item__icon" /> -->
          <span v-if="save.typemeetting.abbr==1">
            เลือกหมายเลขห้อง Conference
            <v-select
              :items="roomconf"
              v-model="save.roomconf"
              :disabled="readonly"
            ></v-select></span>
          <span v-else-if="save.typemeetting.abbr==2">
            <v-text-field label="ห้องที่เข้าร่วม"
            :disabled="readonly"
            outlined  v-model="save.vcjoin"></v-text-field>
          </span>
          <span v-else-if="save.typemeetting.abbr==3">
            <v-text-field label="หมายเลขห้อง"
            :disabled="readonly"
            outlined  v-model="save.vcjoin"></v-text-field>
          </span>
          <span v-else>
            <v-text-field label="หมายเหตุ"
            :disabled="readonly"
            outlined  v-model="save.vcjoin"></v-text-field>
          </span>

        </div>

      </div>
<hr v-if="!save.checkedvc">
    <!-- </el-card>
    <el-card class="box-card"> -->
    <div class="">

      <v-dialog
      v-model="dialog_addroom"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <div class="box_title1 verysmall">
          <svg-icon icon-class="meeting-room" class="meta-item__icon" />
          เลือกห้องประชุม
          <v-btn color="#86a3c3" dark v-on="on" v-if="!readonly">
            <svg-icon icon-class="add" class="meta-item__icon float-right" /> เพิ่มห้องประชุม</v-btn>
        </div>

        <el-select
          v-model="save.roomsit"
          filterable
          remote
          reserve-keyword
          placeholder="เลือกห้องประชุม"
          :remote-method="remoteselrooms"
          :disabled="readonly"
          :loading="loading">
          <el-option
            v-for="item in options_r"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2">
          กรอกข้อมูลห้องประชุม
        </v-card-title>
        <div class="boxcard_di">
          สังกัด <v-progress-circular indeterminate color="primary" v-if="!isloadlocation"></v-progress-circular>
          <el-select
            v-model="newroom.depart"
            filterable
            remote
            @change="load_room_under_location"
            :disabled="!isloadlocation"
            reserve-keyword
            placeholder="เลือกสังกัด"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="">
            ชื่อห้องประชุม
          </div>
          <div class="mb-2">
            <v-chip class="ma-2" color="#86a3c3" v-for="e in allrooml" > {{e.roomname}} </v-chip>
          </div>
          <div class="di">
            <v-textarea
              v-model="newroom.name"
              label="พิมพ์ชื่อห้องประชุมที่ต้องการเพิ่ม"
              rows='2'
            ></v-textarea>
          </div>

          <v-btn @click="addroom()" color="#86a3c3" dark>
            <svg-icon icon-class="add" class="meta-item__icon float-right"/> เพิ่มห้องประชุม</v-btn>
        </div>

      </v-card>
    </v-dialog>
    <div class="">
      <div class="box_title1 verysmall">
        <svg-icon icon-class="multiple-users-silhouette" class="meta-item__icon" />
        จำนวนผู้เข้าร่วม/<el-checkbox v-model="save.isbreak" :disabled="readonly"></el-checkbox> <span class="xred">ขนมเบรค</span>
      </div>
      <v-text-field outlined  v-model="save.numpart" :disabled="readonly"></v-text-field>
    </div>
    </div>

    </el-card>
    <el-card class="box-card" v-if="isshowroompick&&save.numpart>0">
      <v-dialog
      v-model="dialog_addpart"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <div class="box_title1 verysmall">
          <svg-icon icon-class="multiple-users-silhouette" class="meta-item__icon" />
          ผู้เข้าร่วมประชุม
          <v-btn color="#86a3c3" dark v-on="on" v-if="!readonly">
            <svg-icon icon-class="add" class="meta-item__icon float-right" /> เพิ่มผู้เข้าร่วมประชุม</v-btn>
          <div class="mb-2">
            <v-chip
            v-for="e in save.participants"
            class="ma-2" close >{{e}} <svg-icon v-if="!readonly" icon-class="close" class="meta-item__icon"
            @click="removemeetingpart(e)"
            /></v-chip>
          </div>
        </div>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2">
          กรอกข้อมูลผู้เข้าร่วมประชุม
        </v-card-title>
        <div class="boxcard_di">
          <div class="">
            <!-- ชื่อห้องประชุม -->
          </div>

          <div class="di">
            <v-textarea
              v-model="save.tmp_part" :disabled="readonly"
              rows='2'
            ></v-textarea>
          </div>
          <v-btn @click="save.tmp_part=''" color="#86a3c3" dark>
            <svg-icon icon-class="minus" class="meta-item__icon float-right" /> ลบ</v-btn>
          <v-btn @click="addmeetingpart()" color="#86a3c3" dark>
            <svg-icon icon-class="add" class="meta-item__icon float-right" /> เพิ่มผู้เข้าร่วมประชุม</v-btn>
        </div>

      </v-card>
    </v-dialog>


    </el-card>
    <div class="fh" v-if="editable">
      <v-btn  @click="letnewbook()" color="#6b3074" dark :disabled="readonly" >เริ่มจองใหม่</v-btn>
      <v-btn  @click="letedit()" color="#6b3074" dark :disabled="readonly" >แก้ไขข้อมูลการประชุม</v-btn>
      <v-btn  @click="letcancel()" color="#6b3074" dark :disabled="readonly" >ยกเลิกการประชุม</v-btn>
    </div>
    <div class="" v-else>
      <v-btn block @click="letbook('insert')" color="#6b3074" dark :disabled="readonly">จองเลย</v-btn>
    </div>
    <div class="text-center">
        <v-dialog
          v-model="dialog_bookingsystem"
          width="500"
        >
          <v-card>
            <v-card-title class="headline grey lighten-2">
              {{dialog_title}}
            </v-card-title>

            <v-card-text>
              <div class="" v-for="e in dialog_detial">
                {{e}}
              </div>

            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                :loading="loading_btn"
                :disabled="loading_btn"
                @click="confirmdialog()"
              >
                {{dialog_btncomfirm}}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
  </v-container>

</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.fh{
  text-align: right;
}
.el-tag{
  font-size: 20px !important;
}
.boxmain{
  padding-left: 5px;
}
@media screen and (max-width: 768px) {
  .css_qna{
    .el-dialog{
      margin: auto;
      width: 98%;
    }
    .el-dialog__body{
      padding: 0px 0px 0px !important;
    }
  }
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
.el-card__body{
  padding-top: 5px !important;
  padding-left: 6px !important;
  padding-right: 0px !important;
  padding-bottom: 0px !important;
}
.v-select__selections{
  line-height: 28px !important;
}
.v-select__selection--comma{
  font-size: 29px !important;
}
.headerask{
  font-weight: bold;
  font-size: 16px;
}
a {
  color: #42b983;
}
.space{
  min-width: 7px;
}
.box_tb_conf{
  width: 100%;
  padding: 10px;
}
.main_color{
  background-color: #6b3074
}
.text_white{
  color:white;
}
.box_bt_room{
  width: 33%;
  display: inline-block;
  margin-right: 25px;
  margin-bottom: 13px;
}
.v-text-field{
  padding-top: 5px !important;
  margin-top: 0px !important;
}
.bg_card{
  background: #e9eef2;
  border: 1px solid #ddd;
  color: #575a5d;
  border-radius: 3px;
  padding-left: 3px;
  padding-top: 3px;
  min-height: 90px;
}
.boxtbf1{
  font-size: 20px;
}
.typemeetting .v-select__selection--comma {
    font-size: 19px !important;
}
.v-text-field__details{
  display: none !important;
}
.theme--light.v-tabs-items{
  background: #6f6f6f!important;
}
.el-card{
  background-color: #f7f7f7 !important;
  border-radius: 14px !important;
  margin-bottom: 10px !important;
  margin-top: 5px !important;
  padding-right: 5px !important;
}
.box_title1{
  font-size: 21px;

  color:#7b2488;

}
.smallpic{
  width: 70px;
}
.v-application .ma-2{
  margin: 2px!important;
}
@import url('https://fonts.googleapis.com/css?family=Kanit');

html, body {
  font-family: 'Kanit', sans-serif;
}
.el-input__inner{
  background-color: inherit !important;
}
.el-input--medium .el-input__inner{
  height:54px !important;
  font-size: 22px !important;
}
.el-select .el-input.is-focus .el-input__inner {
  border-color: #6b3074 !important;
}
.el-select{
  margin-bottom: 5px !important;
  width: 100% !important;
}
.el-input__inner{
  border: 1px solid #86a3c3 !important;
}
.verysmallfont{
  font-size: 13px;
  color:grey;
}
.verysmall .v-btn:not(.v-btn--round).v-size--default {
    height: 26px !important;
    min-width: 64px !important;
    padding: 0 3px !important;
    float: right;
}
.boxcard_di{
  padding: 5px;
}
.el-radio{
  margin-left: 2px !important;
}
.el-radio__label{
  padding-left: 1px!important;
}
.di .v-input input {
    max-height: 46px;
    padding-left: 9px;
    font-size: 27px;
}
.onlycalendarpage .v-select__selection--comma{
  margin: 0px!important;
}
.onlycalendarpage .v-text-field{
  padding-top: 0px !important;
}
.v-btn--fab.v-size--small{
  height:0px;
}
.onlycalendarpage{
  background-color:#f7f7f7!important;
}
.xred{
  color:red;
}
.borderred{
  border: 1px solid red;
}
#app {
  font-family: 'Kanit', sans-serif;
}
li{
  display: block !important;
}
</style>

<script>
// eslint-disable-next-line
/* eslint-disable */
  import { mapGetters, mapActions, mapState } from 'vuex'
  import axios from 'axios'
  import { getUserData } from '@/utils/auth'
  import { MessageBox, Message } from 'element-ui'
  //  console.log(mapState(['g_text']))
  export default{
    props: ['event'],
    data () {
      return {
        items: [
          { state: 'ผู้จัด Video Conference', abbr: '1' },
          { state: 'เข้าร่วม Video Conference', abbr: '2' },
          { state: 'มีห้อง Video Conf. ประจำหน่วยงาน', abbr: '3' },
          { state: 'ใช้ห้องปกติ', abbr: '4' }
        ],
        dialog_bookingsystem:false,
        dialog_title:'',
        dialog_detial:[],
        dialog_btncomfirm: '',
        loadreadonly: false,
        editable: false,
        loading_btn: false,
        rightuser: 'viewer',
        save:{
          typemeetting:{ state: 'ผู้จัด Video Conference', abbr: '1' },
          owner: '',
          vcjoin: '',
          topic:'',
          stamp:'',
          date:[],
          roomconf: '',
          roomsit:'',
          duration: '',
          participants:[],
          tmp_part:'',
          checkedvc: true,
          isbreak:false,
          numpart: 0,
          realmeeting: 'realmeeting'
        },
        dialog_addroom: false,
        dialog_addpart: false,
        date: new Date().toISOString().substr(0, 10),
        loading: false,
        options: [],
        value: [],
        loading_p: false,
        options_p: [],
        options_r: [],
        options_ow: [],
        value_p: [],
        modal: false,
        componentKey_dAns: 0,
        chooseroom: '',
        choosedetail: '',
        choosenumber: '',
        chooseparticipant: '',
        loading3: false,
        dialognotsave: false,
        AlertIcon: '',
        textAlertTitle: '',
        textalert: '',
        isloadlocation: false,
        isloadrooms: false,
        isshowpicknumpart:false,
        isload_room_under_location:false,
        isshowroompick: false,
        isborderred_date: false,
        isborderred_duration: false,
        isloadroompick:true,
        namewhocreate: '',
        newroom:{
          name:'',
          depart: '',
        },
        all_sel_rooms:[],
        all_roomconf:[],
        roomconf: ['752361','752362','752363','752364','752365','752366','752367',
      '752368','752369','752370','752371','752372','752373','752374','752375','752376','752377','752378','752379','752380'],
        contextEventx:{
          status: false,
          text: '',
          value: ''
        },
        states: ["Alabama", "Alaska"],
        allrooml: [],
        sel_rooms: [],
        readonly:false,
      }
    },
    mixins: [],
    computed: {
      ...mapGetters(['stat_qna']),
      ...mapState(['selectedIntentVux']),
      dateRangeText () {
        //console.log(this.save.date);
        return this.save.date.join(' ~ ')
      }
    },
    watch: {

    },
    mounted() {
      //do something after mounting vue instance
      this.stat_qna[0].contextId = null
      this.all_roomconf = JSON.parse(JSON.stringify(this.roomconf))
      this.loadlocation()
      this.loadrooms()
      this.fillformbook()
    },
    methods: {
      newbook(){
        this.event.type=='book'
        this.readonly = false
        this.resetvalue()
      },
      confirmdialog(){
        if(this.dialog_type == 'edit'){
          this.letbook('update')
        }else if (this.dialog_type == 'cancel') {
          this.letsurecancel()
        }

      },
      realfill(m,detail){

        this.save.owner = m.full_name_short

        this.save.stamp = detail.stamp
        this.save.topic = detail.topic
        console.log(detail);
        //console.log(this.save.dete);
        let d = {}
        d.s = new Date(m.start_date)
        d.e = new Date(m.end_date)
        d.s = d.s.setDate(d.s.getDate() + 1)
        d.e = d.e.setDate(d.e.getDate() + 1)
        d.s = new Date(d.s)
        d.e = new Date(d.e)
        //console.log(d);
        this.save.date.push(d.s.toISOString().substring(0, 10))
        this.save.date.push(d.e.toISOString().substring(0, 10))
        this.save.roomconf = m.roomconf
        this.save.roomsit = m.roomname
        this.save.duration = m.duration
        if(typeof detail.typemeetting !=='undefined'){
          this.save.typemeetting = detail.typemeetting
        }else{
          this.save.typemeetting = {}
        }

        this.save.checkedvc = detail.checkedvc
        this.save.isbreak = detail.isbreak
        this.save.numpart = detail.numpart
        this.save.participants = detail.participants
        this.isshowroompick = true
        this.namewhocreate = `${m.name} ${m.lastname}`
        this.save.vcjoin = detail.vcjoin

      },
      fillformbook(){
        console.log(this.event);
        var userdata = JSON.parse(getUserData())
        console.log(userdata);
        if(this.event.type=='readonly'){
          let m = this.event.maindata
          let detail = JSON.parse(m.detail.substring(1, m.detail.length-1))
          this.loadreadonly = true
          this.readonly = true
          this.realfill(m,detail)
          this.loadreadonly = false
          this.editable = false
        }else if(this.event.type=='editable'){
          if(typeof userdata.permission !=='undefined'){
            let userper = JSON.parse(userdata.permission.substring(1, userdata.permission.length-1))
            if(typeof userper.bookingscheme !=='undefined'){
              this.rightuser = userper.bookingscheme.right
            }
            console.log(this.rightuser);
          }
          let m = this.event
          let detail = m.detail
          this.loadreadonly = true
          this.readonly = false
          this.editable = true
          this.realfill(m,detail)
          this.loadreadonly = false
        }else{
          this.readonly = false
        }
      },
      removemeetingpart(e){
        if(this.readonly==false){
          this.save.participants = this.save.participants.filter((item)=> {
              return item !== e
          })
        }
      },
      addmeetingpart(){
        let f = this.save.participants.find(e => e == this.save.tmp_part);
        //console.log(f);
        if(this.save.tmp_part=='' || typeof f !== 'undefined'){
          Message({
            message: 'ห้ามเว้นว่าง หรือห้ามซ้ำ',
            type: 'error',
            duration: 3 * 1000
          })
        }else{
          this.save.participants.push(this.save.tmp_part)
        }

        console.log('addmeetingpart');
      },
      load_room_under_location(){
        console.log('load_room_under_location');
        var tmp = {}
        tmp.info = 'load_room_under_location'
        tmp.param1 = this.newroom.depart
        console.log(this.newroom);
        this.$store.dispatch('info/loadinfo', tmp)
          .then((r) => {
            //console.log(r.data);
            this.allrooml = r.data
            this.isload_room_under_location = true

            //r= r.data
            //NProgress.done()
          })
      },
      loadlocation(){
        //NProgress.start()
        var tmp = {}
        tmp.info = 'locations'
        tmp.param1 = ''
        this.$store.dispatch('info/loadinfo', tmp)
          .then((r) => {
            //console.log(r.data);
            this.isloadlocation = true
            this.list = r.data.map(e => {
              return { value: `${e.ID}`, label: `${e.TypeOffice}.${e.Name1}` };
            });
            //r= r.data
            //NProgress.done()
          })
      },
      loadrooms(){
        //NProgress.start()
        var tmp = {}
        tmp.info = 'loadrooms'
        tmp.param1 = ''
        this.$store.dispatch('info/loadinfo', tmp)
          .then((r) => {
            console.log(r.data);
            this.isloadrooms = true
            this.sel_rooms = r.data.map(e => {
              return { value: `${e.id}`, label: `${e.roomname} ${e.Name1}` };
            });
            this.all_sel_rooms = JSON.parse(JSON.stringify(this.sel_rooms))
            //console.log(this.all_sel_rooms);
            //r= r.data
            //NProgress.done()
          })
      },
      addroom(){
        if(this.newroom.depart==''||this.newroom.name==''){
          Message({
            message: 'กรุณากรอกข้อมูลให้ครบ',
            type: 'error',
            duration: 3 * 1000
          })
        }else{
          let tmp = {}
          tmp.param1 = {}
          tmp.param1.locationid = this.newroom.depart//JSON.stringify(this.form.detail)
          tmp.param1.roomname = this.newroom.name
          tmp.info = 'add_room'
          console.log(tmp);
          this.$store.dispatch('info/fetchandupdate', tmp)
            .then((r) => {
              //console.log(r.data);
              this.loadrooms()
              this.dialog_addroom = false
          })
          console.log('add room');

        }

      },
      isallvalidate(){
        let r = {}
        let all = new Array(8).fill(false)
        let allm = []
        //console.log(all);
        if(this.save.owner!==''){
          all[5] = true
        }else{
          allm.push('กรุณาเลือกผู้จัดการประชุม')
        }
        if(this.save.topic!==''){
          all[0] = true
        }else{
          allm.push('กรุณากรอกหัวข้อการประชุม')
        }
        if(this.save.date!==''){
          all[1] = true
        }else{
          allm.push('กรุณาเลือกวันที่')
        }
        if(this.save.roomconf!==''||this.save.typemeetting.abbr!=1){
          all[2] = true
        }else{
          allm.push('กรุณาเลือกห้อง VC')
        }
        if(this.save.roomsit!==''){
          all[3] = true
        }else{
          allm.push('กรุณาเลือกห้องประชุม')
        }
        if(this.save.participants.length>0){
          all[4] = true
        }else{
          allm.push('กรุณาเลือกผู้เข้าร่วม')
        }
        if(this.save.numpart>0){
          all[6] = true
        }else{
          allm.push('กรุณาใส่จำนวนผู้เข้าร่วม')
        }
        if(this.save.vcjoin!=''||this.save.typemeetting.abbr==4||this.save.roomconf!==''){
          all[7] = true
        }else{
          allm.push('กรุณาใส่หมายเลขห้อง')
        }
        if(all.every(e=>e==true)){
          r.istrue = true
          r.allm = allm
          return r
        }else{
          r.istrue = false
          r.allm = allm
          return r
        }
      },
      to_queryavalible(){
          this.$refs.dialog.save(this.save.date)
          this.queryavalible()
      },
      queryavalible(){
        if(this.save.date.length==0){
          this.isborderred_date = true
        }else if (this.save.duration=='') {
          this.isborderred_date = false
          this.isborderred_duration = true
        }else{
          this.isborderred_date = false
          this.isborderred_duration = false
          var tmp = {}
          tmp.info = 'queryavalible_room'
          tmp.param1 = {}
          tmp.param1.start_date = this.getstartend().start_date
          tmp.param1.end_date = this.getstartend().end_date
          console.log(this.newroom);
          this.isloadroompick = false
          this.$store.dispatch('info/loadinfo', tmp)
          .then((r) => {
            console.log(r.data);
            let am = r.data
            //dosomething delete busy room from pick list
            this.roomconf = JSON.parse(JSON.stringify(this.all_roomconf))
            this.sel_rooms = JSON.parse(JSON.stringify(this.all_sel_rooms))
            console.log(this.sel_rooms);
            for (var i = 0; i < am.length; i++) {
              if(((am[i].duration==this.save.duration)||(am[i].duration=='allday'))||this.save.duration=='allday'){
                this.roomconf = this.roomconf.filter((it)=> {
                    return it !== am[i].roomconf
                })
                this.options_r = []
                this.sel_rooms = this.sel_rooms.filter((it)=> {
                  //console.log(it.value+'vs'+am[i].roomsit);
                    return Number(it.value) !== am[i].roomsit
                })
                //console.log(this.sel_rooms);
              }

            }
            this.isshowroompick = true
            this.isloadroompick = true

            //r= r.data
            //NProgress.done()
          })
        }


      },
      getstartend(){
        let r= {}
        if(this.save.date[1]<this.save.date[0]){
          //swap
          let t = this.save.date[1]
          this.save.date[1] = this.save.date[0]
          this.save.date[0] = t
        }
        if(this.save.date.length>1){
          r.start_date = this.save.date[0]//JSON.stringify(this.form.detail)
          r.end_date = this.save.date[1]
        }else{
          r.start_date = this.save.date[0]//JSON.stringify(this.form.detail)
          r.end_date = this.save.date[0]
        }
        return r
      },
      resetvalue(){
        this.save = {
          typemeetting:{ state: 'ผู้จัด Video Conference', abbr: '1' },
          owner: '',
          topic:'',
          stamp:'',
          date:[],
          roomconf: '',
          roomsit:'',
          duration: '',
          participants:[],
          tmp_part:'',
          checkedvc: true,
          isbreak:false,
          numpart: 0,
        }
        this.isloadlocation= false
        this.isloadrooms= false
        this.isshowpicknumpart=false
        this.isload_room_under_location=false
        this.isshowroompick=false
        this.isborderred_date=false
        this.isborderred_duration=false
        this.isloadroompick=true
      },
      letnewbook(){
        this.editable= false
        this.readonly=false
        this.newbook()
        console.log('letnewbook');
      },
      filldialogbook(){
        this.dialog_detial = []
        let d= {}
        d.s = this.getstartend().start_date.substring(0, 10);
        d.e = this.getstartend().end_date.substring(0, 10);
        if(d.s==d.e){
          d.t = d.s
        }else{
          d.t = d.s +' ~ '+ d.e
        }
        this.dialog_detial.push(this.save.topic)
        this.dialog_detial.push(d.t)
      },
      letedit(){
        console.log('edit');
        this.dialog_title = 'กรุณายืนยัน'
        this.filldialogbook()
        this.dialog_bookingsystem = true
        this.dialog_btncomfirm = 'ยืนยันการแก้ไข'
        this.dialog_type = 'edit'
      },
      letcancel(){
        console.log('cancel');
        this.dialog_title = 'คุณต้องการยกเลิกการจองนี้ใช่หรือไม่!!!!!'
        this.filldialogbook()
        this.dialog_bookingsystem = true
        this.dialog_btncomfirm = 'ยืนยันการยกเลิก'
        this.dialog_type = 'cancel'
      },
      letsurecancel(){
        this.loading_btn = true
        let tmp = {}
        tmp.info = 'cancel_meetting'
        tmp.param1 = this.event.id_booking
        this.$store.dispatch('info/loadinfo', tmp)
          .then((r) => {
            console.log(r.data);
            this.dialog_bookingsystem = false
            this.loading_btn = false
            this.resetvalue()
          })
      },
      letbook(typebook){
        let istrue = this.isallvalidate().istrue
        let allm = this.isallvalidate().allm
        var userdata = JSON.parse(getUserData())
        //console.log(userdata);
        if(istrue){

          let tmp = {}
          tmp.param1 = {}
          tmp.param1.owner = this.save.owner
          tmp.param1.start_date = this.getstartend().start_date
          tmp.param1.end_date = this.getstartend().end_date
          tmp.param1.duration = this.save.duration
          tmp.param1.roomconf = this.save.roomconf
          tmp.param1.roomsit = this.save.roomsit
          tmp.param1.whoCreate = userdata.empcode
          if(typebook=='insert'){
            tmp.info = 'letbook_meetting'

          }else{
            tmp.info = 'update_meetting'
            this.loading_btn = true
            tmp.param1.id_booking = this.event.id_booking
            //console.log(Number.isInteger(this.save.owner))
            if(this.save.owner==this.event.full_name_short){ //ถ้าใช่แสดงว่าไม่ได้แก้ไข
              tmp.param1.owner = this.event.owner //yes
            }else{
               tmp.param1.owner = this.save.owner//ถ้าใช่แสดงว่าแก้ไขให้เอาตัวเลขมาใส่
            }
            if(this.save.roomsit==this.event.roomname){
              tmp.param1.roomsit = this.event.roomsit
            }else{
              tmp.param1.roomsit = this.save.roomsit
            }
            // tmp.param1.owner = this.save.owner
            // tmp.param1.roomsit = this.save.roomsit
            console.log(this.save);
            console.log(this.event);
            // tmp.param1.roomsit = this.all_sel_rooms.find(e=>{
            //   return e.label = this.event.roomsit
            // }).value
            //this.dialog_title.push(this.save.topic)
          }
          let tms = JSON.parse(JSON.stringify(this.save))
          delete tms["date"]
          delete tms["duration"]
          delete tms["roomconf"]
          delete tms["roomsit"]
          delete tms["tmp_part"]
          tmp.param1.detail = JSON.stringify(JSON.stringify(tms))
          console.log(tmp);
          this.$store.dispatch('info/fetchandupdate', tmp)
            .then((r) => {
              console.log(r);
              if(typebook=='insert'){
                if(r.code===20000){
                  this.resetvalue()
                }

              }else{
                this.loading_btn = false
                this.dialog_bookingsystem = false
              }

            })
          //console.log(this.save);

          //console.log('OK');
        }else{
          Message({
            message: allm.join(','),
            type: 'error',
            duration: 3 * 1000
          })
        }
      },
      remoteselowner(query){
        const searchRegExp = /\s/g;
        const replaceWith = '%';
        query = query.replace(searchRegExp, replaceWith);
        if (query !== '') {
          this.loading = true;
          var tmp = {}
          tmp.info = 'loaddepartbyquery'
          tmp.param1 = query
          this.$store.dispatch('info/loadinfo',tmp).then(r=>{
            console.log(r.data);
            this.options_ow = r.data.map(e=>{
              let t = {}
              t.value = e.id_dept
              t.label = e.full_name_short
              return t
            })
            console.log();
            this.loading = false;
          }).catch(e=>{
            console.log(e);
          })

        } else {
          this.options_ow = [];
        }
      },
      remoteselrooms(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options_r = this.sel_rooms.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options_r = [];
        }
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      },
      remoteMethod_p(query) {
        if (query !== '') {
          this.loading_p = true;
          setTimeout(() => {
            this.loading_p = false;
            this.options_p = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      }
    },
    filters: {
      shortthen: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.substring(0, 9) + '....' + value.substring(value.length-3, value.length)
      }
    }
  }
</script>
