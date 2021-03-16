import store from '@/store'
const axios = require('axios');
export const uploadpic = {
  data (){
    return{
      albumIds:{
        avatar:'AGleGm89cgk7GB1Kc2_r2m8J44sgEOY7AQaKmlj6M0Qt0tnX3DuhnVr8ste-ZGbciYOT9EIYtUfC',
        pea_pm:'AGleGm_qmeqcYexS5EemPtjX67HqGXBGC_8pT2lVAjq8t8ap455boEUIICq5JHvqwFZS49qdiocJ',
        pea_publisher:'AGleGm9Gvq4tExxyDl9SLDdpd7iGMXN5y71psEaCCslw2UxlvSkquwIMFXyBs0XTTbyMtetprwbu'
      },
      flagloading:false
    }
  },
  created() {
    //do something after creating vue instance
    //console.log('hello i am mixin');
    //console.log(this.tokenStr);
  },
  methods: {
    successfully() {
        this.$notify({
          title: 'Success',
          message: 'Upload Pictures Successfully',
          type: 'success'
        });
    },
    uploadSinglepic(acceptedFiles,filename,albumId) {
      //console.log(acceptedFiles.files);
      //console.log('com here pic');
      var reader = new FileReader();
      // Define a callback function to run, when FileReader finishes its job
      let file = acceptedFiles;

      //console.log(file.name);
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        console.log(this.tokenStr);

        //const arrayStr = reader.result;
        const arrayStr = acceptedFiles
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

                    //console.log(response.data)
                    var albumKey = albumId
                    albumId = this.albumIds[albumId]
                    this.uploadtogoogle(response.data,albumId,albumKey)

                }
                // Start the reader job - read file as a data url (base64 format)
                reader.readAsDataURL(acceptedFiles);

        }).catch(function (error) {
                console.log(error);
        }.bind(this));
      }
    },
    uploadtogoogle(uploadtoken,albumId,albumKey) {
      this.flagloading = true
      //console.log('upload');
      var upload_tokens = [{
          //"description": "testupload api",
          "simpleMediaItem": {
            "uploadToken": uploadtoken
          }
        }]
      const URL = 'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate'
      let conf = {
      headers: {
          "Authorization": `Bearer ${this.tokenStr}`,
          "Content-type": 'application/json'
        }
      }

      let data = {
        "albumId": albumId,
        "newMediaItems": upload_tokens
      }

      axios.post(URL, data, conf).then(res => {
        console.log(res.data)
        this.flagloading = false
        if(albumKey==='avatar'){
          let that = this
          that.$emit('crop-upload-success', res.data)
        }
        this.successfully()
      });
    },
    dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
      else
          byteString = unescape(dataURI.split(',')[1]);
      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], {type:mimeString});
    },
    getPicture(){

    }
  }
}
