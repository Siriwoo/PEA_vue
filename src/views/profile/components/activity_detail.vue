<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>Activity Detail</span>
    </div>
    <div class="newline"  v-if="scheme!=='meetingbooking'">
      <div class="">
        <div class="user-education user-bio-section" mt-2>
          <div class="user-bio-section-header"><svg-icon icon-class="nested" /><span>เลือกหน่วยงาน</span></div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              <v-select
                v-model="depart_view"
                :items="depart_can_view"
                dense
                multiple
                outlined
                hide-details
                class="ma-2"
                label="หน่วยงาน"
              >
              <template v-slot:selection="{ item, index }">
              <v-chip v-if="1 == 1">
                <span>{{ item}}</span>
              </v-chip>
              <span
                v-else
                class="grey--text caption"
              >(+{{ depart_view.length - 2 }} others)</span>
            </template>
            </v-select>
            </div>
          </div>
        </div>
      </div>

      <div class="user-bio">
        <div class="user-skills user-bio-section">
          <div class="user-bio-section-header"><svg-icon icon-class="user" />
            <span>เลือกบุคคล(เว้นวางเพื่อเลือกดูทุกคน)</span>
            <v-progress-circular
              v-if="loadpersons"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <div class="user-bio-section-body">
            <v-select
              v-model="person_view"
              :items="person_can_view"
              dense
              outlined
              multiple
              hide-details
              class="ma-2"
              label="บุคคล"
            >
            <template v-slot:selection="{ item, index }">
            <v-chip v-if="1 == 1">
              <span>{{ item}}</span>
            </v-chip>
          </template>
          </v-select>
          </div>
          <div class="boxbot">
            <v-btn class="ma-2" tile outlined color="success" @click="cast_activity_detail">
               <svg-icon icon-class="search" />Search
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="" v-else>
      Activity Detail of bookingscheme coming soon....
    </div>


  </el-card>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import { uploadpic } from '@/mixins/uploadpic'
import { fetchpic } from '@/mixins/fetchpic'
import {freqmethods} from '@/mixins/freqmethods'
import PanThumb from '@/components/PanThumb'
import ImageCropper from '@/components/ImageCropper'
import uploadAvatar from '../../components/uploadAvatar'
import { updatepicprofile } from '@/api/user'
import { getUserData,getUserclick,getUserActivity  } from '@/utils/auth'

export default {
  mixins: [uploadpic,fetchpic,freqmethods],
  data() {
    return {
      scheme: '',
      depart_view: [],
      depart_can_view: [],
      person_view: [],
      person_can_view: [],
      imagecropperKey: 0,
      imagecropperShow: false,
      loadpersons: false,
      srcprofile: '',
      userget:{
        empcode: '',
        position: '',
        depart: '',
        tel: '',
        email: ''
      }
    }
  },
  watch:{
    person_view(f){
      this.getandsetUserclick('calendar_person_view',f)
      /*console.log(f);
      if(f[f.length-1]=='ทุกคน'&&f.length!=1){
        this.person_view = []
        this.person_view[0] = 'ทุกคน'
      }else{
        this.person_view = this.person_view.filter(i => i !== 'ทุกคน')
      }*/
    },
    depart_view(f){
      this.getandsetUserclick('calendar_depart_view',f)
      this.load_depart_view(f)
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'tokenStr'
    ])
  },
  components: {
    ImageCropper,
    PanThumb,
    uploadAvatar
   },
  props: {
  },
  methods: {
    cast_activity_detail(){
      let p = {
        depart_view:this.depart_view,
        person_view:this.person_view
      }
      this.$emit('activity_detail',p)
    },
    load_depart_view(f){
      if(f.length>0){
        this.loadpersons = true
        var tmp = {}
        tmp.info = 'loadIDdepart'
        tmp.param1 = f
        this.$store.dispatch('info/loadinfo', tmp)
          .then((r) => {
            //console.log(r);
            if(r.data.length>0){
              tmp.info = 'loadUserfromIDdepart'
              tmp.param1 = r.data
              this.$store.dispatch('info/loadinfo', tmp)
                .then((r) => {
                  console.log(r);
                  if(r.data.length>0){
                    let sv = []
                    //let d = 'ทุกคน'
                    sv = r.data.map(e=>{
                      return `(${e.username})${e.prename} ${e.name} ${e.lastname}`
                    })
                    //sv.unshift(d);
                    this.person_can_view = sv
                    this.loadpersons = false
                  }
                })
            }
          })
      }
    },
    queryfirstvalue(){
      let v = JSON.parse(getUserActivity())
      this.scheme = v.scheme
      if(v.scheme=="meetingbooking"){

      }else{
        this.loadallcanview()
        this.loadviewparam()
        this.cast_activity_detail()
      }


    },
    loadallcanview(){
      let v = JSON.parse(getUserData()).viewer
      let c = JSON.parse(getUserclick())
      console.log('getUserclick in loadallcanview');
      console.log(c);
      let sv = v.split(',')
      if(sv.length>0){
        let d = JSON.parse(getUserData()).depart
        if(!sv.includes(d)){
          sv.unshift(d);
        }
        this.depart_can_view = sv
      }else{
        this.depart_can_view[0] =  JSON.parse(getUserData()).depart
      }
      this.depart_can_view = this.depart_can_view.filter(i => i !== '')
      console.log(this.depart_can_view);
    },
    loadviewparam(){
      let d = JSON.parse(getUserclick()).calendar_depart_view
      let p = JSON.parse(getUserclick()).calendar_person_view
      let f = []
      f[0] = JSON.parse(getUserData()).depart
      if(typeof d =='undefined'){
        this.depart_view = this.getandsetUserclick('calendar_depart_view',f)
      }else{
        this.depart_view = d
      }
      if(typeof p =='undefined'){
        this.person_view = this.getandsetUserclick('calendar_person_view',[])
      }else{
        this.person_view = p
      }
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      //this.image = resData.files.avatar
      var mediaId = resData.newMediaItemResults[0].mediaItem.id
      var iduser = JSON.parse(getUserData()).id
      //console.log(iduser);
      //console.log(mediaId);
      var tmp = {
        iduser:iduser,
        mediaId:mediaId
      }
      updatepicprofile(tmp)
      this.fetchpic(mediaId,this.tokenStr).then(r=>{

        var baseUrl = r.baseUrl
        //console.log(baseUrl);
        store.dispatch('globalvar/getprofileurl', baseUrl)
      })
      //this.updatepicprofile()

    },
    close() {
      this.imagecropperShow = false
    }
  },
  created() {
    //do something after creating vue instance
    //console.log('create card');
  },
  mounted() {
    this.queryfirstvalue()

  }
}
</script>

<style lang="scss">
.boxbot{
  display: flex;
  justify-content: center;
}
@media (max-width:768px) {
  .el-card__body {
    padding: 7px;
  }
  .inline {
    width: 96% !important;
  }
  .inline > * {
    display:block !important;
  }
}
.inline {
  width: 600px;
}
.inline > * {
  display:inline-block;
}
.newline > * {
  display:block;
}
.boximgcrop{
  display: inline;
  margin: auto;
}
.c-smallfont{
  font-size: 11px;
  margin-top: 3px;
}
.c-bigfont{
  font-size: 17px;
}
.p-item{
  margin-top: 3px;
  margin-bottom: 11px;
}
 .box-center {
   margin: 0 auto;
   display: table;
 }

 .text-muted {
   color: #777;
 }

 .user-profile {
   .user-name {
     font-weight: bold;
   }

   .box-center {
     padding-top: 10px;
   }

   .user-role {
     padding-top: 10px;
     font-weight: 400;
     font-size: 14px;
   }

   .box-social {
     padding-top: 30px;

     .el-table {
       border-top: 1px solid #dfe6ec;
     }
   }

   .user-follow {
     padding-top: 20px;
   }
 }

 .user-bio {
   margin-top: 20px;
   color: #606266;

   span {
     padding-left: 4px;
   }

   .user-bio-section {
     font-size: 14px;
     padding: 15px 0;

     .user-bio-section-header {
       border-bottom: 1px solid #dfe6ec;
       padding-bottom: 10px;
       margin-bottom: 10px;
       font-weight: bold;
     }
   }
 }
</style>
