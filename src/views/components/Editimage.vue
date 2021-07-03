<template>
  <div class="app-containerimg">

    <div class="image-preview" v-if="uploadedimg.length > 0" v-for="(img,index) in uploadedimg">
      <div class="containerup">
        <div class="demo-image__preview">
          <el-image
            style="width: 200px;"
            :previewSrcList="srcList"
            :src="img.e.target.result"
            @click='startimg(img.e.target.result)'
            >
          </el-image>
        </div>

        <!--<img class="preview" :src="img.e.target.result" @click="dialogfullimage=true">-->
        <div class="top-left"><i class="el-icon-check"></i></div>
      </div>
    </div>
    <div class="image-preview" v-if="imageData.length > 0" v-for="(img,index) in imageData" :key="index">
        <img class="preview" :src="img.e.target.result" >

        <div class="">
          <el-button type="button" :disabled="flagdisabled" :loading="flagloading" class="el-button el-button--danger el-button--mini" @click="noupthisimg(index)">
            <!----><!----><span>Delete</span></el-button>
        </div>

    </div>
    <div class="file-upload-form" v-if="imagedetail.actscheme!='view'">

      <div class="">
        <input type="file" @change="previewImage" accept="image/*" :multiple="imagedetail.masterscheme!=='chatbot'" class="el-button el-button-primary el-button--mini">
        <div class="">
          กุรณาเลือกรูป:<span class="s_c_grey">(ชื่อรูปต้องเป็นภาษาอังกฤษ)</span>
        </div>
        <el-button type="primary" :loading="flagloading" :disabled="imageData.length > 0 ? false : true" @click="listupload()"><!---->
          <i class="el-icon-upload el-icon-right"></i><span>Upload ALL</span></el-button>
      </div>

    </div>

    <el-dialog
      title=""
      :visible.sync="dialogfullimage"
      fullscreen
      >
      <el-carousel
      indicator-position="outside"
      trigger="click"
      height="700px"
      :interval="40000"
      >
        <el-carousel-item v-for="(img,index) in uploadedimg" >
          <div class="blockimgcarousel">
            <img class="previewfull" :src="img.e.target.result" width="100%">
          </div>
        </el-carousel-item>
      </el-carousel>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogfullimage = false">OK</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
import axios from 'axios'
import { uploadpic } from '@/mixins/uploadpic'
import { fetchpic } from '@/mixins/fetchpic'
import { mapGetters } from 'vuex'
import imgload from '@/assets/loading/tenor.gif'

export default {
  name: 'Imageupload',
  mixins: [uploadpic,fetchpic],
  props: ['imagedetail','infoelem'],
  data() {
    return {
      dialogfullimage: false,
      flagdisabled: false,
      flagloading: false,
      flagdisabledupload: true,
      activeName: 'directly',
      inputData: 'https://github.com/PanJiaChen/vue-element-admin',
      imageData: [],
      uploadedimg: [],
      imgscheme: [],
      mediaid:[],
      albumId: 'AGleGm-Gc98aSsA9SGSI_rGFvaDkw_5lvYhfE7fH1zcOScGm9dt_hGuty3xhxvwiGe6bhTOv1OQK',
      srcList: []
    }
  },
  computed: {
    ...mapGetters([
      'tokenStr'
    ])
  },
  mounted() {
    //do something after mounting vue instance
    console.log('++++++this.imagedetail++++++');
    console.log(this.imagedetail);
    console.log('----------------------------');

    /*console.log('++++++++++this.index++++++++');
    console.log(this.infoelem);
    console.log('----------------------------');*/
    if(typeof this.imagedetail.list !=='undefined'){
      if(this.imagedetail.list.length>0){
        var im = this.imagedetail.list.map(obj =>{//lazyloading
           var rObj = {
             e:{
               target:{
                 result:imgload
               }
             }
           };
           return rObj;
        });
        this.uploadedimg = im

        var st = ''
        for (var i = 0; i < this.imagedetail.list.length; i++) {
          st+='mediaItemIds='+this.imagedetail.list[i].picturetoken
          if(i!=this.imagedetail.list.length-1){
            st+='&'
          }
        }
        //console.log(st);
        this.fetchmultipic(st,this.tokenStr).then(r=>{
          console.log(r);
          var im = r.mediaItemResults.map(obj =>{
             var rObj = {
               e:{
                 target:{
                   result:obj.mediaItem.baseUrl+'=w2048-h1024'
                 }
               }
             };
             return rObj;
          });
          this.uploadedimg = im

          //console.log(this.srcList);
        })
      }
    }

  },
  methods: {
    startimg: function (f) {

      console.log('re order to start image that click');
      const i = this.uploadedimg.findIndex(img=>img.e.target.result ===f)
      console.log(i);
      var ts = this.uploadedimg
      var p1 = ts.slice(0,i);
      var p2 = ts.slice(i);
      var p3 = p2.concat(p1)
      this.srcList = p3.map(img=>{
        return img.e.target.result
      })
      //console.log(this.srcList);
      //console.log(this.uploadedimg);
      //console.log(f);
      //console.log('this.uploadedimg');

    },
    previewImage: function(event) {
            // Reference to the DOM input element
            var input = event.target;
            // Ensure that you have a file before attempting to read it
            //console.log(input.files);

            for (var i = 0; i < input.files.length; i++) {
              if (input.files && input.files[i]) {
                  // create a new FileReader to read this image and convert to base64 format

                  this.uploadFile(input.files[i])
              }
            }
      },
      uploadFile(acceptedFiles) {
        //console.log(acceptedFiles.files);
        var reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        let file = acceptedFiles;
        let filename = file.name;
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {

          const arrayStr = reader.result;
          //console.log(this.tokenStr);
          axios.post('https://photoslibrary.googleapis.com/v1/uploads',
              arrayStr
              , { withCredentials: true,
                timeout: 10000,
                  headers: {
                    "Authorization": `Bearer ${this.tokenStr}`,
                    "Content-type": 'application/octet-stream',
                    "X-Goog-Upload-File-Name": `${filename}`,
                    "X-Goog-Upload-Protocol": 'raw',
                    'Access-Control-Allow-Origin': '*'
                  },

              }
          ).then((response) => {
                  //console.log(response);
                  reader.onload = (e) => {
                      var imgtmp = {}
                      imgtmp.uploadtoken = response.data
                      imgtmp.e = e
                      if(this.imagedetail.masterscheme=='chatbot'){

                        this.imageData = []
                      }
                      this.imageData.push(imgtmp);
                  }
                  // Start the reader job - read file as a data url (base64 format)
                  reader.readAsDataURL(acceptedFiles);

          }).catch(function (error) {
                  console.log(error);
          }.bind(this));
        }
      },
      noupthisimg(delid){
        this.imageData.splice(delid, 1)
        //console.log(imageData);
      },
      listupload() {
        this.flagloading = true
        console.log('upload');
        var upload_tokens = []
        for (var i = 0; i < this.imageData.length; i++) {
          //console.log(this.imageData[i]);
          var tmp = {
              //"description": "testupload api",
              "simpleMediaItem": {
                "uploadToken": this.imageData[i].uploadtoken
              }
            }
          upload_tokens.push(tmp)
        }
        const URL = 'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate'
        let conf = {
        headers: {
            "Authorization": `Bearer ${this.tokenStr}`,
            "Content-type": 'application/json'
          }
        }

        let data = {
          "albumId": this.imagedetail.albumid,
          "newMediaItems": upload_tokens
        }

        axios.post(URL, data, conf).then(res => {
          console.log(res.data)
          this.flagloading = false
          this.successfully()
          if(this.imagedetail.masterscheme=='chatbot'){
            this.uploadedimg = this.imageData
          }else{
            this.uploadedimg = this.uploadedimg.concat(this.imageData)
          }
          this.mediaid = this.mediaid.concat(res.data.newMediaItemResults)
          this.mediaid[0].masterinfo = this.infoelem
          //console.log(this.uploadedimg);

          this.$emit('listendata', this.mediaid)
          this.imageData = []
        });
      }
  }
}
</script>
<style lang="css" scoped>
.app-containerimg{
  padding: 4px;
}
.containerup{
  position: relative;
  text-align: center;
}
.blockimgcarousel{
  text-align: center;
}
.s_c_grey{
  font-size: 13px;
  color: #e91e63;

}
.el-image-viewer__canvas img{
  width: auto !important;
  height: 100% !important;
  max-height: 95vh !important;
  max-width: 95vw !important;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item {
    background-color: black;
  }

.top-left {
  position: absolute;
  top: 8px;
  left: 16px;
  background-color: green;
  color:white;
}
  .file-upload-form{
    display: flex;
    margin-bottom: 5px;
  }
  .file-upload-form > *{
    line-height: 1.3;
  }
  .image-preview {
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    padding: 5px;
    display: inline-block;
  }
  img.preview {
    width: 200px;
    background-color: white;
    margin: auto;
    border: 1px solid #DDD;
    padding: 5px;
  }
  img.previewfull {
    height: 700px;
    width:auto;
    background-color: white;
    margin: auto;
    border: 1px solid #DDD;
    padding: 5px;
  }
</style>
