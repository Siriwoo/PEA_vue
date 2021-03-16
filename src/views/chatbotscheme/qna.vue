<template>
  <v-container class="py-0 px-0 mt-0 ">
    <div class="css_qna">
    <v-card flat>
      <div class="py-1 px-2">
        <div class="">
          <span class="headerask">เพิ่มคำถาม </span>
          <v-btn icon @click="clickresetContextEvent()">
            <i class="el-icon-delete"></i>
          </v-btn>
        </div>

        <div class="bg_card" @click="d_toggle(0)">
          <div v-if="this.contextEventx.status">มาจากคำถาม : {{contextEventx.text}}</div>
          <div>คำถาม : {{stat_qna[0].text}}</div>
          <div>วิธีตอบ : {{stat_qna[0].type}}</div>
        </div>

          <v-dialog
          v-model="stat_qna[0].dialog"
          max-width="500px"
          transition="dialog-transition"
          >
            <dQna/>
          </v-dialog>


      </div>
    </v-card>
    <v-card flat class="mt-2">
      <div class="py-1 px-2">
        <h3>สร้างคำตอบ</h3>
        <div class="bg_card" @click="d_toggle(1)">
          <span v-for="(elem,i) in stat_qna[1].text" :key="i">
            <span v-if="elem.type=='text'||elem.type=='Text'">
              {{i+1}}:{{elem.type}} : {{elem.content}},
            </span>
            <span v-if="elem.type=='WebhookAPI'||elem.type=='WebhookAPI'">
              {{i+1}}:{{elem.type}} : {{elem.content|shortthen}},
            </span>
            <span v-if="elem.type=='image'||elem.type=='Image'">
              {{i+1}}:<img :src="elem.content.picurl" class="smallpic">
            </span>
            <span v-if="elem.type=='sticker'||elem.type=='Sticker'">
              {{i+1}}:<img :src="elem.content.p_sticker">
            </span>


          </span>

        </div>
        <v-dialog
          v-model="stat_qna[1].dialog"
          max-width="500px"
          transition="dialog-transition"
        >
          <dAns
          :isedit="false"
          />
        </v-dialog>
        <v-dialog
          v-model="dialognotsave"
          width="500"
        >
          <v-card>
            <v-card-title
              class="headline grey lighten-2"
              primary-title
            >
              <i v-bind:class="AlertIcon"></i> {{textAlertTitle}}
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
                @click="dialognotsave = false"
              >
                ก้ว่ากันไป
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card>
    <v-card flat class="mt-2">
      <div class="py-1 px-2">
        <h3>เพิ่ม Tags</h3>
        <div class="bg_card" @click="d_toggle(2)">
          <v-chip v-for="(elem,i) in stat_qna[2].text" :key="i"><i class="el-icon-collection-tag"></i>{{elem.name}}<div class="space"></div></v-chip>

        </div>
        <v-dialog
          v-model="stat_qna[2].dialog"
          max-width="500px"
          transition="dialog-transition"
        >
          <dTags/>
        </v-dialog>
      </div>
    </v-card>
     <v-btn large block outlined color="secondary"
     @click.native="post_data()"
     :loading="loading3"
     :disabled="loading3">Apply</v-btn>
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
</style>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import dQna from './d_qna.vue'
  import dAns from './d_ans.vue'
  import dTags from './d_tags.vue'
  import axios from 'axios'
  import {frefuccb} from './mixins/frefuccb'
  //  console.log(mapState(['g_text']))
  export default{
    data () {
      return {
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
        }
      }
    },
    components: {
      dQna,dAns,dTags
    },
    mixins: [frefuccb],
    computed: {
      ...mapGetters(['stat_qna']),
      ...mapState(['selectedIntentVux'])
    },
    watch: {
      selectedIntentVux: function (val) {
        this.contextEventx.status = true,
        this.contextEventx.text = `(${val[0].ask_human[0].id})${val[0].ask_human[0].ask}`
        this.contextEventx.value =val[0].intent_id
        this.stat_qna[0].contextId = val[0].intent_id
      }
    },
    mounted() {
      //do something after mounting vue instance
      this.stat_qna[0].contextId = null
    },
    methods: {
      d_toggle(tmp){
        this.componentKey_dAns++
        this.$store.dispatch('chatbot/d_toggle', tmp)
        console.log(this.stat_qna);
      },
      //...mapActions(['d_toggle']),
      clickresetContextEvent(){
        this.contextEventx.status = false
        this.contextEventx.text = ''
        this.stat_qna[0].contextId = null
      },
      post_data: function () {
        this.loading3 = true
        console.log(this.stat_qna)
        if (this.stat_qna[0].text===''||this.stat_qna[1].text===''||this.stat_qna[2].text===''){
          this.loading3 = false
          this.AlertIcon = 'el-icon-warning'
          this.textAlertTitle = 'ฮั่นแน่'
          this.textalert = 'อย่ากดเล่น อย่าด่วน save ยังกรอกข้อมูลไม่ครบ'
          this.dialognotsave = true
        }else{
          this.stat_qna[1].text = this.trimdata_before_save(this.stat_qna[1].text)
          const params = new URLSearchParams()
          params.append('event_id', JSON.stringify(this.stat_qna))
          axios({
            method: 'post',
            url: process.env.VUE_APP_BASE_SERVER_PHP+'/api/save.php',
            data: params
          }).then(r => {
            //console.log(JSON.stringify(r, null, 2))
            if (r.status === 200) {
              this.loading3 = false
              this.stat_qna[0].text = ''
              this.stat_qna[1].text = ''
              this.stat_qna[2].text = ''
            } else {
              alert('Crash cannot save')
            }
          })

        }

        this.loader = null
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
