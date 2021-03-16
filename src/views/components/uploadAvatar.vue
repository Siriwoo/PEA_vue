<template>
  <div class="app-container">
    <div class="file-upload-form">
      กุรณาเลือกไฟล์ :
      <input type="file" @change="previewImage" accept="image/*" multiple class="el-button el-button-primary el-button--mini">
      <el-button type="primary" :loading="flagloading" :disabled="imageData.length > 0 ? false : true" @click="listupload()"><!---->
        <i class="el-icon-upload el-icon-right"></i><span>Upload ALL</span></el-button>
    </div>
    <div class="image-preview" v-if="imageData.length > 0" v-for="(img,index) in imageData" :key="index">
        <img class="preview" :src="img.e.target.result">
        <div class="">
          <el-button type="button" :disabled="flagdisabled" :loading="flagloading" class="el-button el-button--danger el-button--mini" @click="noupthisimg(index)">
            <!----><!----><span>Delete</span></el-button>
        </div>

    </div>
  </div>
</template>

<script>
import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
import axios from 'axios'

export default {
  name: 'upload-avatar',
  data() {
    return {
      flagdisabled: false,
      flagloading: false,
      flagdisabledupload: true,
      activeName: 'directly',
      inputData: 'https://github.com/PanJiaChen/vue-element-admin',
      imageData: [],
      tokenStr:"ya29.GlxxB-jJ_L3QNkMYEQGiDQQ6NhrLXvw_cDtaWYIa-lM4dzpnx_FD72X-d36d0EBs2IQsfD4ALblncP1NI3RIHIlvq_SYqNwnUXeJ9LdL7AJn_UQ87Etwueqd5s1-rA",
      imgscheme: [],
      albumId: 'AGleGm-Gc98aSsA9SGSI_rGFvaDkw_5lvYhfE7fH1zcOScGm9dt_hGuty3xhxvwiGe6bhTOv1OQK'
    }
  },
  methods: {
    successfully() {
        this.$notify({
          title: 'Success',
          message: 'Upload Pictures Successfully',
          type: 'success'
        });
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
          "albumId": this.albumId,
          "newMediaItems": upload_tokens
        }

        axios.post(URL, data, conf).then(res => {
          console.log(res.data)
          this.flagloading = false
          this.successfully()
          this.imageData = []
        });
      }
  }
}
</script>
<style lang="css" scoped>
  .file-upload-form{
    display: block;
    margin-bottom: 5px;
  }
  .image-preview {
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    padding: 5px;
    display: inline-block;
  }
  img.preview {
    width: 200px;
    background-color: white;
    border: 1px solid #DDD;
    padding: 5px;
  }
</style>
