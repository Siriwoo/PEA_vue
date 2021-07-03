<template>
  <v-container class="py-0 px-0 mt-0">
    <v-card text>
      <v-card-title
          class="headline grey lighten-2 py-3 px-3"
          primary-title
        >
        <div class="">
          <div class="big_text">
            <span v-if="flag_addAnswer">เพิ่มเสร็จแล้วกด save</span>
            <span v-else>แก้ไขแล้วกด save</span>
          </div>
          <div class="small_text">
            คลิกปุ่ม add เพื่อเพิ่มคำตอบ
          </div>
        </div>
        <div class="box_add">

          <v-menu offset-y>
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
            <v-textarea v-if="box_ans[index].type=='Text'||box_ans[index].type=='text'||box_ans[index].type=='WebhookAPI'"
            filled
            name="input-7-4"
            :placeholder="box_ans[index].content"
            v-model="box_ans[index].content"
            rows=2
            class="mb-0"
            v-bind:label="box_ans[index].label"
            ></v-textarea>
            <div class="bg_card" v-if="box_ans[index].type=='sticker'||box_ans[index].type=='Sticker'">
              <div class="head_label">{{box_ans[index].label}}</div>
              <div class="card_content" @click="sticker_d=!sticker_d">กดเพื่อเลือก Sticker</br>
                <img :src="p_sticker">
              </div>

              <v-dialog
                v-model="sticker_d" max-width="290"
              >
              <v-card>
                <span v-for="(elem,i) in stk_list" :key="i">
                  <img :src="'./build_npm/' + elem" @click="getstk(elem,index)"/>
                </span>

              </v-card>

              </v-dialog>
            </div>

            <div class="bg_card" v-if="box_ans[index].type=='click'">
              <div class="head_label">{{box_ans[index].label}}</div>
              <div class="card_content">{{box_ans[index].content}}</div>
            </div>
            <div class="bg_card" v-if="box_ans[index].type=='location'">
              <div class="head_label">{{box_ans[index].label}}</div>
              <div class="card_content">
                <v-btn color="primary" text v-on:click="geolocation">text</v-btn>
                <v-text-field name="title" label="หัวข้อ" ></v-text-field>
                <v-text-field name="detail" label="คำอธิบาย/ที่อยู่" ></v-text-field>
                <v-text-field name="lat" label="ละติจูด"  ></v-text-field>
                <v-text-field name="long" label="ลองติจูด"></v-text-field>

              </div>
            </div>
            <div class="bg_card" v-if="box_ans[index].type=='image'||box_ans[index].type=='Image'">
              <div class="head_label">{{box_ans[index].type}}</div>
              <div class="card_content card_img">คลิกเพื่อเพิ่มรูป</br>
                  <img :src="src_img"/>
                  <input type="file" id="file" ref="myFiles" class="custom-file-input" @change="previewFiles($event,index)"></input>
              </div>
            </div>
          <div class="close_b" @click="box_dialog(index)">
            <i class="el-icon-close"></i>
          </div>
        <v-dialog v-model="box_ans[index].dialog" max-width="290">
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
          <span v-if="flag_addAnswer">
            <v-btn
              color="primary" rounded small fab
              @click="addAns"
            >
              OK
            </v-btn></span>
          <span v-else><v-btn
            color="primary" rounded small fab
            @click="do_text_q"
          >
            OK
          </v-btn></span>

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
  backgrounded: #e9eef2;
  border: 1px solid #ddd;
  color: #575a5d;
  border-radius: 3px;
  padding-left: 3px;
  padding-top: 3px;
  min-height: 40px;
  width: 100%;
  margin-bottom: 5px;
}
.card_img img{
  max-height: 90px;
  max-width: 90px;
}
</style>

<script>
// eslint-disable-next-line
/* eslint-disable */
  import { mapActions, mapState, mapGetters } from 'vuex'
  import axios from 'axios'
  // import store from '../vuex/store.js'
  export default{
    data () {
      return {
        dialog: false,
        src_img: 'https://res.cloudinary.com/botline/image/upload/v1527685132/jpaa1us8nliiuvwpc7of.png',
        text: '',
        stk_list: [],
        currentLocation: {lat: 0, lng: 0},
        box_ans: [],
        intentId: '',
        p_sticker: '',
        sticker_d: false,
        items: [
          {
            title: 'ข้อความ',
            icon: 'message',
            t_line: 'Text',
            type_add: 'text'
          },
          {
            title: 'รูปภาพ',
            icon: 'photo',
            t_line: 'Image',
            type_add: 'image'
          },
          {
            title: 'สติ๊กเกอร์',
            icon: 'tag_faces',
            t_line: 'Sticker',
            type_add: 'sticker'
          },
          {
            title: 'WebhookAPI',
            icon: 'play_arrow',
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
    watch: {
      edit_setting: function (val) {
        console.log(val)
        if (this.flag_addAnswer) {
          this.intentId = val.intent_id
        } else {
          this.box_ans = val.dialog
        }
        /* for (var i = 0; i < this.box_ans.length; i++) {
          this.box_ans[i].dialog = false
        } */
        console.log(this.box_ans)
        for (var i = 0; i < this.box_ans.length; i++) {
          if (this.box_ans[i].type === 'Sticker' || this.box_ans[i].type === 'sticker') {
            this.p_sticker = this.box_ans[i].content.p_sticker
          }
        }
      },
      flag_addAnswer: function (val) {
        console.log('set_flag_add_ans change ' + val)
        if (val) {
          console.log('this show')
          this.box_ans = []
        }
      }
    },
    computed: {
      ...mapGetters(['flag_addAnswer']),
      ...mapState(['edit_setting'])
    },
    methods: {
      ...mapActions(['d_toggle', 'c_DailogEANS']),
      addAns: function () {
        // console.log('local click')
        // this.edit_setting[this.edit_setting.idnow].dialog = this.box_ans
        // console.log(this.edit_setting)
        var data = {}
        data.dialog = this.box_ans
        data.intentId = this.intentId
        console.log(data)
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(this.restserver+'api/api_updateAddAnswer.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          console.log('r: ', JSON.stringify(r, null, 2))
          this.c_DailogEANS(false)
          // this.show_d_edit(this.selectedIntent)
        })
      },
      box_dialog: function (index) {
        console.log(this.box_ans)
        this.box_ans[index].dialog = true
      },
      do_text_q: function () {
        // console.log('local click')
        this.edit_setting[this.edit_setting.idnow].dialog = this.box_ans
        // console.log(this.edit_setting)
        var data = {}
        data = this.edit_setting
        console.log(data)
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(this.restserver+'api/api_updateEditAnswer.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          console.log('r: ', JSON.stringify(r, null, 2))
          this.c_DailogEANS(false)
          // this.show_d_edit(this.selectedIntent)
        })
      },
      getstk: function (elem, index) {
        // console.log(index)
        this.p_sticker = './build_npm/' + elem
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
          axios.get('./api/glob_img.php')
          .then(response => {
            // console.log(response.data)
            this.stk_list = response.data
          })
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
    }
  }
</script>
