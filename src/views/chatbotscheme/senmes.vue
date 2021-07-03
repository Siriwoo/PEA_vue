<template>
  <v-container class="py-2 px-1 mt-0">
    <div class="abload" v-if="loadata">
      <v-progress-circular
        indeterminate
        color="white"
      ></v-progress-circular>
    </div>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <v-card text>
              <v-card-text>
                <v-select
                  :items="all_id"
                  item-text="show"
                  item-value="valueid"
                  v-model="sel_send"
                  label="Select"
                  multiple
                  max-height="400"
                  hint="เลือก คน หรือ กลุ่มที่จะส่ง"
                  persistent-hint
                ></v-select>

              </v-card-text>
          </v-card>
      </v-flex>
      <v-flex xs12 md6 mt-1 v-if="singleSel">
        <v-card>
          <v-layout row wrap justify-center align-center>
            <v-flex xs8 px-1 py-1>
              <v-text-field
                v-model="nameProfile"
                filled
                label="เปลี่ยนชื่อ"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-btn fab dark small @click="saveNameProfile()">
                <i class="el-icon-success custom-icon"></i>
              </v-btn>
            </v-flex>
            <v-flex xs2>
              <v-btn fab dark small @click="loadItemGroup()">
                <i class="el-icon-refresh-left custom-icon"></i>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs12 md6 mt-1 v-if="singleSel">
        <v-card >
          <div class="fbig px-1 py-1">คำพูดล่าสุด</div>
          <span class="px-1">{{lastcon}}</span>
          <v-btn icon @click="addqnttext()">
            <i class="el-icon-position custom-icon"></i>
          </v-btn>
        </v-card>
      </v-flex>
      <v-flex xs12 md6 mt-1 v-if="singleSel">
        <v-card px-1 py-1>
          <div class="fbig px-1 py-1">ถามผู้พัฒนา</div>
          <span class="px-1">{{askdev}}</span>
        </v-card>
      </v-flex>
      <v-flex xs12 md6 mt-1>
        <v-card px-1 py-1>
          <v-textarea
          filled
          name="input-7-4"
          label="พิพม์ข้อความที่ต้องการส่ง"
          v-model="castMessagetext"
          :value="castMessagetext"
          rows=3
        ></v-textarea>
        <v-btn block  dark @click="castMessage()">Cast Message</v-btn>
        </v-card>

      </v-flex>
    </v-layout>

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
            text
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
  .fbig{
    font-size: 20px;
  }
  .custom-icon {
     font-size: 1.5rem;
  }
</style>

<script>
// eslint-disable-next-line
/* eslint-disable */
  import axios from 'axios'
  import { mapActions, mapGetters,mapState } from 'vuex'
  export default{
    data () {
      return {
        text: 'fuck',
        dialog: false,
        AlertIcon: '',
        textAlertTitle: '',
        textalert: '',
        sel_send: [],
        all_id: [],
        nameProfile: '',
        singleSel: false,
        profileID: '',
        loadata: false,
        lastcon: '',
        askdev: '',
        castMessagetext: '',
        castMessagetextOld: '',
        selId: ''
      }
    },
    watch: {
      sel_send: function (val) {

        if(val.length===1){
          //console.log(this.all_id[val]);
          this.singleSel = true
          this.selId = val
          if(this.all_id[val]!==null){
            console.log(this.all_id[val])
            this.nameProfile = this.all_id[val].profile
            this.profileID = this.all_id[val].id
            if(this.isJson(this.all_id[val].lastcon)){
              this.lastcon = JSON.parse(this.all_id[val].lastcon).text
            }else{
              this.lastcon = ''
            }

            this.askdev = this.all_id[val].askdev
          }else{
            this.nameProfile = ''
          }
        }else{
          this.singleSel = false
          //console.log(val);
        }
      }
    },
    computed: {
      ...mapGetters(['stat_qna'])
    },
    methods: {
      c_bottombuttom(t){
        this.$store.dispatch('chatbot/c_bottombuttom', t)
      },
      isJson(item) {
          item = typeof item !== "string"
              ? JSON.stringify(item)
              : item;

          try {
              item = JSON.parse(item);
          } catch (e) {
              return false;
          }

          if (typeof item === "object" && item !== null) {
              return true;
          }

          return false;
      },
      addqnttext(){

        this.stat_qna[0].text = this.lastcon
        var data = {}
        data.ClickaddLastToText = true
        this.c_bottombuttom(data)
        console.log(data);
      },
      saveNameProfile() {
        console.log('sss')
        this.loadata = true
        var data = {}
        data.forsure = 'saveNameProfile'
        data.nameProfile = this.nameProfile
        data.profileID = this.profileID
        //console.log(JSON.stringify(data));
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(process.env.VUE_APP_BASE_SERVER_PHP+'/api/saveNameProfile.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          //console.log('r: ', JSON.stringify(r, null, 2))

          console.log(r.data)
          if(r.data.logging === 'save log ok'){
            this.dialog = true
            this.AlertIcon = 'warning'
            this.textAlertTitle = 'OK เลย'
            this.textalert = 'บันทึกข้อมูลสำเร็จ'
            this.loadItemGroup()
          }else{
            this.dialog = true
            this.AlertIcon = 'warning'
            this.textAlertTitle = 'ฮั่นแน่'
            this.textalert = 'มีบางอย่างผิดพลาด!!!!! ไม่สามารถบันทึกได้ err คือ '+r.data.logrecord
          }
          this.loadata = false
        })
      },
      loadItemGroup() {
        this.loadata = true
        // do something after creating vue instance
        axios.get(process.env.VUE_APP_BASE_SERVER_PHP+'/api/api_profile.php')
        .then(response => {
          this.all_id = response.data
          for (var i = 0; i < response.data.length; i++) {
            var cd = response.data[i].code_user
            // console.log(response.data[i].code_user.length)
            this.all_id[i].valueid = i
            if(response.data[i].profile!==null){
              //console.log('s here')
              this.all_id[i].show = response.data[i].profile
            }else{
              //console.log('is here')
              this.all_id[i].show = cd.substring(0, 2) + '..' + cd.substring(30, 33)
            }
            var moreText = ', L:'
            if(this.isJson(this.all_id[i].lastcon)){
              moreText += JSON.parse(this.all_id[i].lastcon).text
            }else{
              moreText += ''
            }
            moreText += ', D:'
            if(this.all_id[i].askdev === null){
              moreText += ''
            }else{
              moreText += this.all_id[i].askdev
            }

            this.all_id[i].show += moreText
            if(this.singleSel){
              if(this.isJson(this.all_id[this.selId].lastcon)){
                this.lastcon = JSON.parse(this.all_id[this.selId].lastcon).text
              }else{
                this.lastcon = ''
              }

              this.askdev = this.all_id[this.selId].askdev
            }

          }
          //console.log(this.all_id)
          this.loadata = false
        })
        .catch(e => {
          console.log(e)
        })
      },
      castMessage(){
        this.loadata = true
        if(this.sel_send.length === 0){
          this.dialog = true
          this.AlertIcon = 'warning'
          this.textAlertTitle = 'ฮ่วย'
          this.textalert = 'เลือกคนส่งก่อน'
          this.loadata = false
        }else if(this.castMessagetext === ''){
          this.dialog = true
          this.AlertIcon = 'warning'
          this.textAlertTitle = 'ฮ่วย'
          this.textalert = 'อย่างว่างดิ'
          this.loadata = false
        }else if(this.castMessagetextOld === this.castMessagetext){
          this.dialog = true
          this.AlertIcon = 'warning'
          this.textAlertTitle = 'ฮ่วย'
          this.textalert = 'อย่ากดซ้ำดิ'
          this.loadata = false
        }else{
          this.castMessagetextOld = this.castMessagetext
          console.log('send')
          var request = require('request')

          for (var i = 0; i < this.sel_send.length; i++) {
            var sender = this.all_id[this.sel_send[i]].code_user
            var tmp = []
            tmp[0] = {}
            tmp[0].type = "text"
            tmp[0].text = this.castMessagetext
            console.log('sss')
            this.loadata = true
            var data = {}
            data.sender = sender
            data.info = tmp
            //console.log(JSON.stringify(data));
            const params = new URLSearchParams()
            params.append('event_id', JSON.stringify(data))
            axios.post(process.env.VUE_APP_BASE_SERVER_LINE+'/castMessage', params, {
              header: {
                'Content-type': 'application/x-www-form-urlencoded'
              }
            }).then(r => {
              //console.log('r: ', JSON.stringify(r, null, 2))
              this.loadata = false
              console.log(r.data)
            });
          }


        }
      }
    },
    mounted() {
      //do something after mounting vue instance
      console.log('senmes.vue')
      this.loadItemGroup()
    },
    created () {

    }
  }
</script>
