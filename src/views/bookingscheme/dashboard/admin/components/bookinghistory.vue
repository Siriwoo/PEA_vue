<template>
  <v-container class="py-1 px-1 mt-0 ">
    <v-overlay :value="loadalldata">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <el-card class="box-card" v-for="e in bookinglist">
      <div class="smalldate">
        <svg-icon icon-class="edit" class="meta-item__icon float-right svgbtn" @click="foredit(e)"/>
        {{e.start_date|shortdate}}
        <span v-if="e.start_date!==e.end_date">~ {{e.end_date|shortdate}}</span>
        ({{e.duration|trandu}})
      </div>
      <div class="topicstyle">
        {{e.detail.topic}}
      </div>
      <div class="underline">
        {{e.detail.typemeetting.abbr|shorttype}}
        <span v-if="e.detail.typemeetting.abbr==1||e.detail.typemeetting.abbr==2">
        เลข:
        <span v-if="e.detail.typemeetting.abbr==1">{{e.roomconf}}</span>
        <span v-else>{{e.detail.vcjoin}}</span>
        </span>
        ห้อง: {{e.roomname}}
      </div>

    </el-card>
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
.svgbtn{
  cursor: pointer;
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
.meta-item__icon{
  font-size: 1.5em;
}
.smalldate{
  font-size: 14px;
  color: grey;
}
.topicstyle{
  color:green;
}
.underline{
  text-decoration: underline;
  font-weight: bold;
}
</style>

<script>
// eslint-disable-next-line
/* eslint-disable */
  import { mapGetters, mapActions, mapState } from 'vuex'
  import axios from 'axios'
  import { getUserData } from '@/utils/auth'
  //  console.log(mapState(['g_text']))
  export default{
    data () {
      return {
        userdata: {},
        componentKey_dAns: 0,
        loading3: false,
        dialognotsave: false,
        AlertIcon: '',
        textAlertTitle: '',
        textalert: '',
        bookinglist:{},
        loadalldata: true,
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
      this.userdata = JSON.parse(getUserData())
      this.queryfirst()
      //console.log();
    },
    methods: {
      foredit(e){
        this.$emit('showedit', e)
      },
      queryfirst(){
        var tmp = {}
        this.loadalldata = true
        tmp.info = 'load_history_owner'
        tmp.param1 = this.userdata.empcode
        this.$store.dispatch('info/loadinfo', tmp)
          .then((r) => {
            //console.log(r.data);
            this.bookinglist = r.data
            this.bookinglist.detail = this.bookinglist.map(e=>{
              let newe = e
              newe.detail = JSON.parse(e.detail.substring(1, e.detail.length-1));
              return newe
            })
            this.loadalldata = false
            console.log(this.bookinglist);
            //r= r.data
            //NProgress.done()
          })
      }
    },
    filters: {
      shortthen: function (value) {
        if (!value) return ''
        let d = {}
        value = new Date(value)
        value = value.setDate(value.getDate() + 1)
        value = new Date(value)
        value = value.toString()
        return value.substring(0, 9) + '....' + value.substring(value.length-3, value.length)
      },
      shortdate: function (value) {
        if (!value) return ''
        value = new Date(value)
        value = value.setDate(value.getDate() + 1)
        value = new Date(value)
        value = value.toISOString()
        //console.log(value);
        //value = value.toString()
        return value.substring(0, 10);
      },
      trandu: function (value) {
        if (!value) return ''
        if(value=='morning'){
          return 'เช้า'
        }else if(value=='afternoon'){
          return 'บ่าย'
        }else if(value=='allday'){
          return 'ทั้งวัน'
        }

      },
      shorttype: function (value) {
        if (!value) return ''
        if(value==1){
          return 'ผู้จัด VC'
        }else if(value==2){
          return 'เข้าร่วม VC'
        }else if(value==3){
          return 'ห้องVCหน่วยงาน'
        }else if(value==4){
          return 'ไม่มี'
        }

      }
    }
  }
</script>
