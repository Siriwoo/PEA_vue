<template>
  <v-container fluid class="px-5 py-5 as_form_card" >
  <div id="selecter">
  <el-row :gutter="10" >
    <el-col :xs="6" :sm="6">
      <div class="app-container ">
        <el-select v-model="creport.selequipt" filterable placeholder="Select">
          <el-option
            v-for="item in optioneq"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="buttun_text">ตัวเลือก A</div>
    </el-col>
    <el-col :xs="5" :sm="5">
      <div class="">
        <el-select v-model="creport.seltype" filterable placeholder="Select">
          <el-option
            v-for="item in optionst"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="buttun_text">ตัวเลือก B</div>
    </el-col>
    </el-row>
    </div>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.boxmain {
  padding-left: 5px;
}
@media screen and (max-width: 768px) {
  .css_qna {
    .el-dialog {
      margin: auto;
      width: 98%;
    }
    .el-dialog__body {
      padding: 0px 0px 0px !important;
    }
  }
}
.app-container {
  padding: 3px;
}
.deviceinfocss {
  .el-input {
    font-size: 14px !important;
  }
}
h1,
h2 {
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
.headerask {
  font-weight: bold;
  font-size: 16px;
}
a {
  color: #42b983;
}
.space {
  min-width: 7px;
}
.as_form_card {
  background: #F0F0E8;

  color: #616264;

  padding-left: 3px;
  padding-top: 3px;
  min-height: 90px;
}
.smallpic {
  width: 70px;
}
</style>

<script>
// eslint-disable-next-line
/* eslint-disable */
import { mapGetters, mapActions, mapState } from "vuex";
import axios from "axios";
//  console.log(mapState(['g_text']))
export default {
  data() {
    return {
      componentKey_dAns: 0,
      loading3: false,
      dialognotsave: false,
      AlertIcon: "",
      textAlertTitle: "",
      textalert: "",
      contextEventx: {
        status: false,
        text: "",
        value: "",
      },
      creport: {
        nameform: '',
        selequipt: '',
        seltype: ''
      },
    };
  },
  mixins: [],
  computed: {
    ...mapGetters(["stat_qna"]),
    ...mapState(["selectedIntentVux"]),
  },
  watch: {},
  mounted() {
    //do something after mounting vue instance
    this.stat_qna[0].contextId = null;
  },
  methods: {},
  filters: {
    shortthen: function (value) {
      if (!value) return "";
      value = value.toString();
      return (
        value.substring(0, 9) + "...." + value.substring(value.length - 3, value.length)
      );
    },
  },
};
</script>
