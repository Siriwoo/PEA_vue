<template>
  <div class="dashboard-editor-container-ff">
    <v-tabs
      v-model="tab"
      centered
      color="#6b3074"
      icons-and-text
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        จองห้อง
        <i class="el-icon-date custom-icon"></i>
      </v-tab>
      <v-tab href="#tab-2">
        ปฏิทิน
        <i class="el-icon-s-order custom-icon"></i>
      </v-tab>
      <v-tab href="#tab-3">
        ประวัติ
        <i class="el-icon-s-order custom-icon"></i>
      </v-tab>

      <v-tab href="#tab-4">
        สถิติ
        <i class="el-icon-s-data custom-icon"></i>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="i in 4"
        :key="i"
        :value="'tab-' + i"
      >
      <bookingsystem v-if="i=='1'" :key="Key_bookingsystem" :event="to_book"/>
      <bookingcalendar v-if="i=='2'" :key="Key_bookingcalendar" @showevent="showevent"/>
      <bookinghistory v-if="i=='3'" :key="Key_bookinghistory" @showedit="showedit"/>
      <bookingstatistic v-if="i=='4'" :key="Key_bookingstatistic"/>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import bookingsystem from './components/bookingsystem.vue'
import bookinghistory from './components/bookinghistory.vue'
import bookingstatistic from './components/bookingstatistic.vue'
import bookingcalendar from './components/bookingcalendar.vue'
import { fetchpic } from '@/mixins/fetchpic'
import { freqmethods } from '@/mixins/freqmethods'
import tooldefault from '@/assets/default/tools.png'
import imgload from '@/assets/loading/loadpic.gif'
import { mapGetters } from 'vuex'
import { getUserData, setUserclick, getUserclick } from '@/utils/auth'

export default {
  name: 'DashboardAdmin',
  mixins: [fetchpic,freqmethods],
  components: {
    bookingsystem,
    bookinghistory,
    bookingstatistic,
    bookingcalendar
  },
  computed: {
    ...mapGetters([
      'roles',
      'locations',
      'equiptype',
      'loadingmainpage',
      'tokenStr'
    ])
  },
  watch:{
    tab(v){
      if(v=='tab-2'){
        this.Key_bookingcalendar++
        console.log(this.Key_bookingcalendar);
      }else if (v=='tab-3') {
        this.Key_bookinghistory++
        console.log(this.Key_bookinghistory);
      }
    },
    bartype(v){
      if(typeof getUserclick() !== 'undefined'){
        var tmp = JSON.parse(getUserclick())
        if(typeof JSON.parse(getUserclick()).dashscheme !== 'undefined'){
          tmp.dashscheme.bartype = v
        }else{
          tmp.dashscheme = {
            bartype:v
          }
        }
        setUserclick(tmp)
        this.loadsumalljob()
        this.querygraph()

      }
    },
    seldatetype(v){
      if(typeof getUserclick() !== 'undefined'){
        var tmp = JSON.parse(getUserclick())
        if(typeof JSON.parse(getUserclick()).dashscheme !== 'undefined'){
          tmp.dashscheme.seldatetype = v
        }else{
          tmp.dashscheme = {
            seldatetype:v
          }
        }
        setUserclick(tmp)
      }

    },
    loadingmainpage(v){
      //console.log(v);
      if(!v){
        //console.log('is here');
        this.queryfirstvalue()
      }
    }
  },
  data() {
    return {
      tab: null,
      text: 'xx',
      seldatetype: '',
      componentKey: 0,
      Key_bookingsystem: 0,
      Key_bookingcalendar: 0,
      Key_bookinghistory: 0,
      Key_bookingstatistic: 0,
      datashowpanel: [],
      is_data_fetched: false,
      equiptypemo: [],
      depart: '',
      allequipt: 0,
      bartype: 'week',
      to_book: '',
      flagloadgraph:{
      }
    }
  },
  mounted() {
    if(!this.loadingmainpage){
      //console.log('again');
      this.queryfirstvalue()
    }
    //do something after mounting vue instance
    //console.log(this.equiptype);
  },
  methods: {
    handleSetLineChartData(type) {
      //console.log(type);
      if(typeof getUserclick() !== 'undefined'){
        var tmp = JSON.parse(getUserclick())
        console.log(tmp);
        if(typeof JSON.parse(getUserclick()).dashscheme !== 'undefined'){
          tmp.dashscheme.typejob = type
        }else{
          tmp.dashscheme = {
            typejob:type
          }
        }
        setUserclick(tmp)
      }
      console.log(this.seldatetype);
      //find between date by bartype


    },
    showevent(e){
      //console.log(e)
      this.to_book = e
      this.to_book.type = 'readonly'
      this.tab = 'tab-1'
      this.Key_bookingsystem+=1
    },
    showedit(e){
      console.log(e)
      this.to_book = e
      this.to_book.type = 'editable'
      this.tab = 'tab-1'
      this.Key_bookingsystem+=1
    },
    loaduserdata(){
      if(typeof JSON.parse(getUserData()).depart !=='undefined' ){
        this.depart = JSON.parse(getUserData()).depart
      }else{
        console.log('no userdata redirect to login page, should not here');
      }

    },
    loadavatarequipt(){
      if(this.equiptype.length>0){
        this.equiptypemo = this.equiptype.filter(c=>{
          //console.log(e.equip.includes("ยังไม่ทราบ"));
          return !c.equip.includes("ยังไม่ทราบ")
        }).map(e=>{

            var tn = ''
            if(e.equip_short!=''){
              tn+=`(${e.equip_short})`
            }
            var o ={}
            var t = ''
            var x = ''
            if(typeof JSON.parse(e.detail).pictures[0] !='undefined'){
              t = JSON.parse(e.detail).pictures[0].picturetoken

            }
            o.equip = e.equip+tn
            o.avatar = imgload
            o.equiptypeID = e.id
            o.meid = t
            return o

        })
        var st = ''
        var up = []
        for (var i = 0; i < this.equiptypemo.length; i++) {
          up.push(this.equiptypemo[i].meid)
        }
        var uq = [...new Set(up)];
        //console.log(uq);
        for (var i = 0; i < uq.length; i++) {
          if(uq[i]!=''){
            st+='mediaItemIds='+uq[i]
            if(i<uq.length-1){
              st+='&'
            }
          }

        }
        this.fetchmultipic(st,this.tokenStr).then(r=>{
          //console.log(r);
          var h = this.equiptypemo.map(e=>{
            var oj = {}
            oj.equip = e.equip
            oj.equiptypeID = e.equiptypeID
            oj.sum = e.sum
            var g = r.mediaItemResults.find(f=>{
              return f.mediaItem.id == e.meid
            })
            //console.log(g);
            if(typeof g!= 'undefined'){
              oj.avatar = g.mediaItem.baseUrl
            }else{
              oj.avatar = tooldefault
            }

            return oj
          })
          this.equiptypemo = h
          var tmp = {
            info: 'saveavatar',
            equiptypeavatar: this.equiptypemo
          }
          this.$store.dispatch('info/commitinfo', tmp)
          console.log(this.equiptypemo);
        })
      }

      //console.log(this.equiptypemo);


    },
    loadsumalljob(){
      //console.log();
      var tmp = {}
      tmp.info = 'sumalljob'
      tmp.param1 = this.optionst.map(e=>{
        var o = {
          value:e.value,
          headvalue:e.value.replace(/\/|-/g, "_")
        }
        return o
      })
      tmp.param2 = {}
      if(typeof JSON.parse(getUserData()).depart !=='undefined' ){
        tmp.param2.depart = JSON.parse(getUserData()).depart
      }else{
        console.log('no userdata redirect to login page, should not here');
      }
      tmp.param2.bartype = this.bartype
      console.log(tmp);
      this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          console.log(r);
          this.datashowpanel = r.data
          this.is_data_fetched =  true
          //this.isloadequiptype = true
          //r= r.data
          //console.log(this.equiptypemo);
          //NProgress.done()
        })
    },
    loadsumallequipt(){
      var em = this.equiptypemo.map(e=>{
        var oj = {
          id:e.equiptypeID,
          equiptype:e.equip
        }
        return oj
      })
      //console.log(em);
      var tmp = {}
      tmp.info = 'sumallequipt'
      tmp.param1 = em
      this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          console.log(r);
          r = r.data
          this.allequipt = 0
          this.equiptypemo = this.equiptypemo.map(e=>{
            var oj = {}
            oj.equip = e.equip
            oj.equiptypeID = e.equiptypeID
            oj.avatar = e.avatar
            oj.meid = e.meid
            oj.sum = r[0][`e${oj.equiptypeID}`]
            this.allequipt+=oj.sum
            return oj
          })
          //this.isloadequiptype = true
          //r= r.data
          //console.log(this.equiptypemo);
          //NProgress.done()
        })
    },
    getuserclick(){
      if(typeof getUserclick() !== 'undefined'){
        var tmp = JSON.parse(getUserclick())
        if(typeof JSON.parse(getUserclick()).dashscheme !== 'undefined'){
          this.bartype = tmp.dashscheme.bartype
          this.seldatetype = tmp.dashscheme.seldatetype
        }
      }
    },
    querygraph(){
      if(typeof JSON.parse(getUserData()).depart !=='undefined' ){
        this.depart = JSON.parse(getUserData()).depart
        var tmp = {
          info: 'datagraph',
          param1: {}
        }
        if(typeof JSON.parse(getUserclick()).dashscheme !=='undefined' ){
          tmp.param1.bartype = JSON.parse(getUserclick()).dashscheme.bartype
        }else{
          tmp.param1.bartype = 'week'
        }
        tmp.param1.depart = this.depart
        this.$store.dispatch('info/loadinfo', tmp)
          .then((r) => {
            console.log(r);
          })
        //tmp.param1.jobtype = 'ติดตั้ง'
        //tmp.param1.seldatetype = 'opendate'
        /*
        this.$store.dispatch('info/loadinfo', tmp).then((r) =>{
          this.flagloadgraph.week.opendate.info = r.data[0]
          this.flagloadgraph.week.opendate.flag = true
        })
        tmp.param1.seldatetype = 'getdate'
        this.$store.dispatch('info/loadinfo', tmp).then((r) =>{
          this.flagloadgraph.week.getdate.info = r.data[0]
          this.flagloadgraph.week.getdate.flag = true
        })
        tmp.param1.seldatetype = 'operation'
        this.$store.dispatch('info/loadinfo', tmp).then((r) =>{
          this.flagloadgraph.week.operation.info = r.data[0]
          this.flagloadgraph.week.operation.flag = true
        })
        tmp.param1.seldatetype = 'finish'
        this.$store.dispatch('info/loadinfo', tmp).then((r) =>{
          this.flagloadgraph.week.finish.info = r.data[0]
          this.flagloadgraph.week.finish.flag = true
        })*/
      }else{
        console.log('no userdata redirect to login page, should not here');
      }
    },
    queryfirstvalue(){
      //this.getuserclick()
      //pthis.loadavatarequipt()
      //this.loadsumallequipt()
      //this.loadsumalljob()
      //this.loaduserdata()

      //this.querygraph()
    }
  }
}
</script>

<style lang="scss">
.dashboard-editor-container-ff{

}

.text {
    font-size: 17px;
}
.custom-icon {
   font-size: 1.5rem;
}
.big_font{
  font-size: 28px;
  font-weight: bold;
  padding-left: 20px;
}

.topic1{
  font-size: 43px;
  float: right;
  font-weight: bold;
}
.topic{
  font-size: 24px;
  float: right;
  font-weight: bold;
}

.suptopic{
  font-size: 22px;
  float: right;
  color: orange
}
.boxtopic{

}
.item {
  padding: 5px 0;
  transition: 0.6s;
  display: flex;
  align-items:center;
}
.item:hover{
  background-color: #eff0f1;
  transition: 0.6s;
}
.box-card {
  width: 100%;
}
.previewfull{
  margin-right: 7px;
  width: 40px;
}
.boxsel{
  padding-bottom: 5px;
}
.suitbox{
  padding-top: 0px;
  padding-right: 15px;
}
.selseh{
  font-size: 13px;
  margin-right: 5px;
  border: 1px solid orange;
  padding: 5px;
  border-radius: 3px;
  transition: all 0.6s;
  color: orange;
}
.selseh:hover{
  background-color: orange;
  color: white;
  transition: all 0.6s;
  cursor: pointer;
}

.selseh_f{
  font-size: 13px;
  background-color: orange;
  color: white;
  padding: 5px;
  border: 1px solid orange;
  border-radius: 3px;
  transition: all 0.6s;
}
.dashboard-editor-container-ff {
  .v-slide-group__next, .v-slide-group__prev{
    display: none !important;
  }
  width: 1000px;
  margin: auto;
  padding: 0px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
@media (max-width:768px) {
  .big_font{
    font-size: 24px;
    font-weight: bold;
    padding-left: 20px;
  }
  .text {
      font-size: 15px;
  }
  .previewfull{
    margin-right: 7px;
    width: 35px;
  }
  .topic1{
    font-size: 37px;
    float: right;
    font-weight: bold;
    padding-right: 6px;
  }
  .topic{
    font-size: 17px;
    float: right;
    font-weight: bold;
  }

  .suptopic{
    font-size: 14px;
    float: right;
    color: orange
  }
  .dashboard-editor-container-ff{
    .v-slide-group__next, .v-slide-group__prev{
      display: none !important;
    }
    width: 100%;
    padding: 0px;
    background-color: #f0f2f5;
    position: relative;
    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
  .suitbox{
    padding-top: 0px;
    padding-right: 0px;
  }
}
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
