<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>About me</span>
    </div>
    <div :class="[ whoshow=='whoCreate' ? 'inline' : 'newline' ]">
      <div class="">
        <div class="user-profile">
          <div class="box-center" v-if="whoshow==='owner'">
            <pan-thumb :image="avatar" :height="'200px'" :width="'200px'" :hoverable="false">
              <div>Hello</div>
              {{ user.role }}
            </pan-thumb>
          </div>
          <div class="box-center" v-if="whoshow==='whoCreate'">
            <pan-thumb :image="user.baseUrlprofile" :height="'200px'" :width="'200px'" :hoverable="false">
              <div>Hello</div>
              {{ user.role }}
            </pan-thumb>
          </div>
          <div class="box-center">
            <div class="user-name text-center">{{ user.name }}</div>
            <div class="user-role text-center text-muted">{{ user.aboutme }}

            <el-button type="primary" v-if="whoshow==='owner'" icon="upload" style="margin:auto" @click="imagecropperShow=true">
              Profile Picture
            </el-button>
            <image-cropper
              v-show="imagecropperShow"
              :key="imagecropperKey"
              :width="300"
              :height="300"
              url="https://httpbin.org/post"
              lang-type="en"
              @close="close"
              @crop-upload-success="cropSuccess"
            />
            </div>
          </div>

        </div>
        <div class="user-education user-bio-section" mt-2>
          <div class="user-bio-section-header"><svg-icon icon-class="people" /><span>เกี่ยวกับฉัน</span></div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              ......
            </div>
          </div>
        </div>
      </div>

      <div class="user-bio">


        <div class="user-skills user-bio-section">
          <div class="user-bio-section-header"><svg-icon icon-class="user" /><span>ข้อมูลส่วนบุคคล</span></div>
          <div class="user-bio-section-body">
            <div class="p-item">
              <div class="c-bigfont" v-if="whoshow==='owner'">{{userget.empcode}}</div>
              <div class="c-bigfont" v-else>{{user.empcode}}</div>
              <div class="c-smallfont">รหัสพนักงาน</div>
            </div>
            <div class="p-item">
              <div class="c-bigfont" v-if="whoshow==='owner'">{{userget.position}}</div>
              <div class="c-bigfont" v-else>{{user.position}}</div>
              <div class="c-smallfont">ตำแหน่ง</div>
            </div>
            <div class="p-item">
              <div class="c-bigfont" v-if="whoshow==='owner'">{{userget.depart}}</div>
              <div class="c-bigfont" v-else>{{user.depart}}</div>
              <div class="c-smallfont">สังกัด</div>
            </div>
            <div class="p-item">
              <div class="c-bigfont" v-if="whoshow==='owner'">{{userget.tel}}</div>
              <div class="c-bigfont" v-else>{{user.tel}}</div>
              <div class="c-smallfont">เบอร์ติดต่อ</div>
            </div>
            <div class="p-item">
              <div class="c-bigfont" v-if="whoshow==='owner'">{{userget.email}}</div>
              <div class="c-bigfont" v-else>{{user.email}}</div>
              <div class="c-smallfont">email</div>
            </div>
          </div>
        </div>
      </div>
    </div>



  </el-card>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import { uploadpic } from '@/mixins/uploadpic'
import { fetchpic } from '@/mixins/fetchpic'
import PanThumb from '@/components/PanThumb'
import ImageCropper from '@/components/ImageCropper'
import uploadAvatar from '../../components/uploadAvatar'
import { updatepicprofile } from '@/api/user'
import { getUserData } from '@/utils/auth'

export default {
  mixins: [uploadpic,fetchpic],
  data() {
    return {
      imagecropperKey: 0,
      imagecropperShow: false,
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
    user: {
      type: Object,
      default: () => {
        return {
          empcode: '',
          position: '',
          depart: '',
          tel: '',
          name:'',
          email: ''
        }
      }
    },
    whoshow:{
      type: String
    }
  },
  methods: {
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
    //do something after mounting vue instance
    //this.methodName('log me from usercard')
    console.log('mounted in UserCard.vue');
    //console.log('this.whoshow =='+this.whoshow);
    if(this.whoshow=='owner'){
      var udata = JSON.parse(getUserData())
    }if(this.whoshow=='whoCreate'){
      var udata = this.user
      //console.log(this.user);
    }
    console.log(udata);
    this.userget = {
      empcode: udata.empcode,
      position: udata.position,
      depart: udata.depart,
      tel: udata.tel,
      email: udata.email
    }

  }
}
</script>

<style lang="scss">
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
