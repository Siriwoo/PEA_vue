<template>
  <v-container class="py-2 px-1 mt-0">
    <v-card flat>
      <div class="parentpc px-2 py-2 mb-2">
        <div class="pc1">
          <v-avatar
            :tile="tile"
            size=50
            color="grey lighten-4"
          >
            <img :src="statusLogin.picurl" alt="avatar">
          </v-avatar>
        </div>
        <div class="pc2">
          <div class="">
            {{statusLogin.userid}}
          </div>
          <span class="px-1 name">{{statusLogin.prename}}{{statusLogin.name}} {{statusLogin.lastname}}</span>
        </div>
        <div class="pc3">
          <v-icon @click="f_editprofile()">border_color</v-icon>
        </div>
      </div>
    </v-card>
    <div class="mb-1">

    </div>
    <div class="wcard px-2 py-2" v-for="elem in listtimeline" :key="elem.id">
      <div class="wc1">
        <v-avatar
          :tile="tile"
          size=40
          color="grey lighten-4"
        >
          <img :src="elem.pictureurl" alt="avatar">
        </v-avatar>
      </div>
      <div class="wc2">
        <div class="theader">
          {{elem.name}} {{elem.lastname}}
        </div>
        <div class="">
          {{elem.info}}
        </div>
        <div class="sdate">
          {{elem.date | countdate}}
        </div>
      </div>
    </div>
    <!--<div class="wcard px-2 py-2 center">
      ดูเพิ่มเติม<v-icon>arrow_downward</v-icon>
    </div>-->
    <v-dialog
      v-model="editprofile"
      scrollable fullscreen
      max-width="500px"
      transition="dialog-transition"
      background-color="primary"
    >
    <v-card>
      <v-toolbar dark color="primary" height="40px;">
        <v-btn icon dark @click="editprofile = false">
          <v-icon>close</v-icon>
        </v-btn>
        แก้ไข Profile
      </v-toolbar>
      <div class="px-1">
        <div class="mt-2 px-2 py-1 card22 center">
          <!--<img :src="statusLogin.picurl"/>-->
          <input type="file" id="file" ref="myFiles" @change="previewFiles($event)"/>

        </div>
        <div class="parentpc2 card22 mt-2 ">
          <div class="px-2 py-2 nnc1">
            <div class="">
              รหัสพนักงาน : {{statusLogin.userid}}
            </div>
            <div class="">
              ชื่อ : {{statusLogin.prename}} {{statusLogin.name}} {{statusLogin.lastname}}
            </div>
            <div class="">
              ตำแหน่ง : ...
            </div>
            <div class="">
              สังกัด : {{statusLogin.departShort}}
            </div>
            <div class="">
              เบอร์โทรศัพท์ : {{statusLogin.tell}}
            </div>
          </div>
          <div class="nnc2">
            <v-icon @click="f_editdata()">border_color</v-icon>
          </div>
        </div>
        <div class="parentpc2 card22 mt-1 ">
          <div class="">
            สิทธิ์การเข้าถึง : {{statusLogin.permit}}
          </div>
        </div>
        <v-btn color="primary" block @click="f_updateprofile()"><v-icon>camera_front</v-icon>Update profile</v-btn>
      </div>

    </v-card>

    </v-dialog>
    <v-dialog
      v-model="editdata"
      max-width="500px"
      transition="dialog-transition"
    >
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        กรอกรายละเอียด
      </v-card-title>

      <v-card-text>
        <div class="">
          <v-select
            :items="items_prename"
            v-model="statusLogin.prename"
            label="คำนำหน้าชื่อ"
            box
          ></v-select>
        </div>
        <div class="py-3">
          <v-text-field
            label="ชื่อ"
            v-model="statusLogin.name"
          ></v-text-field>
        </div>
        <div class="py-3">
          <v-text-field
            label="นามสกุล"
            v-model="statusLogin.lastname"
          ></v-text-field>
        </div>
        <div class="py-3">
          <v-text-field
            label="เบอร์โทรศัพท์"
            v-model="statusLogin.tell"
          ></v-text-field>
        </div>


      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          flat
          @click="editdata = false"
        >
          ก็ว่ากันไป
        </v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog"
      width="500"
    >

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          <v-icon>{{AlertIcon}}</v-icon> {{textAlertTitle}}
        </v-card-title>

        <v-card-text>
          {{textalert}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            OK
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
.name{
  color: #1b1e21;
  font-size: 16px;
  font-weight: bold;
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

.parentpc2>*{
  display: inline-block;
}
.nnc1{
  width: 90%;
}
.nnc2{
  width: 9%;
}

.parentpc{

}
.parentpc > * {
  display: table-cell;
}
.pc1{
  vertical-align: middle;
  width: 20%;
}
.pc2{
  vertical-align: middle;
  width: 70%;
}
.pc3{
  width: 7%;
  vertical-align: bottom;
  bottom: 5px;
}
.card22{
  background: #e0dfdf;
  width: 100%;

}
.center{
  text-align: center;
}
.card22 img{
  width: 51%;
}
.wcard>*{
  display: inline-block;
  vertical-align: top;
}
.wcard{
  width: 100%;
  border: 1px solid #dddfe2;
  border-radius: 4px;
  background: white !important;
}
.wc1{
  width: 15%;
}
.wc2{
  width: 78%;
}
.theader{
  font-weight: bold;
  color: #365899
}
.sdate{
  font-size: 12px;
  color: #606770;
}
.center{
  text-align: center;
}
</style>

<script>
// eslint-disable-next-line
/* eslint-disable */
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
export default{
  data () {
    return {
      text: 'fuck',
      tile: false,
      editprofile: false,
      editdata: false,
      dialog: false,
      AlertIcon: '',
      textAlertTitle: '',
      textalert: '',
      imgprofile: '',
      items_prename: ['นาย','นาง','นางสาว'],
      listtimeline: ''
    }
  },
  computed: {
    ...mapGetters(['statusLogin','restserver'])
  },
  mounted() {
    //do something after mounting vue instance
    this.f_getlogtimeline()
  },
  filters:{
    countdate : function (val) {
      var today = new Date();
      var logged = new Date(val);
      var diffMs = (today - logged); // milliseconds between now & Christmas
      var diffDays = Math.floor(diffMs / 86400000); // days
      var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
      var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
      if (diffDays!=0){
        return diffDays + " วัน"
      }else if (diffHrs!=0) {
        return diffHrs + " ชั่วโมง"
      }else {
        return diffMins + " นาที"
      }
      //return diffDays + " days, " + diffHrs + " hours, " +
    }
  },
  methods: {
    ...mapActions(['set_statusLogin']),
    f_getlogtimeline(){
      var data = {}
      data.page = 1
      // console.log(data)
      const params = new URLSearchParams()
      params.append('event_id', JSON.stringify(data))
      axios.post(this.restserver+'api/getlogtimeline.php', params, {
        header: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      }).then(r => {
        //console.log('r: ', JSON.stringify(r, null, 2))
        console.log(r.data)
        this.listtimeline = r.data
      })
    },
    f_updateprofile() {
      var data = {}
      data = this.statusLogin
      // console.log(data)
      const params = new URLSearchParams()
      params.append('event_id', JSON.stringify(data))
      axios.post(this.restserver+'api/updateprofile.php', params, {
        header: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      }).then(r => {
        //console.log('r: ', JSON.stringify(r, null, 2))
        //console.log(r.data[0])
        if (r.data.code === '200') {
          this.AlertIcon = 'warning'
          this.textAlertTitle = 'ตามนั้นจ้า'
          this.textalert = 'update ข้อมูลส่วนตัวเรียบร้อยจ้า'
          this.dialog = true
          this.$router.push({ path: '/timeline' })
        } else {
          this.AlertIcon = 'warning'
          this.textAlertTitle = 'ตามนั้นจ้า'
          this.textalert = 'update ข้อมูลส่วนตัวไม่ได้ติดปัญหา'
          this.dialog = true

        }
      })
    },
    f_editprofile() {
      this.editprofile = true
    },
    f_editdata() {
      this.editdata = true
    },
    previewFiles (event) {
      this.loadata = true
      var CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/botline/upload'
      var CLOUDINARY_UPLOAD_PRESET = 'ozn1c9gz'
      var formData = new FormData()
      var file = event.target.files[0]
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      console.log(file)
      axios({
        url: CLOUDINARY_URL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-urlencoded'
        },
        data: formData
      }).then(res => {
        //console.log(res)

          this.statusLogin.picurl = res.data.secure_url
          this.set_statusLogin(this.statusLogin)


        //this.src_img = res.data.secure_url
        //console.log(this.src_img)
        this.loadata = false
      }).catch(err => {
        console.log(err)
        this.loadata = false
      })
    }
  }
}
</script>
