<template>
  <v-container class="py-0 px-0 mt-0 ">
    <v-layout row wrap align-center justify-space-between row >
    <v-flex xs12 lg12 md12>
      <div class="pbar">
        <v-progress-circular v-if="lfirst" :size="25" :width="4"
        indeterminate color="primary"></v-progress-circular>
      </div>
    </v-flex>
    <v-flex xs12 lg8 md8 px-2 py-1 class="card" fill-height>
      เดือน อะไรก้ไม่รู้
      <v-sheet height="500">
        <v-calendar ref="calendar" v-model="start" color="primary"
          :type="type"
          :end="end"
        ></v-calendar>
      </v-sheet>
      <v-btn @click="$refs.calendar.prev()">
        <v-icon dark left > keyboard_arrow_left </v-icon>
      </v-btn>
      <v-select v-model="type" label="Type"
        :items="typeOptions"
      ></v-select>
      <v-btn @click="$refs.calendar.next()">
        <v-icon right dark > keyboard_arrow_right </v-icon>
      </v-btn>
    </v-flex>
    <v-flex xs12 lg4 md4 px-2 py-1 class="card" fill-height>
        <v-form v-model="valid">
        <v-layout row wrap align-center justify-space-between row>
          <v-flex xs12 lg12 md12 py-2>
            วันที่ 11 เดือน 12 น้ำนองในตาฉัน
          </v-flex>
          <v-flex xs4 lg4 md4 class="msi">
          <v-checkbox v-model="allinput.vconfcheck">
            <div slot="label">
              Video Conf.
            </div>
          </v-checkbox>
          </v-flex>
          <v-flex xs8 lg8 md8 class="msi">
            <v-radio-group v-model="allinput.vconfwhere" row>
              <v-radio label="ส่วนกลาง" value="bkk" :disabled="!allinput.vconfcheck"></v-radio>
              <v-radio label="เขต ฉ.3" value="ne3" :disabled="!allinput.vconfcheck"></v-radio>
            </v-radio-group>
          </v-flex>
          <v-flex xs12 lg12 md12 class="msi">
            <v-textarea
              v-model="allinput.topic" :rules="notEmptyRules"
              label="เรื่อง" required counter rows = "2"
            ></v-textarea>
          </v-flex>
          <v-flex xs4 lg4 md4>
            <v-select :items="item_day_meet" v-model="allinput.time.duration" label="ช่วงเวลา"></v-select>
          </v-flex>
          <v-flex xs4 lg4 md4>
            <v-dialog
              ref="dialog" v-model="allinput.time.start.smodal" :return-value.sync="allinput.time.start.stime"
              persistent lazy full-width width="290px"
            >
              <v-text-field
                slot="activator" v-model="allinput.time.start.stime" label="เวลาเริ่ม"
                prepend-icon="access_time" readonly
              ></v-text-field>
              <v-time-picker
                v-if="allinput.time.start.smodal" v-model="allinput.time.start.stime" full-width
                format="24hr"
                :min="allinput.time.start.smin" :max="allinput.time.start.smax"
                :allowed-minutes="allowedStepm"
              >
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="allinput.time.start.smodal = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.dialog.save(allinput.time.start.stime)">OK</v-btn>
              </v-time-picker>
            </v-dialog>
          </v-flex>
            <v-flex xs4 lg4>
              <v-dialog ref="sdialog" v-model="allinput.time.end.emodal" :return-value.sync="allinput.time.end.etime"
                persistent lazy full-width width="290px"
              >
                <v-text-field
                  slot="activator" v-model="allinput.time.end.etime" label="เวลาสิ้นสุด" prepend-icon="access_time" readonly
                ></v-text-field>
                <v-time-picker
                  v-if="allinput.time.end.emodal" v-model="allinput.time.end.etime" full-width format="24hr"
                  :min="allinput.time.end.emin" :max="allinput.time.end.emax"
                  :allowed-minutes="allowedStepm"
                >
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="allinput.time.end.emodal = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.sdialog.save(allinput.time.end.etime)">OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
            <v-flex xs12 lg12 >
              <v-text-field
                v-model="allinput.dept.creator" :rules="notEmptyRules" label="หน่วยงานผู้จัดประชุม" required
              ></v-text-field>
            </v-flex>
            <v-flex xs9 lg9 md9 >
              <v-text-field
                v-model="allinput.dept.owner" :rules="notEmptyRules" label="หน่วยงานเจ้าภาพ" required
              ></v-text-field>
            </v-flex>
            <v-flex xs3 lg3 md9 >
              <v-checkbox label="same" v-model="allinput.dept.checksame"></v-checkbox>
            </v-flex>
            <v-flex xs12 lg12 >
              <v-text-field
                v-model="allinput.dept.participant" :rules="notEmptyRules" label="หน่วยงานผู้เข้าร่วมประชุม" required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md12 lg12>
              <v-text-field
                v-model="allinput.sarabun" label="บันทึกเลขที่" required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md12 lg12>
              <v-select :items="item_day_meet" v-model="allinput.room"
              label="ห้องประชุม" ></v-select>
            </v-flex>

            <v-flex
            >
              <v-text-field
                v-model="allinput.participant_number" :rules="notEmptyRules" label="จำนวนผู้ประชุม" required mask = "###"
              ></v-text-field>
            </v-flex>
            <v-flex xs3 lg3>
              <v-checkbox label="เบรค" v-model="allinput.checkbreak"></v-checkbox>
            </v-flex>
            <v-flex xs12 md12 lg12>
              <v-text-field
                v-model="allinput.booker" :rules="notEmptyRules" label="ผู้จอง" required
              ></v-text-field>
            </v-flex>

            <v-flex xs12 lg12>
              <v-btn
                outline block :loading="loading" :disabled="loading" color="secondary" @click="savemeetting"
              >
                <v-icon right dark>save</v-icon>
              </v-btn>
            </v-flex>

      </v-layout>
      </v-form>
      </v-flex>
    </v-layout>
    <v-dialog
     v-model="mdialog.show"
     width="500"
   >
     <v-card>
       <v-card-title class="headline grey lighten-2" primary-title>
         <v-icon>{{mdialog.AlertIcon}}</v-icon> {{mdialog.textAlertTitle}}
       </v-card-title>

       <v-card-text>
         {{mdialog.textalert}}
       </v-card-text>

       <v-divider></v-divider>

       <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn color="primary" flat @click="mdialog.dialog = false">
           {{mdialog.textdimiss}}
         </v-btn>
         <v-btn
           color="primary" flat @click="mdialog.confirm" v-if="mdialog.dconf"
           :loading="mdialog.loading2"
           :disabled="mdialog.loading2"
         >
           {{mdialog.textconfirm}}
         </v-btn>
       </v-card-actions>
     </v-card>
   </v-dialog>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
a {
  color: #42b983;
}
.smalltext{
  font-size: 11px !important;
  font-weight: normal !important;
  opacity: 0.5;
}
.pbar{
  z-index: 5000;
  position: absolute;
  float: right;
  top:1vh;
  margin-left: 47vw;
  text-align: center;
  display: block;
}
.card{
  width: 100%;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 2px;
  margin: auto;
  padding-left: 5px;
  padding-top: 5px;
}
.msi{
  margin-top: -26px !important;
}
.my-event {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 2px;
    background-color: #1867c0;
    color: #ffffff;
    border: 1px solid #1867c0;
    width: 100%;
    font-size: 12px;
    padding: 3px;
    cursor: pointer;
    margin-bottom: 1px;
  }
</style>

<script>
// eslint-disable-next-line
/* eslint-disable */
import axios from 'axios'
import { mapGetters } from 'vuex'
export default{
  data () {
    return {
      type: 'month',
      start: '2019-01-01',
      end: '2019-01-06',
      typeOptions: [
        { text: 'Day', value: 'day' },
        { text: '4 Day', value: '4day' },
        { text: 'Week', value: 'week' },
        { text: 'Month', value: 'month' }
      ],
      item_day_meet: ['เช้า','บ่าย','ทั้งวัน','ทั้งชาติ'],
      allinput:{
        vconfcheck: false,
        checkbreak: false,
        vconfwhere: null,
        topic: '',
        time: {
          day: '',
          duration: 'ทั้งวัน',
          start:{
            smodal: false,
            stime: '9:00',
            smin: '6:00',
            smax: '11:00'
          },
          end:{
            emodal: false,
            etime: '16:30',
            emin: '12:30',
            emax: '19:00'
          }
        },
        dept:{
          creator: '',
          owner: '',
          participant: [],
          checksame: false,
        },
        sarabun: '',
        room: '',
        participant_number: '',
        booker: ''
      },
      mdialog:{
        show:'',
        textalert: '',
        textAlertTitle: '',
        AlertIcon: '',
        textconfirm: '',
        loading2: false,
        dconf: false,
        textdimiss: 'ตามนั้น',
      },
      lfirst:'',
      valid: false,
      loading: false,
      doconfirm: '',
      notEmptyRules: [
        v => !!v || 'ต้องกรอกช่องนี้',
        v => v.length <= 200 || 'ต้องน้อยกว่า 200 ตัวอักษร ย่อเอาเด้อพี่น้อง'
      ]

    }
  },
  computed:{
    ...mapGetters(['meetting']),
    eventsMap () {
        const map = {}
        this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e))
        return map
      }
  },
  components: {

  },
  created () {
    // do something after creating vue instance
    /*this.meetting.room = 's116'
    axios.get('./api/alltable.php?table=permission_line')
    .then(response => {
      //console.log(response.data)
      this.data = response.data
      this.lfirst = false
    }).catch(e => {

    })*/
  },
  methods: {
    allowedStepm: m => m % 5 === 0,
    confirm: function () {
      if(this.doconfirm === 'update'){
        this.loading2 = true
        var data = {}
        data.forsure = 'checksession'
        data.des = 'umr'
        // console.log(data)
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(this.restserver+'api/checksession.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          //console.log('r: ', JSON.stringify(r, null, 2))
          this.lmenu = false
          console.log(r.data[0])
          if (r.data[0].user === 'exist') {
            console.log('user exist')
            if(r.data[0].access==='OK'){
              //console.log(this.meetting);
              const params = new URLSearchParams()
              //this.meetting
              params.append('event_id', JSON.stringify(this.meetting))
              console.log(JSON.stringify(this.meetting));
              axios({
                method: 'post',
                url: './api/updatemeetting.php',
                data: params
              }).then(r => {
                console.log(r.data)
                if (r.data.activity === "done") {

                  this.AlertIcon = 'check_circle'
                  this.textAlertTitle = 'เยี่ยม'
                  this.textalert = 'อัพเดทเรียบร้อย'
                  this.textdimiss = "ตามนั้น"
                  this.dconf = false
                  this.dialog = true
                } else {


                }
                this.loading2 = false
              })
            }else{
              this.AlertIcon = 'warning'
              this.textAlertTitle = 'ฮั่นแน่'
              this.textalert = 'คุณไม่มีสิทธิ์ ในการแก้ไข ติดต่อ admin ด่วน'
              this.textdimiss = "ตามนั้น"
              this.dconf = false
              this.dialog = true
            }
            // this.dialog = true
          } else {
            this.$router.push({ path: '/' })
            this.AlertIcon = 'warning'
            this.textAlertTitle = 'ฮั่นแน่'
            this.textalert = 'กรุณา Login ก่อนเด้อ'
            this.dialogvueapp = true
          }
          this.drawer = false
        })
      }
    },
    doRoom: function (m) {
      this.meetting.room = m
      //console.log(m);
      console.log(this.meetting)
    },
    savemeetting: function() {
      if(this.valid){
        this.loading = true
        var data = {}
        data.forsure = 'checksession'
        data.des = 'emr'
        // console.log(data)
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(this.restserver+'api/checksession.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          //console.log('r: ', JSON.stringify(r, null, 2))
          console.log(r.data[0])
          if (r.data[0].user === 'exist') {
            console.log('user exist')
            if(r.data[0].access==='OK'){
              //console.log(this.meetting);
              const params = new URLSearchParams()
              params.append('event_id', JSON.stringify(this.allinput))
              //console.log(JSON.stringify(this.meetting));
              axios({
                method: 'post',
                url: './api/savemeetting.php',
                data: params
              }).then(r => {
                console.log(r.data)
                if (r.data.activity === "exist") {

                  this.AlertIcon = 'help_outline'
                  this.textAlertTitle = 'คำถาม'
                  this.textalert = 'วันเวลานี้มีการประชุมอื่นอยู่แล้ว ต้องการแก้ไขหรือไม่'
                  this.dconf = true
                  this.doconfirm = "update"
                  this.textconfirm = "แก้ไข"
                  this.textdimiss = "ไม่เป็นไร"
                  this.dialog = true
                } else {
                  this.AlertIcon = 'check_circle'
                  this.textAlertTitle = 'เยี่ยม'
                  this.textalert = 'บันทึกเรียบร้อย'
                  this.textdimiss = "ตามนั้น"
                  this.dconf = false
                  this.dialog = true

                }
                this.loading = false
              })
            }else{
              this.loading = false
              this.AlertIcon = 'warning'
              this.textAlertTitle = 'ฮั่นแน่'
              this.textalert = 'คุณไม่มีสิทธิ์ ในการแก้ไข ติดต่อ admin ด่วน'
              this.textdimiss = "ตามนั้น"
              this.dconf = false
              this.dialog = true
            }
            // this.dialog = true
          } else {
            console.log('user not exist');
          }
        })

        console.log(this.meetting)
      }else{
        this.AlertIcon = 'warning'
        this.textAlertTitle = 'ฮั่นแน่'
        this.textalert = 'อย่าด่วนๆ กรอกข้อมูลให้ครบก่อน'
        this.textdimiss = "ตามนั้น"
        this.dconf = false
        this.dialog = true
      }

    }
  }
}
</script>
