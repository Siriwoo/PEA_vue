<template>
  <div class="app-container-lise">

    <el-row>
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="box-card box-card-nav box-img-banner fixheight">
          <img src="@/assets/qrscheme/bannerbg2.png">
          <div class="det-box1">
            {{user.empcode}}
          </div>
          <div class="det-box2">
            {{user.fullname}}
          </div>
          <div class="det-box3">
            {{user.position}},{{user.depart}}
          </div>
        </div>
        <div class="box-card box-card-nav">
          <el-col :xs="8" :sm="8">
            <v-dialog
              ref="dialog_date"
              v-model="modal_date"
              :return-value.sync="inputscheme.date"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="inputscheme.date"
                  label="วันที่"
                  prepend-icon=""
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="inputscheme.date" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal_date = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.dialog_date.save(inputscheme.date)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </el-col>
          <el-col :xs="8" :sm="8">
            <v-dialog
              ref="dialog_start"
              v-model="modal_start"
              :return-value.sync="inputscheme.time_start"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="inputscheme.time_start"
                  label="จากเวลา"
                  prepend-icon=""
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="modal_start"
                v-model="inputscheme.time_start"
                full-width
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal_start = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.dialog_start.save(inputscheme.time_start)">OK</v-btn>
              </v-time-picker>
            </v-dialog>
          </el-col>
          <el-col :xs="8" :sm="8">
            <v-dialog
              ref="dialog_end"
              v-model="modal_end"
              :return-value.sync="inputscheme.time_end"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="inputscheme.time_end"
                  label="ถึงเวลา"
                  prepend-icon=""
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="modal_end"
                v-model="inputscheme.time_end"
                full-width
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal_end = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.dialog_end.save(inputscheme.time_end)">OK</v-btn>
              </v-time-picker>
            </v-dialog>
          </el-col>

        </div>
        <div class="box-card box-card-nav" v-if="tru_schemedo.name=='ลด'">
          หมายเลขใบสั่ง :
          <el-input placeholder="หมายเลขใบสั่ง"
          v-model="inputscheme.workordercode"
          :disabled="!isadmin()"
          ></el-input>
        </div>
        <div class="box-card box-card-nav" v-if="tru_schemedo.name=='เพิ่ม'">
          หมายเลขใบเบิก :
          <el-input placeholder="หมายเลขใบเบิก" v-model="inputscheme.workordercode"
          :disabled="!isadmin()"></el-input>
        </div>
        <div class="box-card box-card-nav">
          หมายเหตุ :
          <el-input
            type="textarea"
            :rows="2"
            placeholder="กรุณาใส่หมายเหตุสำหรับกิจกรรมนี้"
            :disabled="!isadmin()"
            v-model="inputscheme.worknoted">
          </el-input>
        </div>
      </el-col>
    </el-row>
    <el-row style="text-align:right;padding-right:15px;">
      <el-button type="primary"
      v-if="isadmin()"
      @click="confirmdetail()">ยืนยันข้อมูล</el-button>
    </el-row>


  </div>
</template>

<script>
import { toggleClass } from '@/utils'
import avatar from "@/assets/toppup/avatar.png"
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import { getUserData, setUserclick, getUserclick } from '@/utils/auth'
import {frefucqr} from '@/views/qrcodescheme/mixins/frefucqr'



export default {
  name: 'Theme',
  mixins: [frefucqr],
  components: {

  },
  props:['focuswarehouse','tru_schemedo','moredetail'],
  data() {
    return {
      user: {},
      errorlist: [],
      modal_date: '',
      modal_start: '',
      modal_end: '',
      theme: false,
      avatar_wh: '',
      enav: 6,
      componentKey: 0,
      inputscheme: {
        workordercode: '',
        time_start: '',
        time_end: '',
        date: '',
        worknoted: ''
      }
    }
  },
  watch: {

  },
  methods: {
    confirmdetail(){
      if(this.validinput(this.inputscheme)){
        this.$emit('confirmdetail', this.inputscheme)
      }else{
        this.$message.error(this.errorlist.join(","));
      }
    },
    validinput(){
      this.errorlist =  []
      var i = this.inputscheme
      if(this.tru_schemedo.name=='ลด'){
        var c =10
        if(i.workordercode.length !== c){
          this.errorlist.push(`ใบสั่งต้องมี ${c} ตัว`)
        }
        if(i.workordercode.charAt(0)!=='1'||i.workordercode.charAt(1)!=='0'||i.workordercode.charAt(2)!=='0'){
          this.errorlist.push('ใบสั่งสามตัวแรกต้องขั้นต้นด้วย 100')
        }
      }
      if(this.tru_schemedo.name=='เพิ่ม'){
        var c =10
        if(i.workordercode.length !== c){
          this.errorlist.push(`ใบเบิกต้องมี ${c} ตัว`)
        }
        if(i.workordercode.charAt(0)!=='4'||i.workordercode.charAt(1)!=='9'){
          this.errorlist.push('ใบเบิกสามตัวแรกต้องขั้นต้นด้วย 49')
        }
      }
      if(this.errorlist.length>0){
        return false
      }else {
        return true
      }

    },
    queryfirstvalue(){
      //this.getuserclick()
      //this.querygraph()

      this.querypicture()
      this.queryperson()
      this.querydetail()

    },
    loadnowtime(){
      let current_datetime = new Date()
      let formatted_time = current_datetime.getHours() + ":" + current_datetime.getMinutes()
      let formatted_date = current_datetime.getFullYear()  + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate()
      //console.log(formatted_date)
      this.inputscheme.date = formatted_date
      this.inputscheme.time_start = formatted_time
      this.inputscheme.time_end = formatted_time
    },
    querydetail(){
      console.log(this.moredetail);
      this.inputscheme = this.moredetail
      if(typeof this.inputscheme.date == 'undefined'){
        this.loadnowtime()
      }
    },
    queryperson(){
      this.user = JSON.parse(getUserData())
      console.log(this.user);
    },
    querypicture(){

      this.avatar_wh = avatar
    },

  },
  mounted() {
    //do something after mounting vue instance
    console.log('Hi from mounted');
    if(!this.loadingmainpage){
      //console.log('again');
      //console.log(this.focuswarehouse);
      this.queryfirstvalue()
    }
  }
}
</script>

<style scoped>
.field-label{
  vertical-align: middle;
}
.box-card {
  width: 400px;
  max-width: 100%;
  margin: 20px auto;
}
.det-box1{
  position: absolute;
  top: 8px;
  left: 18px;
  font-size: 14px;
}
.det-box2{
  position: absolute;
  top: 30px;
  left: 18px;
  font-size: 24px;
}
.det-box3{
  position: absolute;
  top: 54px;
  left: 18px;
  font-size: 12px;
}
.block {
  padding: 30px 24px;
}
.box-name2{
  margin-bottom: 5px;
  padding-left: 5px;
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
