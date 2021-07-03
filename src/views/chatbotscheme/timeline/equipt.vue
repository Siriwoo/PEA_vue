<template>
  <v-container class="py-2 px-1 mt-0">
    <v-layout row wrap v-if="pmdata.nowpage=='mainmenu'">
      <v-flex xs6 md4 mb-2 lg1 xl1 px-1 v-for="elem in listequipt" :key="elem.id">
        <div class="card" @click="setnowpage(elem.page,elem.equip_short,elem.equip,elem.pictureurl)">
          <!--<img :src="elem.pictureurl" alt="">-->
          <div class="her">
            {{elem.equip_short}}
          </div>
          <div class="smll">
            ข้อมูลและประวัติ {{elem.equip}}
          </div>
        </div>
      </v-flex>
    </v-layout>
    <app-pmcctv v-else-if="pmdata.nowpage=='pmcctv'" :key="componentKey" ></app-pmcctv>
    <app-pmpbax v-else-if="pmdata.nowpage=='pmpbax'" :key="componentKey"></app-pmpbax>
    <app-pmvdoc v-else-if="pmdata.nowpage=='pmvdoc'" :key="componentKey"></app-pmvdoc>
    <app-pmvoice v-else-if="pmdata.nowpage=='pmvoice'" :key="componentKey"></app-pmvoice>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.card{
  background: white;
  border: 1px solid #dddfe2;
  border-radius: 2px;
  height: 25vh;
  text-align: center;
}
.card img{
  max-width: 100%;
  max-height: 15vh;

}
.smll{
  text-align: left;
  padding-left: 5px;
  line-height: 1.2;
  color: #606770;
}
.her{
  font-size: 20px;
  line-height: 1;
  text-align: left;
  padding-left: 5px;
  font-weight: bold;
  color: #606770;
}
.card_img2 img{
  width: 100%;
}
.card_img3 img{
  height: 100%;
}
.headerSec{
  width:100%;
  padding-bottom: 5px;
  background-color:white;
}
.headerSec > *{
  display:inline-block;
}
.pmcctv_c1{
  padding-left: 9px;
  width: 10%;
  vertical-align: middle;
}
.pmcctv_c2{
  width: 13%;

  padding-top: 5px;
  margin-right: 5px;
}
.headerme{
  font-size: 20px;
}
.brme{
  border: 24px solid orange;
}
.pmcctv_c3{
  vertical-align: middle;
  width: 65%;
  line-height: 1.1;
}
.c1ss{
  width:45%;
  padding-left: 10px;
  vertical-align: middle;
}
.abload{
  z-index: 20;
  position: fixed;
  right: 5px;
  top: 25px;
}
.c2ss{
  width:51%;
  vertical-align: middle;
}
.iadd > img{
  width:80px;
  border: 1px solid gray;
}
.childrow{
  display: table-cell;
}
.childrow > * {
  display: inline-block;
  vertical-align: top;
}
.c111{
  width: 70%;
}
.c112{
  width: 22%;
}
.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.btn {
  border: 2px solid gray;
  color: gray;
  background-color: white;
  padding: 2px 2px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: bold;
  width: 100%;
}

.upload-btn-wrapper input[type=file] {
  font-size: 1px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
.parentsec{

}
.sec1{
  width:79%;
}
.sec2{
  width:20%;
}
</style>

<script>
// eslint-disable-next-line
/* eslint-disable */
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
import pmcctv from '../pm/pmcctv.vue'
import pmpbax from '../pm/pmpbax.vue'
import pmvdoc from '../pm/pmvdoc.vue'
import pmvoice from '../pm/pmvoice.vue'
  export default{
    data () {
      return {
        text: 'fuck',
        componentKey: 0,
        listequipt: []
      }
    },
    components:{
      'app-pmcctv' : pmcctv,
      'app-pmpbax' : pmpbax,
      'app-pmvdoc' : pmvdoc,
      'app-pmvoice' : pmvoice
    },
    mounted() {
      //do something after mounting vue instance
      this.getequipt()
      if(!this.pmdata.location.isset){
        this.getlocation()
      }
    },
    computed:{
      ...mapGetters(['statusLogin','pmdata','restserver'])
    },
    methods: {
      ...mapActions(['set_pmdata']),
      forceRerender() {
        this.componentKey += 1;
      },
      setnowpage: function (page,header,subheader,pictureurl) {
        this.pmdata.nowpage = page
        this.pmdata.focus.header = header
        this.pmdata.focus.subheader = subheader
        this.pmdata.focus.pictureurl = pictureurl
        this.forceRerender()
      },
      getlocation: function () {
        this.loadata = true
        var data = {}
        data.forsure = 'getlocation'
        // console.log(data)
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(this.restserver+'api/getlocation.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          //console.log('r: ', JSON.stringify(r, null, 2))
          var tmp = {}
          tmp.pmtype = 'location'
          tmp.data = r.data
          this.set_pmdata(tmp)
          //console.log(r.data)
          //console.log(this.pmdata);
          this.loadata = false
        })
      },
      getequipt() {
        var data = {}
        data.departID = this.statusLogin.departID
        // console.log(data)
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(this.restserver+'api/getequipt.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          //console.log('r: ', JSON.stringify(r, null, 2))
          console.log(r.data)
          this.listequipt = r.data
        })
      }
    }
  }
</script>
