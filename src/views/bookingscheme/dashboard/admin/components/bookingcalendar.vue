<template>
  <v-container class="py-0 px-0 mt-0 ">
    <div>
      <div class="d-flex flex-row onlycalendarpage">


      <v-btn
        class="ma-2"
        @click="$refs.calendar.prev()"
      >
        <svg-icon icon-class="left-arrow" class="meta-item__icon" />
      </v-btn>
      <v-select
        v-model="type"
        :items="types"
        dense
        outlined
        hide-details
        class="ma-2"
        label="type"
      ></v-select>
      <!-- <v-select
        v-model="mode"
        :items="modes"
        dense
        outlined
        hide-details
        label="event-overlap-mode"
        class="ma-2"
      ></v-select> -->
      <!-- <v-select
        v-model="weekday"
        :items="weekdays"
        dense
        outlined
        hide-details
        label="weekdays"
        class="ma-2"
      ></v-select> -->
      <v-spacer></v-spacer>
      <v-btn
        class="ma-2"
        @click="$refs.calendar.next()"
      >
        <svg-icon icon-class="right-arrow" class="meta-item__icon" />
      </v-btn>
      </div>
    <v-sheet height="900" class="tochild">
      <fullscreen :fullscreen.sync="fullscreen">
        <div class="onlyfull" v-if="fullscreen">
          ตารางการประชุมประจำเดือน <span>{{nowmonth}}</span>
        </div>
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
        @click:more="viewDay"
        @change="getEvents"
      ></v-calendar>

    </fullscreen>

    </v-sheet>
    <svg-icon icon-class="expand" class="meta-item__icon" @click="toggle"/>
  </div>
  </v-container>

</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
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
.onlyfull{
  padding-left: 30px;
 width:100%;
 font-size: 40px;
 color:white;
 background-color: #6b3074;
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
.bg_card{
  background: #e9eef2;
  border: 1px solid #ddd;
  color: #575a5d;
  border-radius: 3px;
  padding-left: 3px;
  padding-top: 3px;
  min-height: 90px;
}
.smallpic{
  width: 70px;
}
.tochild >*{
  height:100%;
}
</style>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import axios from 'axios'
  import fullscreen from 'vue-fullscreen'
  import Vue from 'vue'
  Vue.use(fullscreen)
  //  console.log(mapState(['g_text']))
  export default{
    data () {
      return {
      nowmonth: 0,
      thmonth: ["มกราคม","กุมภาพันธ์","มีนาคม",
          "เมษายน","พฤษภาคม","มิถุนายน", "กรกฎาคม","สิงหาคม","กันยายน",
          "ตุลาคม","พฤศจิกายน","ธันวาคม"],
      start:0,
      end:0,
      componentKey_dAns: 0,
      loading3: false,
      dialognotsave: false,
      AlertIcon: '',
      textAlertTitle: '',
      textalert: '',
      contextEventx:{
        status: false,
        text: '',
        value: ''
      },
      type: 'month',
      types: ['month', 'week', 'day'/*, '4day'*/],
      mode: 'stack',
      modes: ['stack', 'column'],
      weekday: [1, 2, 3, 4, 5],
      weekdays: [
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
      ],
      value: '',
      events: [],
      fullscreen: false,
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1','red'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      }
    },
    mixins: [],
    computed: {
      ...mapGetters(['stat_qna']),
      ...mapState(['selectedIntentVux'])
    },
    watch: {

    },
    mounted() {
      //do something after mounting vue instance
      this.stat_qna[0].contextId = null
      window.setInterval(() => {
        this.repeatingFunc()
      }, 5000)
    },
    methods: {
      repeatingFunc() {
        console.log('repeat checkfullscreen');
          //console.log("It's been 5 seconds. Execute the function again.");
          if(this.fullscreen){

            this.docalendar(this.start,this.end)
          }
      },
      toggle () {
        this.fullscreen = !this.fullscreen
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      showEvent ({ nativeEvent, event }) {
        //console.log(event);
        this.$emit('showevent', event)

      },
      docalendar(start,end){
        console.log('docalendar');
        var tmp = {}
        tmp.info = 'queryavalible_room'
        tmp.param1 = {}
        this.nowmonth = this.thmonth[start.month-1]
        tmp.param1.start_date = start.date

        tmp.param1.end_date = end.date
        this.isloadroompick = false
        this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          console.log(r.data);
          const events = []
          let allDay = false
          // const min = new Date(start.date).toJSON().slice(0, 19).replace('T', ' ')
          // const max = Date(end.date).toJSON().slice(0, 19).replace('T', ' ')
          const min = new Date(`${start.date}T00:00:00`)
          const max = new Date(`${end.date}T23:59:59`)
          const days = (max.getTime() - min.getTime()) / 86400000
          const eventCount = this.rnd(days, days + 20)

          for (let i = 0; i < r.data.length; i++) {
            //const firstTimestamp = this.rnd(min.getTime(), max.getTime())
            let shour,ehour
            let smin,emin
            if(r.data[i].duration=='morning'){
              shour =9+7
              smin =0
              ehour = 13+7
              emin = 0
              allDay = false
            }else if (r.data[i].duration=='afternoon') {
              shour =13+7
              smin =0
              ehour = 16+7
              emin = 30
              allDay = false
            }else{
              shour =9+7
              smin =0
              ehour = 16+7
              emin = 30
              allDay = true
            }
            const first = new Date(r.data[i].start_date)
            first.setHours(shour, smin)
            //const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
            const second = new Date(r.data[i].end_date)
            second.setHours(ehour, emin)
            //console.log(r.data[i])
            let detail = r.data[i].detail.substring(1, r.data[i].detail.length-1);
            detail = JSON.parse(detail)
            let color = ''
            console.log(detail);

            if(typeof detail.typemeetting !=='undefined'){
              if(detail.typemeetting.abbr==1){
                color = this.colors[0]
              }else if (detail.typemeetting.abbr==2) {
                color = this.colors[3]
              }else if (detail.typemeetting.abbr==3) {
                color = this.colors[4]
              }else if (detail.typemeetting.abbr==4) {
                color = this.colors[5]
              }
            }else{
              if(detail.checkedvc){
                color = this.colors[0]
              }else {
                color = this.colors[1]
              }
            }
            if(typeof detail.realmeeting !=='undefined'){
              if(detail.realmeeting=='fakemeeting'){
                color = this.colors[7]
                //console.log('fakemeeting');
              }else {
                //console.log('realmeeting');
              }
            }

            let ename = ''
            ename = detail.topic

            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
              //document.write("mobile");
            }else{

              if(typeof detail.typemeetting !=='undefined'){
                if(detail.typemeetting.abbr!=="4"){
                  if(detail.typemeetting.abbr==1){
                    if(r.data[i].roomconf.includes("7")){
                      ename = r.data[i].roomconf+','+r.data[i].detail_room+','+detail.topic
                    }
                  }else if (detail.typemeetting.abbr==2||detail.typemeetting.abbr==3) {
                    if (typeof detail.vcjoin !=='undefined') {
                      console.log(typeof detail.vcjoin);
                      if(detail.vcjoin.includes("7")){
                        ename = detail.vcjoin+','+r.data[i].detail_room+','+detail.topic
                      }
                    }
                  }
                }else{
                  console.log('ใช้ห้องปกติ ไม่ต้องใส่ 75');
                }
              }


            }
            if(this.fullscreen){

            }else{

            }
            events.push({
              name: ename,
              start: first.toISOString().replace(/T|Z|\.\d{3}/g, ' ').trim(),
              end: second.toISOString().replace(/T|Z|\.\d{3}/g, ' ').trim(),
              color: color,
              timed: !allDay,
              idevent:r.data[i].id,
              maindata:r.data[i]
            })
          }

          this.events = events
        });
      },
      getEvents ({ start, end }) {
        this.start = start
        this.end = end
        this.docalendar(start,end)
        console.log(end);


      },
      getEventColor (event) {
        return event.color
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
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
