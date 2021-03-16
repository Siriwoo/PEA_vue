<template>
  <v-container class="py-0 px-0 mt-0">
    <v-card text>
      <v-card-title
          class="headline grey lighten-2 py-3 px-3"
          primary-title
        >
        <div class="">
          <div class="big_text">
            สร้างคำตอบ
          </div>
          <div class="small_text">
            คลิกปุ่ม add เพื่อเพิ่มคำตอบ
          </div>
        </div>
        <div class="box_add">

          <v-menu offset-y data-app>
            <template v-slot:activator="{ on }">
            <v-btn color="secondary" dark fab small v-on="on">
              <i class="el-icon-document-add"></i>
            </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in items"
                :key="index"
                @click="add_ans(index)"
              >
                <v-list-item-title>
                  <i v-bind:class="item.icon"></i>
                  {{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

        </div>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap v-for="(item, index) in box_ans" :key="index">
            <v-textarea v-if="box_ans[index].type_add=='text'"
            filled
            name="input-7-4"
            :placeholder="box_ans[index].content"
            v-model="box_ans[index].content"
            rows=2
            class="mb-0"
            v-bind:label="box_ans[index].label"
            ></v-textarea>
            <v-textarea v-if="box_ans[index].type_add=='WebhookAPI'"
            filled
            name="input-7-4"
            :placeholder="box_ans[index].content"
            v-model="box_ans[index].content"
            rows=2
            class="mb-0"
            v-bind:label="box_ans[index].label"
            ></v-textarea>
            <div class="bg_card" v-if="box_ans[index].type_add=='sticker'">
              <div class="head_label">{{box_ans[index].label}}</div>
              <div class="card_content" @click="show_sticker_d(index)">กดเพื่อเลือก Sticker</br>
                <img :src="box_ans[index].content.p_sticker">
              </div>

              <v-dialog
                v-model="sticker_d" max-width="290"
              >
              <v-card>
                <v-progress-circular v-if="loadingstk" indeterminate color="primary"></v-progress-circular>
                <span v-for="(elem,i) in stk_list" :key="i">
                  <img :src="defaultpath+'/build_npm/' + elem" @click="getstk(elem,clickindex)"/>
                </span>

              </v-card>

              </v-dialog>
            </div>

            <div class="bg_card" v-if="box_ans[index].type_add=='click'">
              <div class="head_label">{{box_ans[index].label}}</div>
              <div class="card_content">{{box_ans[index].content}}</div>
            </div>
            <div class="bg_card" v-if="box_ans[index].type_add=='location'">
              <div class="head_label">{{box_ans[index].label}}</div>
              <div class="card_content">
                <v-btn color="primary" text v-on:click="geolocation">text</v-btn>
                <v-text-field name="title" label="หัวข้อ" ></v-text-field>
                <v-text-field name="detail" label="คำอธิบาย/ที่อยู่" ></v-text-field>
                <v-text-field name="lat" label="ละติจูด"  ></v-text-field>
                <v-text-field name="long" label="ลองติจูด"></v-text-field>

              </div>
            </div>
            <div class="bg_card" v-if="box_ans[index].type_add=='image'">
              <div class="head_label">{{box_ans[index].label}}</div>
              <editorImage color="#1890ff"
              :key="refresheditimg"
              class="editor-upload-btn"
              @listendata="datafromeimg"
              :imagedetail="isview(box_ans[index].content.midiapic)"
              :infoelem="index"/>
              <!--div class="card_content card_img">คลิกเพื่อเพิ่มรูป</br>
                  <img :src="src_img"/>
                  <input type="file" id="file" ref="myFiles" class="custom-file-input" @change="previewFiles($event,index)"></input>
              </div-->
            </div>
            <!--div class="" v-else>
              no type add ผิดพลาด
            </div-->
          <div class="close_b" @click="box_ans[index].dialog = true">
            <i class="el-icon-close"></i>

          </div>

        <v-dialog v-model="box_ans[index].dialog" persistent max-width="290">
            <v-card>
              <v-card-title class="headline">ต้องการลบกล่องนี้หรือไม่?</v-card-title>
              <v-card-text>ถ้าลบแล้ว ข้อมูลที่คุณกรอกไว้ในกล่อง <span class="box_cm">'{{box_ans[index].label}}'</span> จะหายหมดในพริบตา เอาคืนมาไม่ได้!!</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click.native="box_ans[index].dialog = false">ไม่ลบ,เปลี่ยนใจ</v-btn>
                <v-btn color="green darken-1" text @click.native="close_and(index)">ลบสิ</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          </v-layout>

        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          v-if="isedit"
            color="primary"
            text
            :loading="loading3"
            :disabled="loading3"
            @click="cdans"
          >
            ยกเลิก
          </v-btn>
          <v-btn
            color="primary"
            text
            :loading="loading3"
            :disabled="loading3"
            @click="do_text_q"
          >
            APPLY
          </v-btn>
        </v-card-actions>
    </v-card>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.small_text{
  font-size: 11px;
  width: 224px;
}
.close_b{
  position: absolute;
  right: 14px;
}
.head_label{
  color: #000;
}
.box_cm{
  color: red;
}
.bg_card{
  background: #e9eef2;
  border: 1px solid #ddd;
  color: #575a5d;
  border-radius: 3px;
  padding-left: 3px;
  padding-top: 3px;
  min-height: 40px;
  width: 100%;
  margin-bottom: 5px;
}
.bg_card img{
  width: 120px !important;
}
</style>

<script>
import editorImage from '@/views/components/Editimage'
import { mapActions, mapGetters } from 'vuex'
import store from '@/store'
import {fetchpic} from '@/mixins/fetchpic'
import {frefuccb} from './mixins/frefuccb'
import axios from 'axios'
  // import store from '../vuex/store.js'
  export default{
    components: {
      editorImage
    },
    props: ['isedit','isinedit'],
    mixins: [fetchpic,frefuccb],
    data () {
      return {
        loading3: false,
        loadingstk: false,
        refresheditimg: 0,
        dialog: false,
        //src_img: 'https://res.cloudinary.com/botline/image/upload/v1527685132/jpaa1us8nliiuvwpc7of.png',
        text: '',
        stk_list: [],
        clickindex: 0,
        currentLocation: {lat: 0, lng: 0},
        defaultpath: process.env.VUE_APP_BASE_SERVER_PHP,
        box_ans: [
          /* {
            content: 'xx',
            type: 'yy',
            label: 'zz'
          } */
        ],
        p_sticker: '',
        sticker_d: false,
        items: [
          {
            title: 'ข้อความ',
            icon: 'el-icon-chat-line-square',
            t_line: 'Text',
            type_add: 'text'
          },
          {
            title: 'รูปภาพ',
            icon: 'el-icon-picture',
            t_line: 'Image',
            type_add: 'image'
          },
          {
            title: 'สติ๊กเกอร์',
            icon: 'el-icon-postcard',
            t_line: 'Sticker',
            type_add: 'sticker'
          },
          {
            title: 'WebhookAPI',
            icon: 'el-icon-share',
            t_line: 'WebhookAPI',
            type_add: 'WebhookAPI'
          }
          /* ,
          {
            title: 'โลเคชั่น',
            icon: 'location_on',
            t_line: 'Location',
            type_add: 'location'
          } ,
          {
            title: 'Link',
            icon: 'link',
            t_line: 'Link_Text',
            type_add: 'text'
          },
          {
            title: 'วิดีโอ',
            icon: 'videocam',
            t_line: 'Video',
            type_add: 'click'
          },
          {
            title: 'เสียง',
            icon: 'volume_down',
            t_line: 'Audio',
            type_add: 'click'
          } */
        ]
      }
    },
    methods: {
      cdans(){
        this.$store.dispatch('chatbot/c_DailogEditAns', false)
      },
      c_DailogEANS: function (d) {
        this.$store.dispatch('chatbot/c_DailogEANS', d)
      },
      isview(x){
        if(typeof x !== 'undefined'){
          var e = {
            list:[{picturetoken:x}],
            actscheme:'edit',
            masterscheme: 'chatbot'
          }
        }else{
          var e = {
            actscheme:'edit',
            masterscheme: 'chatbot'
          }
        }

        console.log(e);
        return e
      },
      do_text_q: function () {
        // console.log('local click')
        this.stat_qna[1].text = this.box_ans
        console.log(this.box_ans)
        console.log('isedit in do_text_q>>');
        console.log(this.isedit);

        if(this.isinedit){
          console.log("แก้ไขคำตอบเดิม...");
          this.box_ans = this.trimdata_before_save(this.box_ans)
          if(this.isedit){
            this.EditAns()
          }else{
            this.addAns()
          }

          this.$store.dispatch('chatbot/c_DailogEditAns', false)
          this.$store.dispatch('chatbot/c_DailogEdit', false)
        }else{
          console.log("สร้างคำตอบใหม่...");
          this.$store.dispatch('chatbot/d_toggle', 1)
        }
        //this.$store.dispatch('chatbot/d_toggle', 1)
      },
      addAns: function () {
        // console.log('local click')
        // this.edit_setting[this.edit_setting.idnow].dialog = this.box_ans
        // console.log(this.edit_setting)
        var data = {}
        data.dialog = this.box_ans
        data.intentId = this.edit_setting.intent_id
        console.log(data)
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(this.defaultpath+'/api/api_updateAddAnswer.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          console.log(r)
          this.c_DailogEANS(false)
          // this.show_d_edit(this.selectedIntent)
        })
      },
      EditAns: function () {
        this.edit_setting[this.edit_setting.idnow].dialog = this.box_ans
        // console.log(this.edit_setting)
        var data = {}
        data = this.edit_setting
        console.log(data)
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(this.defaultpath+'/api/api_updateEditAnswer.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          console.log(r)
          this.c_DailogEANS(false)
          // this.show_d_edit(this.selectedIntent)
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
        console.log(rcc3);
        this.loading3 = true
        store.dispatch('globalvar/getauthtoken')
          .then((token) => {
            var authtoken = token.access_token
            this.fetchpic(rcc3[0].picturetoken,authtoken).then(r=>{
              this.box_ans[t].content.picurl = r.baseUrl

              this.loading3 = false
            })
          })

        this.box_ans[t].content = {}
        this.box_ans[t].content.midiapic = rcc3[0].picturetoken

      },
      getstk: function (elem, index) {
        // console.log(index)
        this.p_sticker = this.defaultpath+'/build_npm/' + elem
        console.log(this.p_sticker)
        var res = elem.split('_')
        // console.log(res);
        this.box_ans[index].content = {}
        this.box_ans[index].content.pkgid = res[1]
        this.box_ans[index].content.stkid = res[2].replace('.jpg', '')
        this.box_ans[index].content.p_sticker = this.p_sticker
        // console.log(this.box_ans[index])
        this.sticker_d = false
      },
      geolocation: function () {
        navigator.geolocation.getCurrentPosition((position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          console.log(this.currentLocation)
        })
      },
      show_sticker_d(i){
        this.getstklist()
        this.sticker_d = true
        this.clickindex = i
      },
      setstklist(data){
        this.$store.dispatch('chatbot/set_stklist', data)
      },
      getstklist: function () {
        this.loadingstk = true
        if(this.x_stk_list.length==0){
          axios.get(process.env.VUE_APP_BASE_SERVER_PHP+'/api/glob_img.php')
          .then(response => {
            // console.log(response.data)
            this.stk_list = response.data
            this.setstklist(this.stk_list)
            this.loadingstk = false
          })
        }else{
          this.stk_list = this.x_stk_list
          this.loadingstk = false
        }

      },
      add_ans: function (payload) {
        // console.log(payload)
        var tmpObj = {}
        tmpObj.content = ''
        tmpObj.type = this.items[payload].t_line
        tmpObj.label = this.items[payload].title
        tmpObj.type_add = this.items[payload].type_add
        // console.log(this.items[payload])
        if (this.items[payload].type_add === 'click') {
          tmpObj.content = '{{กดเพื่อเพิ่ม ' + this.items[payload].title + ' }}'
        } else if (this.items[payload].type_add === 'sticker') {
          this.getstklist()
        }
        tmpObj.dialog = false
        this.box_ans.push(tmpObj)
        // console.log(this.currentLocation)
        console.log(this.box_ans)
      },
      close_and: function (payload) {
        // console.log(payload)
        this.box_ans[payload].dialog = false
        this.box_ans.splice(payload, 1)
      },
      previewFiles (event, index) {
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
          console.log(res)
          this.src_img = res.data.secure_url
          this.box_ans[index].content = {}
          this.box_ans[index].content.picurl = this.src_img
        }).catch(err => {
          console.log(err)
        })
      }
    },
    created() {
      //do something after creating vue instance
      console.log('dAns>>'+this.isedit);
      if(this.isedit){
        console.log(this.edit_setting)
        this.box_ans = this.edit_setting.dialog
        console.log(this.box_ans);
      }else{
        this.box_ans = []
      }

    },
    computed: {
      ...mapGetters(['stat_qna','edit_setting','x_stk_list'])
    }
  }
</script>
