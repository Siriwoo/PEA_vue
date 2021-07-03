<template>
  <div class="app-container-lise">

    <v-list
        :disabled="disabled"
        :dense="dense"
        two-line
        :shaped="shaped"
        :flat="flat"
        :subheader="subheader"
        :sub-group="subGroup"
        :nav="nav"
        :avatar="avatar"
        :rounded="rounded"
      >
        <v-list-item-group v-model="item" color="primary">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :inactive="inactive"
          >
            <v-list-item-content @click="confirmdetail(item)">
              <v-list-item-title v-html="item.title"></v-list-item-title>
              <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>


  </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import { toggleClass } from '@/utils'
import avatar from "@/assets/toppup/avatar.png"
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import { getUserData, setUserclick, getUserclick } from '@/utils/auth'
import {frefucqr} from '@/views/qrcodescheme/mixins/frefucqr'



export default {
  name: 'Theme',
  mixins: [frefucqr],
  components: {

  },
  props:['typepickprofile','tru_schemedo','moredetail'],
  data() {
    return {
      user: {},
      errorlist: [],
      modal_date: '',
      modal_start: '',
      modal_end: '',
      theme: false,
      avatar_wh: '',
      enav: 6,
      componentKey: 0,
      inputscheme: {
        workordercode: '',
        time_start: '',
        time_end: '',
        date: '',
        worknoted: ''
      },
      item: 5,
      items: [
        {
          title: 'Brunch this weekend?',
          subtitle: "Ali Connors &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
        }
      ],
      disabled: false,
      dense: false,
      shaped: false,
      flat: false,
      subheader: false,
      inactive: false,
      subGroup: false,
      nav: false,
      avatar: false,
      rounded: false,
    }
  },
  watch: {

  },
  methods: {
    queryfirstvalue(){
      //get all name of qr_warehouse_profile
      this.load_qr_warehouse_profile()

    },
    confirmdetail(input){
      this.$emit('clickPickProfileTable', input)
    },
    async load_qr_warehouse_profile(){
      var tmp = {}
      if(this.typepickprofile=='profile'){
        tmp.info = 'load_qr_warehouse_profile'
      }else{
        tmp.info = 'load_all_car'
      }


      //var x = JSON.parse(getUserclick()).viewscheme.office
      tmp.param1 = {}
      var r = await this.$store.dispatch('info/loadinfo', tmp)
      console.log(r);
      this.items = r.data.map(e=>{
        let ne = {}
        ne = {
          id: e.id
        }
        if(this.typepickprofile=='profile'){
          let o = JSON.parse(e.tool_in_warehouse)
          ne.title = e.nameprofile
          ne.subtitle = `จำนวน ${o.length} รายการ`
          ne.details = o
        }else{
          ne.title = e.name1
          ne.subtitle = e.name2
          ne.codecar = e.codename
        }
        return ne
      })
      return r
    }

  },
  mounted() {
    //do something after mounting vue instance
    console.log('Hi from mounted');
    if(!this.loadingmainpage){
      console.log('pick_profile_table');
      //console.log(this.focuswarehouse);
      this.queryfirstvalue()
    }
  }
}
</script>

<style scoped>
.field-label{
  vertical-align: middle;
}
.box-card {
  width: 400px;
  max-width: 100%;
  margin: 20px auto;
}
.det-box1{
  position: absolute;
  top: 8px;
  left: 18px;
  font-size: 14px;
}
.det-box2{
  position: absolute;
  top: 30px;
  left: 18px;
  font-size: 24px;
}
.det-box3{
  position: absolute;
  top: 54px;
  left: 18px;
  font-size: 12px;
}
.block {
  padding: 30px 24px;
}
.box-name2{
  margin-bottom: 5px;
  padding-left: 5px;
}
.tag-item {
  margin-right: 15px;
}
.box-card {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.app-container-lise{

}
.box-card-nav{
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #fff;
  overflow: hidden;
  color: #626b7d;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  padding: 6px;
  font-size: 13px;

}
</style>
