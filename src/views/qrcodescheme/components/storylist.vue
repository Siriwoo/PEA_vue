<template>
  <div class="app-container-lise">
    <div class="calendar">
      <v-sheet
      tile
      height="54"
      color="grey lighten-3"
      class="d-flex"
    >
    <div class="n_w">
      {{this.xmonth[nowcalendar.month-1]}}
    </div>
      <v-select
        v-model="type"
        :items="types"
        dense
        outlined
        hide-details
        class="ma-2"
        label="เดือน/วัน"
      ></v-select>
      <el-button type="success"
      icon="el-icon-caret-left" size="small"
      @click="$refs.calendar.prev()"></el-button>
      <el-button type="success"
      icon="el-icon-caret-right" size="small"
      @click="$refs.calendar.next()"></el-button>
    </v-sheet>
    <v-sheet height="500">
      <v-calendar
        ref="calendar"
        v-model="value"
        :weekdays="weekday"
        :type="type"
        :events="events"
        :event-overlap-mode="mode"
        :event-overlap-threshold="30"
        :event-color="getEventColor"
        @click:event="showEvent"
        @click:date="viewDay"
        @change="getEvents"
      ></v-calendar>
      <!--
      @click:more="viewDay"-->
    </v-sheet>
    </div>
    <div class="">
      <table>
        <tr>
          <td><div class="sc1">เพิ่มอุปกรณ์จากใบเบิกเข้าคลัง</div></td>
          <td><div class="sc3">ตรวจสอบอุปกรณ์คงเหลือ</div></td>
        </tr>
        <tr>
          <td><div class="sc2">การเบิกของขึ้นรถ</div></td>
          <td><div class="sc4">ตรวจสอบเครื่องมือ</div></td>
        </tr>
        <tr>
          <td><div class="sc5">ตรวจสอบยานพาหนะ</div></td>
        </tr>
      </table>
    </div>
    <!--el-card class="box-card" v-for="e in liststory" >
      <div class="banlist" >
        <div class="c1 c1mo">
          <div class="img">
            <img :src="e.baseUrlprofile" class="img-circle" @click="showuser(e)">
          </div>
          <!--div class="eximg">
            {{shortname(e.typeactivity)}}
          </div>
        </div>
        <div class="c2" @click="showedithistory(e)">
          <div class="line1">
            <img :src="icon_movehis" class="avatartoolsty" v-if="e.typeactivity=='ย้าย'">
            <img :src="icon_addhis" class="avatartoolsty" v-if="e.typeactivity=='เพิ่ม'">
            <img :src="icon_decresehis" class="avatartoolsty" v-if="e.typeactivity=='ลด'">
            <img :src="icon_carcheck" class="avatartoolsty" v-if="e.typeactivity=='เชคยานพาหนะ'">
            <img :src="icon_equiptcheck" class="avatartoolsty" v-if="e.typeactivity=='เชคเครื่องมือ'">
             {{getoriwarehouse(e.activitydetail)}}
            <span v-if="e.typeactivity=='ย้าย'">  >> {{getdestwarehouse(e.activitydetail)}}</span>
          </div>
          <div class="line2">
            <div class="" v-for="ex in getarrayjob(e.statusjob)">
              {{ex}}
            </div>
          </div>
          <div class="line3">
            {{datetostr(e.timestamp)}} ({{getshift(e.activitydetail)}})

          </div>
        </div>

      </div>
      <img :src="icon_history" class="avatartoolsty_small" @click="showallhistory(e)">

    </el-card-->
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
    append-to-body
      :visible.sync="dialogVisible">
        <user-card :user="user" :whoshow="whoshow" :refresh="refresh"/>
    </el-dialog>
  </div>
</template>

<script>
import { toggleClass } from '@/utils'
import picon_addhis from "@/assets/qrscheme/addhis.png"
import picon_decresehis from "@/assets/qrscheme/decresehis.png"
import picon_movehis from "@/assets/qrscheme/movehis.png"
import picon_history from "@/assets/qrscheme/history.png"
import picon_carcheck from "@/assets/qrscheme/car-check.png"
import picon_equiptcheck from "@/assets/qrscheme/checklist.png"
import { getUserData, setUserclick, getUserclick } from '@/utils/auth'
import { freqmethods } from '@/mixins/freqmethods'
import { fetchpic } from '@/mixins/fetchpic'
import UserCard from '@/views/profile/components/UserCard'

import Historydo from '@/views/qrcodescheme/components/historydo'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css

export default {
  name: 'Theme',
  mixins: [freqmethods,fetchpic],
  components: {
    Historydo,
    UserCard
  },
  props: [],
  data() {
    return {
      alldo: [],
      user: {},
      refresh: 0,
      whoshow: 'whoCreate',
      componentKey: 0,
      nameTitle_dialog_Historydo: '',
      dialog_Historydo: false,
      theme: false,
      slideValue: 50,
      radio: 3,
      liststory: [],
      icon_addhis: '',
      icon_decresehis: '',
      icon_movehis: '',
      dialogVisible: false,
      typeoffice:'',
      /*-----------------*/
      type: 'month',
      types: ['month', 'week', 'day', '4day'],
      //types: ['month', 'day'],
      mode: 'stack',
      modes: ['stack', 'column'],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      weekdays: [
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
      ],
      value: '',
      nowcalendar: '',
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    }
  },
  watch: {
    theme() {
      toggleClass(document.body, 'custom-theme')
    }
  },
  methods: {
    viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
    },
    showEvent ({ nativeEvent, event }) {
      //console.log(nativeEvent);
      console.log(event);
      this.showedithistory(event)
      nativeEvent.stopPropagation()
    },
    getEvents ({ start, end }) {
      this.nowcalendar = start
      console.log(start);
      console.log(end);
      if(start.date!=end.date){
        start = new Date(start.date).toJSON().slice(0, 19).replace('T', ' ')
        end = new Date(end.date).toJSON().slice(0, 19).replace('T', ' ')
        console.log(start);
        console.log(end);
        this.loadallhistoy(start,end)
      }

        /*const events = []

        const min = new Date(`${start.date}T00:00:00`)
        const max = new Date(`${end.date}T23:59:59`)
        const days = (max.getTime() - min.getTime()) / 86400000
        const eventCount = this.rnd(days, days + 20)

        for (let i = 0; i < eventCount; i++) {
          const allDay = this.rnd(0, 3) === 0
          const firstTimestamp = this.rnd(min.getTime(), max.getTime())
          const first = new Date(firstTimestamp - (firstTimestamp % 900000))
          const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
          const second = new Date(first.getTime() + secondTimestamp)

          events.push({
            name: this.names[this.rnd(0, this.names.length - 1)],
            start: this.formatDate(first, !allDay),
            end: this.formatDate(second, !allDay),
            color: this.colors[this.rnd(0, this.colors.length - 1)],
          })
        }*/

        //this.events = events
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    /*----------------------------*/
    shortname(n){
      var o = n
      if(n=='เชคยานพาหนะ'){
        o='เชคยานฯ'
      }
      return o
    },
    showallhistory(e){
      var a = JSON.parse(e.historydo.slice(1,-1))
      console.log(a);
      this.alldo = a
      this.componentKey += 1;
      this.dialog_Historydo = true
      this.nameTitle_dialog_Historydo= 'ประวัติการดำเนินการ'
    },
    //.slice(1,-1) remove first and last character
    queryfirstvalue(){

      //this.loadallhistoy(start,end)
      this.queryimg()
    },
    queryimg(){
      this.icon_addhis = picon_addhis
      this.icon_decresehis = picon_decresehis
      this.icon_movehis = picon_movehis
      this.icon_history = picon_history
      this.icon_carcheck = picon_carcheck
      this.icon_equiptcheck = picon_equiptcheck
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
    getoriwarehouse(t){
      return JSON.parse(t.slice(1,-1)).focuswarehouse.name1
    },
    showuser(e) {
        this.user = {
          baseUrlprofile:e.baseUrlprofile,
          position:e.position,
          depart:e.full_name_short,
          tel:e.tel,
          email:e.email,
          name:`${e.prename}${e.nameuser} ${e.lastname}`,
          empcode:e.username
        }
      this.refresh = Math.floor(Math.random() * 10)
      this.dialogVisible = true
      console.log(this.user);

    },
    getdestwarehouse(t){
      return JSON.parse(t.slice(1,-1)).destwarehouse.name1
    },
    getarrayjob(t){
      return JSON.parse(t.slice(1,-1))
    },
    showedithistory(e){
      this.$emit('whathisedit', e)
    },
    loadallhistoy(start,end){
      console.log('++function loadallhistoy++');
      var tmp = {}
      tmp.info = 'loadstory_qr'
      tmp.param1 = this.cropdepart(JSON.parse(getUserclick()).viewscheme.office,'for_query')
      tmp.param2 = {
        start:start,
        end:end
      }
      console.log(tmp);
      const loading_story = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          //console.log(r);
          this.liststory = r.data
          //this.fetchpictimeline(r.data)

          var n = this.convertliststory_to_calendar(this.liststory)
          if(this.typeoffice == 'กฟส'){//เอาของ กฟย. ออก
            let nn = []
            for (var i = 0; i < n.length; i++) {
              if(!n[i].adminstr.includes('กฟย')){
                nn.push(n[i])
              }
            }
            n=nn
          }
          console.log(n);
          this.events = n
          //r= r.data
          //console.log(r);
          //NProgress.done()
          loading_story.close();
          console.log('++function loadallhistoy++');
        })

    },
    convertliststory_to_calendar(l){

      return l.map(e=>{
        let new_e = e
        //console.log(this.trimq(e.activitydetail));

        //let ae = JSON.parse(this.trimq(e.activitydetail))
        let fe = JSON.parse(this.trimq(e.focuswarehouse))
        //console.log(e.timestamp);
        //console.log(ae.typeHistory);
        let at = {
          date: undefined
        }
        /*if(this.isJson(ae.detailnap)){
          at = JSON.parse(ae.detailnap)
        }*/


        new_e.nameuser = e.name
        new_e.name = `${fe.name1}`
        if(e.typeactivity=='ย้าย'){
          new_e.color = '#ff5252'
        }else if (e.typeactivity=='เพิ่ม') {
          new_e.color = '#e040fb'
        }else if (e.typeactivity=='ลด') {
          new_e.color = '#536dfe'
        }else if (e.typeactivity=='เชคเครื่องมือ') {
          new_e.color = '#40c4ff'
        }else if (e.typeactivity=='เชคยานพาหนะ') {
          new_e.color = '#00bfa5'
        }
        var first = ''
        var second = ''
        var secondTimestamp = ''
        if(typeof at.date !== 'undefined'){
          at.date = this.valifydate(at.date)
          at.time_start = this.valifytime(at.time_start)
          at.time_end = this.valifytime(at.time_end)
          console.log(`${at.date}T${at.time_start}`);
          first = new Date(`${at.date}T${at.time_start}`)
          second = new Date(`${at.date}T${at.time_end}`)
        }else{
          //console.log(`${at.date}T${at.time_start}`);
          first = new Date(e.timestamp)
          secondTimestamp = 5 * 900000
          second = new Date(first.getTime() + secondTimestamp)

        }
        new_e.start = this.formatDate(first, true)
        new_e.end = this.formatDate(second, true)

        return new_e
      })

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

<style lang="scss">
.sc1{//เพิ่มอุปกรณ์จากใบเบิกเข้าคลัง
  background-color:#e040fb;
  color: white;
}
.sc2{//การเบิกของขึ้นรถ
  background-color:#ff5252;
  color: white;
}
.sc3{//ตรวจสอบอุปกรณ์คงเหลือ
  background-color:#536dfe;
  color: white;
}
.sc4{//ตรวจสอบเครื่องมือ
  background-color:#40c4ff;
  color: white;
}
.sc5{//ตรวจสอบยานพาหนะ
  background-color:#00bfa5;
  color: white;
}
.banlist{
  position: relative;
  display: flex;
  align-items: center;
}
.field-label{
  vertical-align: middle;
}
.n_w{
  width:50%;
  font-size: 20px;
  padding-left: 20px;
  padding-top: 15px;
}
.banlist>*{
  display: inline-block;
}
.img-circle {
  border-radius: 50%;
  width: 55px;
  height: 55px;
  float: left;
}
.line1{
  display: flex;
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
.app-container-lise{
  .el-card__body{
    padding: 9px !important;
  }

}
.type1 {
    width: 65px;
    height: 65px;
    background: #eaeaea;
    border: 1px solid #809dc1;
}
.eximg{
  margin-top: -10px;
}
.c1mo{
  width: 15% !important;
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
  width: 25px;
}
.topic{
  padding-bottom: 0px;
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
