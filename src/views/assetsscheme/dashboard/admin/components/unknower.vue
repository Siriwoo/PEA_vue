<template>
  <v-container class="py-0 px-0 mt-0 ">
    test page
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
// eslint-disable-next-line
/* eslint-disable */
  import { mapGetters, mapActions, mapState } from 'vuex'
  import axios from 'axios'
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
    },
    methods: {
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
