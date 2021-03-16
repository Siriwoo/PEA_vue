<template>
  <v-container class="py-0 px-0 mt-0">
    <v-tabs
    centered
    color="secondary"
    dark
    icons-and-text
    v-model="tab"
    grow
    height="45px"
  >
    <v-tabs-slider color="accent"></v-tabs-slider>

    <v-tab href="#tab-1" @click="forceRerender()">
      <v-icon>event_note</v-icon>
    </v-tab>

    <v-tab href="#tab-2" @click="forceRerender()">
      <v-icon>contacts</v-icon>

    </v-tab>

    <v-tab href="#tab-3" @click="forceRerender()">
      <v-icon>device_hub</v-icon>
    </v-tab>

    <v-tab href="#tab-4" @click="forceRerender()">
      <v-icon>view_agenda</v-icon>
    </v-tab>

    <v-tab href="#tab-5" @click="forceRerender()">
      <v-icon>add_alert</v-icon>
    </v-tab>


    <v-tab-item
      v-for="i in 5"
      :id="'tab-' + i"
      :key="i"
    >
      <!--<app-profile v-if="i=='1'" :key="componentKey"></app-profile>
      <app-history v-if="i=='2'" :key="componentKey"></app-history>
      <app-equipt v-if="i=='3'" :key="componentKey"></app-equipt>
      <app-fav v-if="i=='4'" :key="componentKey"></app-fav>
      <app-bell v-if="i=='5'" :key="componentKey"></app-bell>-->
    </v-tab-item>
  </v-tabs>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
a {
  color: #42b983;
}


</style>

<script>
import {mapGetters} from 'vuex'
import profile from './timeline/profile.vue'
import history from './timeline/history.vue'
import equipt from './timeline/equipt.vue'
import timeline from './timeline/history.vue'
import bell from './timeline/bell.vue'
import fav from './timeline/bell.vue'
import axios from 'axios'
export default{
  data () {
    return {
      text: 'fuck',
      tab:'',
      componentKey: 0
    }
  },
  components: {
    'app-profile': profile,
    'app-history': history,
    'app-equipt': equipt,
    'app-fav': fav,
    'app-bell': bell,
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    }
  },
  computed:{
    ...mapGetters(['restserver'])
  },
  mounted() {
    //do something after mounting vue instance
    var data = {}
    data.forsure = 'checksession'
    data.des = 'mml'
    //console.log(this.restserver+'xxx')
    const params = new URLSearchParams()
    params.append('event_id', JSON.stringify(data))
    axios.post(this.restserver+'api/checksession.php', params, {
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    }).then(r => {
      //console.log('r: ', JSON.stringify(r, null, 2))
      //this.lmenu = false
      console.log(r.data[0])
      if (r.data[0].user === 'exist') {
        console.log('user exist')
        // this.dialog = true
      } else {
        /*this.dialog = true
        this.AlertIcon = 'warning'
        this.textAlertTitle = 'ฮั่นแน่'
        this.textalert = 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้'*/

        this.$router.push({ path: '/' })
      }
      //this.lfirst = false
    })
  }
}
</script>
