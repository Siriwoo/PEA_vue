<template>
  <v-container class="py-2 px-1 mt-0 css_qna">
    <el-input
      placeholder="Filter keyword"
      v-model="filterText">
    </el-input>
    <el-tree
    class="filter-tree"
    :data="g_tags"
    :props="defaultProps"
    node-key="id"
    :filter-node-method="filterNode"
    :expand-on-click-node="false"
    @node-click="add_tag"
    ref="tree">
    </el-tree>

    <v-card>
      <span v-for="(elem,i) in wanttag_sq" :key="i">
        <v-chip v-model="elem.show">{{elem.name}}
          <i class="el-icon-circle-close custom-icon" @click="d_wanttag(i)"></i></v-chip>
      </span>
      <v-btn color="primary" text outlined block @click="search_q">Search Questions</v-btn>
    </v-card>
<!--1111-->

      <div v-for="(elem,i) in question_q" :key="i">
        <div class="">
          <v-checkbox :label="'Intent : '+elem.intent_id" v-model="selectedIntent" :value="elem" ></v-checkbox>
        </div>
        <div class="">
          [<span v-for="(elem1,i) in elem.ask_human" :key="i">{{elem1.ask}}
            <span v-if="i<(elem.ask_human.length-1)">,</span></span>]
        </div>

        <v-divider></v-divider>
      </div>

    <v-dialog
      v-model="dialogDelete"
      persistent
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title class="headline">
          Delete This Question?
        </v-card-title>
        <v-card-text>
          คำถามนี้จะหายไปตลอดกาล ไม่อยู่แม้กระทั่งใน database
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialogDelete=false">ไม่</v-btn>
          <v-btn color="primary" @click="doDeleteQuestion">ลบเลย ไม่รอ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogMerge"
      persistent
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title class="headline">
          Merge Intent?
        </v-card-title>
        <v-card-text>
          คือการรวม itent ที่คุณต้องการให้อยู่ใน intent เดียวกัน คำถามทั้งหมดจะอยู่ใน Intent ที่น้อยที่สุด ส่วน Itent เดิมจะหายไปพร้อมกับ tag ของตัวมันเองตลอดกาล
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialogMerge=false">ไม่</v-btn>
          <v-btn color="primary" @click="doMergeIntent">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogEdit"
      scrollable fullscreen
      persistent :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >   <v-card>
      <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
        <v-btn icon dark @click.native="closeDialogEditAll">
          <i class="el-icon-error custom-icon3"></i>
        </v-btn>
        Intent {{editScheme.asking.intent_id}}
      </v-card-title>
        <v-card class="mx-1 my-1 py-1">
          <div class="Outer">
            <div class="headerT">
              คำถาม <i class="el-icon-circle-plus" @click="dialogAddask=true"></i>
            </div>
          </div>
          <div v-for="(elem,i) in editScheme.asking.ask_human" :key="i"
          v-bind:class="[i%2 ? 'bgListOdd' : '', 'bgList']">
            <i class="el-icon-edit" @click="editQuestion(elem)"></i>
            <i class="el-icon-remove" @click="deleteQuestion(elem)"></i>{{elem.ask}}
          </div>
        </v-card>
        <v-card class="mx-1 my-1 py-1">
          <div class="headerT">
            คำตอบ <i class="el-icon-circle-plus" @click="f_dialogAddAns"></i>
          </div>

          <div v-for="(elem,i) in editScheme.answr" :key="i"
            v-bind:class="[i%2 ? 'bgListOdd' : '', 'bgList']">
            <i class="el-icon-edit" @click="editAnswer(elem,i)"></i>
            <i class="el-icon-remove" @click="deleteAnswer(elem)"></i>{{elem.answer}}
          </div>
        </v-card>
        </v-card>

    </v-dialog>
    <v-dialog
      v-model="dialogAddask"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title class="headline">
          พิมพ์คำถามที่ต้องการเพิ่ม
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="textAdd"
            auto-grow
            filled
            color="deep-purple"
            label="Add Question"
            rows="1"
          ></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" rounded small fab @click="addAsk">
            <i class="el-icon-success"></i>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogAddAns"
      max-width="500px"
      transition="dialog-transition"
    ><app-dAns
    :isedit="false"
    :isinedit="true"
    ></app-dAns><!--addAns-->
    </v-dialog>

    <v-dialog
      v-model="dialogEditask"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>

        <v-card-title primary-title class="headline">
          แก้ไขแล้วกด save
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="textEdit.dialog"
            auto-grow
            filled
            color="deep-purple"
            label="Add Question"
            rows="1"
          ></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" rounded small fab @click="EditAsk">
            <i class="el-icon-success"></i>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogEditans"
      persistent
      max-width="500px"
      transition="dialog-transition"
    ><app-dAns
    :isinedit="true"
    :isedit="true"
    :key="componentKey_dAns"
    ></app-dAns>
    </v-dialog>

    <v-dialog
      v-model="dialogDeleteANS"
      persistent
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title class="headline">
          Delete This Answer?
        </v-card-title>
        <v-card-text>
          คำตอบนี้จะหายไปตลอดกาล ไม่อยู่แม้กระทั่งใน database
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialogDeleteANS=false">ไม่</v-btn>
          <v-btn color="primary" @click="doDeleteAnswer">ลบเลย ไม่รอ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>

</template>



<script>
// eslint-disable-next-line
/* eslint-disable */
  import dAns from './d_ans.vue'
  import { mapState, mapActions, mapGetters } from 'vuex'
  import axios from 'axios'
  export default{
    data () {
      return {
        componentKey_dAns: 0,
        restserver: process.env.VUE_APP_BASE_SERVER_PHP,
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        text: 'fuck',
        selectedIntent: [],
        wanttag_sq: [],
        listAnswer: [],
        dialogMerge: false,
        dialogEdit_S: false,
        dialogDelete: false,
        dialogAddask: false,
        dialogDeleteANS: false,
        dialogAddAns: false,
        textEdit: {
          id: '',
          dialog: [
            {
              content: '',
              label: '',
              type: '',
              type_add: ''
            }
          ]
        },
        dialogEditask: '',
        textAdd: '',
        editScheme: {
          asking: {
            id: '',
            ask_human: ''
          },
          answr: [
            {
              answer: ''
            }
          ]
        }
      }
    },
    created () {
      // do something after creating vue instance
      console.log('loaded setting.vue')
    },
    components: {
      'app-dAns': dAns
    },
    computed: {
      ...mapGetters([
        'question_q',
        'edit_setting',
        'g_tags',
        'bottombuttom',
        'deSelectClick',
        'dialogEdit',
        'mergeIntentClick',
        'dialog_editAns',
        'dialogEditans',
        'sel_intent'
      ])
    },
    methods: {
      filterNode(value, data) {
        //console.log(data);
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      add_tag: function (data) {
        console.log(data);
        var id = data.id
        var name = data.tag_short
        console.log(id)
        console.log(name);
        var tmp2 = true
        for (var i = 0; i < this.wanttag_sq.length; i++) {
          if (this.wanttag_sq[i].name === name) {
            tmp2 = false
          }
        }
        if (tmp2) {
          var tmp = {}
          tmp.id = id
          tmp.name = name
          tmp.show = true
          this.wanttag_sq.push(tmp)
        } else {
          this.d_alert = true
        }

        // console.log(id + '+' + name)
      },
      d_wanttag: function (i) {
        this.wanttag_sq.splice(i, 1)
      },
      c_all_question: function (d) {
        this.$store.dispatch('chatbot/c_all_question', d)
      },
      c_DailogEANS: function (d) {
        this.$store.dispatch('chatbot/c_DailogEANS', d)
      },
      q_question: function (d) {
        this.$store.dispatch('chatbot/q_question', d)
      },
      set_flag_add_ans: function (d) {
        this.$store.dispatch('chatbot/set_flag_add_ans', d)
      },
      s_edit_setting: function (d) {
        this.$store.dispatch('chatbot/s_edit_setting', d)
      },
      f_dialogAddAns: function () {
        this.componentKey_dAns++
        this.dialogAddAns = true

        this.set_flag_add_ans(true)
        this.textEdit.intent_id = this.editScheme.asking.intent_id
        this.s_edit_setting(this.textEdit)

      },
      closeDialogEditAll: function () {
        // 2222
        var data = {}
        data.dialogEdit = false
        this.c_bottombuttom(data)
        // array ที่ต้องแก้ --> this.question_q
        // console.log(this.question_q)
        this.$store.dispatch('chatbot/c_all_question', this.editScheme)
        //this.c_all_question(this.editScheme)
        // console.log(this.editScheme)
      },
      doDeleteQuestion: function () {
        console.log(this.textEdit)
        var data = {}
        data = this.textEdit
        // console.log(data)
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(this.restserver+'/api/api_DeleteQuestion.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          console.log(r)
          this.dialogDelete = false
          this.show_d_edit(this.sel_intent)
          this.show_d_question(this.sel_intent)
        })
      },
      addAsk: function () {
        var data = {}
        data.intent_id = this.editScheme.answr[0].intent_id
        data.addask = this.textAdd
        console.log(data)
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(this.restserver+'/api/api_updateAddQuestion.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          console.log(r)
          this.dialogAddask = false
          this.show_d_edit(this.sel_intent)
          this.show_d_question(this.sel_intent)
        })
      },
      EditAsk: function () {
        var data = {}
        data = this.textEdit
        console.log(data)
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(this.restserver+'/api/api_updateEditQuestion.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          console.log(r)
          this.dialogEditask = false
          // console.log(this.sel_intent)
          this.show_d_question(this.sel_intent)
          this.show_d_edit(this.sel_intent)
        })
      },
      doMergeIntent: function () {
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(this.selectedIntent))
        console.log(this.selectedIntent)
        axios.post(this.restserver+'/api/api_updateIntent.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          console.log(r)
          this.dialogMerge = false
          // this.show_d_question(this.sel_intent)
          this.search_q()
        })
      },
      editQuestion: function (val) {
        console.log(val)
        this.dialogEditask = true
        this.textEdit.dialog = val.ask
        this.textEdit.id = val.id
      },
      deleteQuestion: function (val) {
        console.log(val)
        this.dialogDelete = true
        this.textEdit.dialog = val.ask
        this.textEdit.id = val.id
      },
      editAnswer: function (val, j) {
        console.log('ต้องการแก้ไข id : '+j);
        this.set_flag_add_ans(false)
        //this.dialogEditans = true


        // console.log(j)
        // this.textEdit.dialog = val.answer
        // this.textEdit.dialog = []
        var valtmp = JSON.parse(val.answer)

        for (var i = 0; i < valtmp.length; i++) {
          valtmp[i].dialog = false
          // this.textEdit.dialog[i].content = valtmp[i].content
          // this.textEdit.dialog[i].type = valtmp[i].type
          if (valtmp[i].type === 'text' || valtmp[i].type === 'Text') {
            valtmp[i].label = 'ข้อความ'
            valtmp[i].type_add = 'text'
          } else if (valtmp[i].type === 'image' || valtmp[i].type === 'Image') {
            valtmp[i].label = 'รูปภาพ'
            valtmp[i].type_add = 'image'
          } else if (valtmp[i].type === 'sticker' || valtmp[i].type === 'Sticker') {
            valtmp[i].label = 'สติ๊กเกอร์'
            valtmp[i].type_add = 'sticker'
          } else if (valtmp[i].type === 'location' || valtmp[i].type === 'Location') {
            valtmp[i].label = 'โลเคชั่น'
            valtmp[i].type_add = 'location'
          } else if (valtmp[i].type === 'WebhookAPI') {
            valtmp[i].label = 'WebhookAPI'
            valtmp[i].type_add = 'WebhookAPI'
          }
        }
        this.textEdit[j] = {}
        this.textEdit[j].dialog = valtmp
        // console.log(this.textEdit.dialog)
        this.textEdit[j].id = val.id
        this.textEdit.dialog = valtmp
        // console.log(this.textEdit.dialog)
        this.textEdit.id = val.id
        this.textEdit.idnow = j
        // this.textEditSingle.dialog = valtmp
        // console.log(this.textEdit.dialog)
        // this.textEditSingle.id = val.id
        // this.textEdit.idx = val.id
        this.s_edit_setting(this.textEdit)
        this.componentKey_dAns++
        console.log('componentKey_dAns>>'+this.componentKey_dAns);
        this.$store.dispatch('chatbot/c_DailogEditAns', true)
        console.log(this.edit_setting)
      },
      deleteAnswer: function (val) {
        console.log(val)
        this.dialogDeleteANS = true
        this.textEdit.dialog = val.answer
        this.textEdit.id = val.id
      },
      doDeleteAnswer: function (val) {
        console.log(this.textEdit)
        var data = {}
        data = this.textEdit
        // console.log(data)
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(this.restserver+'/api/api_DeleteAnswer.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          console.log(r)
          this.dialogDeleteANS = false
          this.show_d_edit(this.sel_intent)
          this.show_d_question(this.sel_intent)
        })
      },
      search_q: function () {
        for (var i = 0; i < this.wanttag_sq.length; i++) {
          var ltags = this.wanttag_sq[i].name
          if (i !== (this.wanttag_sq.length - 1)) {
            ltags += ','
          }
        }
        // console.log('L65' + ltags)
        axios.get(this.restserver+'/api/api_QnTag.php?tag=' + ltags + '&num=' + this.wanttag_sq.length)
        .then(response => {
          // console.log(response.data)
          this.$store.dispatch('chatbot/q_question', response.data)
          //this.q_question(response.data)
          var data = {}
          data.deSelectClick = true
          //this.c_bottombuttom(data)
          this.c_bottombuttom(data)
        }).catch(e => {

        })
      },
      show_d_edit: function (payload) {
        console.log(payload)
        payload = payload[0]
        this.editScheme.indexEdit = payload.index
        // console.log(this.selectedIntent)
        axios.get(this.restserver+'/api/QAnswerbyintent.php?intent=' + payload.intent_id)
        .then(response => {
          // console.log(response.data)
          this.editScheme.answr = response.data
        }).catch(e => {

        })
        this.dialogEdit_S = true
        this.editScheme.asking = payload
        // this.editScheme.index =
        console.log(this.editScheme)
      },
      show_d_question: function (payload) {
        payload = payload[0]
        console.log(payload)
        // console.log(this.selectedIntent)
        axios.get(this.restserver+'/api/QQuestionbyintent.php?intent=' + payload.intent_id)
        .then(response => {
          console.log(response.data)
          this.editScheme.asking = response.data
          console.log(this.editScheme)
        }).catch(e => {

        })
        this.dialogEdit_S = true
        // this.editScheme.asking = payload
        console.log(this.editScheme)
      },
      c_bottombuttom: function (data) {
        this.$store.dispatch('chatbot/c_bottombuttom', data)
      }
    },
    watch: {
      filterText(val) {
        //console.log(this.$refs.tree);
        this.$refs.tree.filter(val);
      },
      selectedIntent: function () {
         console.log(this.selectedIntent)
        this.$store.dispatch('chatbot/S_Intent', this.selectedIntent)
        //this.S_Intent(this.selectedIntent)
        var data = {}
        data.show = true
        this.c_bottombuttom(data)
        //this.c_bottombuttom(data)
        if (this.selectedIntent.length === 0) {
          this.bottombuttom.show = false
        } else if (this.selectedIntent.length === 1) {
          this.bottombuttom.show = true
          this.bottombuttom.mergeIntent = false
          this.bottombuttom.editIntent = true
          this.bottombuttom.deleteIntent = true
          this.bottombuttom.deSelect = true
        } else {
          this.bottombuttom.show = true
          this.bottombuttom.mergeIntent = true
          this.bottombuttom.editIntent = false
          this.bottombuttom.deleteIntent = false
          this.bottombuttom.deSelect = true
        }
        /* if (this.bottombuttom.dialogEdit) {
          this.dialogEdit_S = true
        } else {
          this.dialogEdit_S = false
        } */
      },
      deSelectClick: function () {
        // console.log('somthing change in deSelectClick')
        if (this.bottombuttom.deSelectClick) {
          // console.log('clickDeselect')
          this.selectedIntent = []
          this.bottombuttom.deSelectClick = false
        }
      },
      mergeIntentClick: function (val) {
        // console.log('somthing change in mergeIntentClick')
        var data = {}
        if (val) {
          // console.log(this.selectedIntent)
          this.dialogMerge = true
        }
        data.mergeIntentClick = false
        this.c_bottombuttom(data)
      },
      dialogEdit: function (val) {
        console.log('dialogEdit>>'+val);
        this.dialogEdit_S = val
        if (val) {
          this.show_d_edit(this.selectedIntent)
        }
        if(!val){
          this.dialogAddAns = false
        }
      },
      dialogEdit_S: function (val) {
        var data = {}
        // console.log(val)
        data.dialogEdit = val
        data.deSelectClick = true
        this.c_bottombuttom(data)
        //this.c_bottombuttom(data)
      },
      dialogEditans: function (val) {
        //this.c_DailogEANS(val)
      },
      dialogAddAns: function (val) {
        //this.c_DailogEANS(val)
      },
      dialog_editAns: function (val) {
        //this.dialogEditans = val
        this.componentKey_dAns++
        this.$store.dispatch('chatbot/c_DailogEditAns', val)

        console.log('dialog_editAns = ' + val)
        if (!val) {
          console.log(this.sel_intent)
          this.show_d_edit(this.sel_intent)
          this.dialogAddAns = val
          //this.componentKey_dAns++
        }
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.custom-icon3 {
   font-size: 2rem;
}
.css_qna{
  .v-input--selection-controls__input input[role=checkbox], .v-input--selection-controls__input input[role=radio], .v-input--selection-controls__input input[role=switch]{
    opacity: 1 !important;
  }
}
.custom-icon {
   font-size: 2rem;
}
.headerT{
  padding-top: 5px;
  padding-left: 5px;
  font-weight: bold;
  font-size: 17px;
  display: table-cell;
  vertical-align: middle;
}
.Outer{
  display: table;
}
.bgList{
  background-color: #f5f5f5;
  margin-top: 3px;
  margin-left: 3px;
  margin-right: 3px;
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
}
.bgListOdd{
  background-color: #eee;
}

</style>
