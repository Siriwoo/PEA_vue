<template>
  <v-container wrap class="px-0 py-0 mt-0" >
    <div class="css_qna">

    <div class="pbar ">
      <v-progress-circular v-if="lfirst" :size="25" :width="4"
      indeterminate color="primary"></v-progress-circular>
    </div>
    <v-tabs
    v-if="!lfirst"
    centered
    color="secondary"
    dark
    icons-and-text
    v-model="tab"
    grow
  >
    <v-tabs-slider color="accent"></v-tabs-slider>

    <v-tab href="#tab-1" @click="forceRerender()">
      ถาม/ตอบ
      <i class="el-icon-chat-line-square custom-icon"></i>
    </v-tab>

    <v-tab href="#tab-2" @click="forceRerender()">
      ส่งข้อความ
      <i class="el-icon-position custom-icon"></i>
    </v-tab>

    <v-tab href="#tab-3" @click="forceRerender()">
      Training
      <i class="el-icon-medal-1 custom-icon"></i>
    </v-tab>

    <v-tab href="#tab-4" @click="forceRerender()">
      แก้ไข
      <i class="el-icon-edit custom-icon"></i>
    </v-tab>

    <v-tab-item
      v-for="i in 4"
      :id="'tab-' + i"
      :key="i"
    >
      <app-qna v-if="i=='1'" :key="componentKey"></app-qna>
      <app-senmes v-if="i=='2'" :key="componentKey"></app-senmes>
      <app-training v-if="i=='3'" :key="componentKey"></app-training>
      <app-editting v-if="i=='4'" :key="componentKey"></app-editting>

    </v-tab-item>
  </v-tabs>

</div>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
h1, h2 {
  font-weight: normal;
}
.custom-icon {
   font-size: 1.5rem;
}
.css_qna{
  .v-tabs{
    width:800px;
  }
  .row{
    margin: auto !important;
  }
}
@media screen and (max-width: 768px) {
  .css_qna{
    .v-slide-group__next, .v-slide-group__prev{
      display: none !important;
    }
    .v-tabs{
      width:100%;
    }
  }

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
.pbar{
  z-index: 5000;
  position: absolute;
  float: right;
  top:1vh;
  margin-left: 47vw;
  text-align: center;
  display: block;
}
</style>

<script>
import axios from 'axios'
import { mapActions, mapState, mapGetters } from 'vuex'
import qna from './qna.vue'
import senmes from './senmes.vue'
import editting from './editting.vue'
import training from './training.vue'

export default{
  data () {
    return {
      text: 'fuck',
      tab: '',
      lfirst: true,
      componentKey: ''
    }
  },
  watch: {
    tab: function () {
      this.bottombuttom.show = false
    },
    selectSpeedDail: function (val) {
      //console.log(val);
      if (typeof val.useThisintentClick !== 'undefined'||typeof val.ClickaddLastToText !== 'undefined') {
        this.tab = 'tab-1'
      }
    }
  },
  mounted() {
    //do something after creating vue instance
    //this.lmenu = true


  },
  created () {
    // do something after creating vue instance
    axios.get(process.env.VUE_APP_BASE_SERVER_PHP+'/api/api.php')
    .then(response => {
      //query all tags,why do this motherfucker
      this.set_tags(response.data)
      this.lfirst = false
      // this.testtwo = response.data
      // console.log(this.g_tags)
      // console.log(this.g_component.tags)
    })
    .catch(e => {
      console.log(e)
    })
  },
  components: {
    'app-qna': qna,
    'app-senmes': senmes,
    'app-editting': editting,
    'app-training': training
  },
  computed: {
    ...mapGetters(['g_tags', 'selectSpeedDail','bottombuttom','selectedIntentVux'])
  },
  methods: {
    set_tags(r){
      this.$store.dispatch('chatbot/set_tags', r)
      console.log(this.g_tags);
    },
    forceRerender() {
      this.componentKey += 1;
      //console.log(this.tab)
    }
  }
}
</script>
