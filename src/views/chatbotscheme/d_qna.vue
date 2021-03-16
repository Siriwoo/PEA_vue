<template>
    <v-card flat>
      <v-card-title
          class="headline grey lighten-2 py-3 px-3"
          primary-title
        >
        <div class="big_text">
          เพิ่มคำถาม
        </div>
          <div class="small_text">
            พิมพ์คำถามที่ต้องการลงในช่องคำถาม
          </div>
        </v-card-title>

        <v-card-text>
          <v-textarea
          filled
          name="input-7-4"
          placeholder="พิมพ์คำถามที่ต้องการ"
          v-model="text"
        ></v-textarea>
            <el-select v-model="type_ans" placeholder="Select">
              <el-option
                v-for="item in TypeAns"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="do_text_q"
          >
            APPLY
          </v-btn>
        </v-card-actions>
    </v-card>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.small_text{
  font-size: 11px;
  width: 200px;
}
</style>

<script>
  import { mapActions, mapGetters } from 'vuex'

  // import store from '../vuex/store.js'
  export default{
    data () {
      return {
        type_ans: 'สุ่มคำตอบ',
        TypeAns: [{
          label:'สุ่มคำตอบ'
        },{
          label:'เอาคำตอบแรก'
        },{
          label:'คำตอบทั้งหมด'
        }],
        text: ''
      }
    },
    methods: {
      d_toggle(tmp){
        this.$store.dispatch('chatbot/d_toggle', tmp)
      },
      do_text_q: function () {
        // console.log('local click')
        this.stat_qna[0].text = this.text
        this.stat_qna[0].type = this.type_ans
        this.d_toggle(0)
      }
    },
    computed: {
      ...mapGetters(['stat_qna'])
    },
    mounted() {
      //do something after mounting vue instance
      this.text = this.stat_qna[0].text
    }
  }
</script>
