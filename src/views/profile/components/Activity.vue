<template>
  <div class="user-activity" v-if="scheme!=='meetingbooking'">
    <div class="calendar">
      <v-sheet
      tile
      height="54"
      color="grey lighten-3"
      class="d-flex"
    >
    <div class="Header_calendar">
      <!--div class="pl-3">
        Timeline ของ :
      </div-->
      <div class="pl-2 boxpd">
        {{activity_search.person_view}} จาก "{{activity_search.depart_view}}"
      </div>
      <div class="">
        {{this.xmonth[nowcalendar.month-1]}}
      </div>
      <div class="wd_fix2">
        <div class="wd_fix1">
          <v-select
            v-model="type"
            :items="types"
            dense
            outlined
            hide-details
            class="ma-2"
            label="เดือน/วัน"
          ></v-select>
        </div>

        <el-button type="success"
        icon="el-icon-caret-left" size="small"
        @click="$refs.calendar_equipt.prev()"></el-button>
        <el-button type="success"
        icon="el-icon-caret-right" size="small"
        @click="$refs.calendar_equipt.next()"></el-button>
      </div>

    </div>

    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar_equipt"
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
    <table class="ex_t">
      <tr>
        <td class="bg_orange">ซ่อม/แก้ไข/ปรับปรุง</td>
        <td class="bg_cyan">บำรุงรักษา</td>
        <td class="bg_indigo">ติดตั้ง</td>
      </tr>
      <tr>
        <td class="bg_pink">ย้าย</td>
        <td class="bg_purple">รื้อถอน</td>
        <td class="bg_deep-purple">ยุบสภาพ</td>
      </tr>
      <tr>
        <td class="bg_teal">Event</td>
        <td class="bg_brown">อบรมการใช้งาน</td>
      </tr>

    </table>
    <div class="" v-if="scheme=='stockecar'">

    </div>
    <div class="post" v-for="elem in timeline" v-else>
      {{scheme}}
      <div class="user-block">
        <img class="img-circle pointer" @click="showuser(elem)" :src="elem.baseUrlprofile">
        <span class="username text-muted pointer" @click="showuser(elem)">{{elem.nameuser}} {{elem.lastname}}{{elem.adminstr}}</span>
        <span class="description pointer" @click="showreport(elem,'ข้อมูล')">{{elem.TypeOffice}}.{{elem.Name1}},{{elem.equip}}, {{elem.typeHistory}}</span>
      </div>
      <p @click="showreport(elem)" class="pointer">
        {{predatetostr(elem[elem.statusjob])}}: ที่ {{elem.TypeOffice}}.{{elem.Name1}}, {{elem.nameproject}}
      </p>
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            Share
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            Like
          </span>
        </li>
      </ul>
    </div>
    <el-dialog
      :visible.sync="dialogVisible">
        <user-card :user="user" :whoshow="whoshow" :refresh="refresh"/>
    </el-dialog>
    <el-dialog
    :visible.sync="dialogreport"
    :key="refreshformreport"
    class="now100"
    fullscreen>
    <formreport
      :typepage="typepage"
      seltype="ข้อมูล"
      :focusequit="focusequit"
      :masterScheme="emptyarray"
      :operationhistory="operationhistory"
      :dateinfo="dateinfo"
      >
    </formreport>
      <formreport
        :typepage="typepage"
        :seltype="seltype"
        :focusequit="focusequit"
        :whoCreate="whoCreate"
        :updatehistory_detial="updatehistory_detial"
        :masterScheme="masterScheme"
        :nameproject="nameproject"
        :operationhistory="operationhistory"
        :dateinfo="dateinfo"
        >
      </formreport>
    </el-dialog>

  </div>
  <div class="user-activity" v-else>
    Activity Of bookingscheme coming soon...
  </div>
</template>

<script>
const avatarPrefix = '?imageView2/1/w/80/h/80'
const carouselPrefix = '?imageView2/2/h/440'
import Storylist from '@/views/qrcodescheme/components/storylist'
import {freqmethods} from '@/mixins/freqmethods'
import { getUserData,getUserActivity,getUserclick } from '@/utils/auth'
import {fetchpic} from '@/mixins/fetchpic'
import UserCard from './UserCard'
import { mapGetters } from 'vuex'
import avatar from '@/assets/toppup/avatar.png'
import formreport from '@/views/components/formreport'
export default {
  mixins: [freqmethods,fetchpic],
  components: { UserCard,formreport,Storylist},
  props: ['activity_search'],
  data() {
    return {
      whoCreate: {},
      updatehistory_detial: {},
      emptyarray: [],
      type: 'month',
      value: '',
      //types: ['month', 'week', 'day', '4day'],
      types: ['month', 'day'],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      mode: 'stack',
      componentKey: 0,
      scheme: {},
      user: {},
      refresh: 0,
      whoshow: 'whoCreate',
      dialogVisible: false,
      avatarPrefix,
      carouselPrefix,
      timeline:[],
      dialogreport: false,
      typepage: 'ดูข้อมูล',
      seltype: 'เพิ่ม',
      focusequit: [],
      refreshformreport: 0,
      refreshformdata: 0,
      masterScheme: [],
      nameproject: '',
      operationhistory: '',
      dateinfo: '',
      focus: '',
      nowcalendar: '',
      events: []
    }
  },
  created() {
    //do something after creating vue instance
    var v = JSON.parse(getUserActivity())
    console.log(v);
    this.scheme = v.scheme
  },
  mounted() {
    //do something after mounting vue instance
    console.log('mounted in Activity.vue');
    console.log(this.activity_search);

  },
  filters:{
    short_depart:function (v) {
      let n = v.split(' ')
      return n[0]+n[1]+'.'
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
      this.showreport(event)
      nativeEvent.stopPropagation()
    },
    getEvents ({ start, end }) {
      if(this.scheme!=='meetingbooking'){
        console.log("++getEvents++");
        this.nowcalendar = start
        console.log(start);
        console.log(end);
        if(start.date!=end.date){
          start = new Date(start.date)
          end = new Date(end.date)
          //start.setDate(start.getDate() + 1);
          //end.setDate(end.getDate() + 1);
          start = start.toJSON().slice(0, 19).replace('T', ' ')
          end = end.toJSON().slice(0, 19).replace('T', ' ')
          console.log(start);
          console.log(end);
          this.loadallhistoy(start,end)
        }
        console.log("++getEvents++");
      }
    },
    predatetostr(v){
      var tomorrow = new Date(v);

      //console.log(new Date(v).toLocaleString("en-US", {timeZone: 'Asia/Bangkok'}));
      return this.datetostr(tomorrow.setDate(tomorrow.getDate() + 1))
    },
    whathisedit(v){
      console.log(v);
      var f = JSON.parse(v.activitydetail.slice(1,-1))
      var l = v.typeactivity
      var h = {
        name:v.typeactivity,
        type:'edit'
      }

      this.moredetal_qrac = f
      this.moredetal_qrac.idupdate = v.id
      this.moredetal_qrac.timestamp = v.timestamp
      console.log(this.moredetal_qrac);
      this.focuswarehouse = f.focuswarehouse
      this.clickMainmenu(h)
      this.componentKey_Mainmenuqr += 1;
      //do something edit
      //this.dialogstorylist = false

    },
    convertliststory_to_calendar(l){

      return l.map(e=>{
        let new_e = e
        //console.log(new_e);
        //let ae = JSON.parse(this.trimq(e.activitydetail))
        //let at = JSON.parse(ae.detailnap)

        new_e.nameuser = e.name
        new_e.name = `${e.TypeOffice}.${e.Name2},${e.nameproject}`
        new_e.color = this.getTypehistoryColor(e.typeHistory)
        var first = ''
        var second = ''
        var secondTimestamp = ''
        if(typeof e.opendate !== 'undefined'){
          //console.log(`${e.opendate}<>${e.finish}`);
          first = new Date(e.opendate)
          first.setDate(first.getDate() + 1);
          second = new Date(e.finish)
          second.setDate(second.getDate() + 1);
        }else{
          //console.log(`${at.date}T${at.time_start}`);
          first = new Date(e.timestamp)
          first.setDate(first.getDate() + 1);
          secondTimestamp = 5 * 900000
          second = new Date(first.getTime() + secondTimestamp)

        }
        new_e.start = this.formatDate(first, false)
        new_e.end = this.formatDate(second, false)

        return new_e
      })

    },
    loadallhistoy(start,end){
      if(this.scheme!=='meetingbooking'){


      //
      console.log('++loadallhistoy++');
      var q = JSON.parse(getUserData())
      console.log(this.activity_search);
      let rd = this.activity_search.realvalue.depart_view
      let pd = this.activity_search.realvalue.person_view
      var sp1 = ''
      if(this.activity_search.person_view=='ทุกคน'){
        for (var i = 0; i < rd.length; i++) {
          sp1 += `a.adminstr like '%${rd[i]}%'`
          if(i<rd.length-1){
            sp1+=' or '
          }
        }

      }else {
        for (var i = 0; i < pd.length; i++) {
          sp1 += `a.infodetail like '%${pd[i]}%'`
          if(i<pd.length-1){
            sp1+=' or '
          }
        }

      }
      console.log(sp1);
      var tmp = {}
      tmp.info = 'historytimeline'
      tmp.param1 = sp1
      tmp.param2 = {
        start:start,
        end:end
      }
      this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          if(r.data.length>0){
            //this.timeline = r.data
            var n = this.convertliststory_to_calendar(r.data)
            console.log(n);
            this.events = n
            var picprofile = r.data.map(function(value) {
              return value.picprofile;
            });
            for (var i = 0; i < this.timeline.length; i++) {
              this.timeline[i].baseUrlprofile = avatar
            }
            console.log('++loadallhistoy++');
          }

        })
      }
    },
    showuser(e) {
        this.user = {
          baseUrlprofile:e.baseUrlprofile,
          position:e.position,
          depart:e.full_name_short,
          tel:e.tel,
          email:e.email,
          name:`${e.prename}${e.name} ${e.lastname}`
        }
        this.user.empcode = e.username
      this.refresh = Math.floor(Math.random() * 10)
      console.log(this.refresh);
      this.dialogVisible = true
      console.log(this.user);

    },
    showreport(d,v){
      console.log("d in showreport");
      console.log(d);
      var x = JSON.parse(d.infodetail.slice(1,-1))
      var y = JSON.parse(d.extradetail.slice(1,-1))
      this.focusequit = this.truntofocusequit(d)
      if(v=='ข้อมูล'){
        this.seltype = 'ข้อมูล'
        this.masterScheme = y.masterScheme
      }else{
        this.seltype = 'เพิ่ม'
        this.masterScheme = x.masterScheme
      }

      this.dateinfo = x.dateinfo
      this.whoCreate.name = d.nameuser
      this.whoCreate.prename = d.prename
      this.whoCreate.lastname = d.lastname
      this.whoCreate.picprofile = d.picprofile
      this.whoCreate.timecreate = d.timecreate_c
      this.operationhistory = x.operationhistory
      this.nameproject = d.nameproject
      this.refreshformreport +=1;
      this.refreshformdata +=1;
      this.dialogreport = true
    },
    truntofocusequit(o){
      var no = {}
      var mrk = Object.keys(JSON.parse(o.e_infodetail.slice(1,-1)))
      var ni = JSON.parse(o.e_infodetail.slice(1,-1))
      //console.log(this.equiptypeall);
      no['ยี่ห้อ'] = o['master_equip']
      no['รุ่น'] = o['edge_equip']

      no['อุปกรณ์'] = o['equip']
      no['สถานที่'] = `${o['TypeOffice']}.${o['Name1']}`
      no['ExcelID'] = o['ExcelID']
      no['adminstr'] = o['adminstr']
      no['equiptypeID'] = o['equiptypeID']
      no['locationID'] = o['locationID']
      no['รหัสทรัพย์สิน'] = o['รหัสทรัพย์สิน']
      no['ลำดับ'] = o['ลำดับ']
      no['masterTypeID'] = o['masterTypeID']
      no['edgeTypeID'] = o['edgeTypeID']
      no['extradetail'] = o['extradetail']
      no.keyelse = mrk
      no.equiptfillter = o['equip']
      for (var i = 0; i < mrk.length; i++) {
        no[mrk[i]] = ni[mrk[i]]
      }
      //console.log(no);
      return no
    }
  },
  computed: {
    ...mapGetters([
      'tokenStr',
      'equiptypeall'
    ])
  }
}
</script>

<style lang="scss">

.Header_calendar{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.pointer{
  cursor: pointer;
}
.ex_t td{
  padding-left:  15px;
  padding-right:  15px;
}
.boxpd{
  font-weight: bold;
  font-size: 14px;
  text-decoration: underline;
}
.ex_t{
  font-size: 13px;
  color:white
}
.bg_orange{
  background-color: #FF9800;
}
.bg_cyan{
  background-color: #00BCD4;
}
.bg_indigo{
  background-color: #3F51B5;

}
.bg_pink{
  background-color: #E91E63;
}
.bg_purple{
  background-color: purple;
  color:white
}
.bg_deep-purple{
  background-color: #673AB7;
}
.bg_teal{
  background-color: teal;
}
.wd_fix2{
  display: flex;
  width: 200px;
}
.wd_fix1{
  width: 150px;
}
.bg_brown{
  background-color: #795548;
}
.now100 .el-dialog.is-fullscreen {
    width: 920px;
}
@media (min-width:780px) {
  .el-dialog{
    width: 46%;
  }
}
@media (max-width:768px) {
  .now100 .el-dialog.is-fullscreen {
      width: 100%;
  }
  .app-container {
    padding: 5px;
  }
  .el-dialog{
    margin-top: 1vh !important;
    width: 96%;
  }
}
.user-activity {
  .user-block {

    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username{
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;

    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {

      &:hover,
      &:focus {
        color: #999;
      }
    }
  }

}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

</style>
