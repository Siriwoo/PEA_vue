import { mapGetters } from 'vuex'
import avatar from '@/assets/toppup/avatar.png'
const axios = require('axios');
export const fetchpic = {
  data (){
    return{

    }
  },
  computed: {
    ...mapGetters(['tokenStr'])
  },
  created() {
    //do something after creating vue instance
    //console.log('hello i am fetchpic mixins');
    //console.log(this.tokenStr)
  },
  methods: {
    fetchpic(mediaID,authtoken) {
      return new Promise(reslove =>{
        //console.log(authtoken);
        var URL = 'https://photoslibrary.googleapis.com/v1/mediaItems/'
        URL+=mediaID
        let conf = {
        headers: {
            "Authorization": `Bearer ${this.tokenStr}`,
            "Content-type": 'application/json'
          }
        }
        axios.get(URL, conf).then(res => {
          reslove(res.data)
        }).catch(e=>{
          console.log(e);
        })
      })
    },
    fetchpictimeline(l){
      var picprofile = l.map(function(value) {
        return value.picprofile;
      });
      for (var i = 0; i < this.liststory.length; i++) {
        this.liststory[i].baseUrlprofile = avatar
      }
      var uniq_picprofile = [...new Set(picprofile)];
      var st = ''
      for (var i = 0; i < uniq_picprofile.length; i++) {
        //console.log(uniq_picprofile);
        if(uniq_picprofile[i]!=""){
          st+='mediaItemIds='+uniq_picprofile[i]
          if(i!=uniq_picprofile.length-1){
            st+='&'
          }
        }
      }
      this.fetchmultipic(st,this.tokenStr).then(r=>{
        //console.log(r);
        var im = r.mediaItemResults.map(obj =>{
           var rObj = {
            id:obj.mediaItem.id,
            result:obj.mediaItem.baseUrl
           };
           return rObj;
        });
        for (var i = 0; i < this.liststory.length; i++) {
          //console.log(this.timeline[i].picprofile);
          const found = im.find(({id}) => id == this.liststory[i].picprofile);
          //console.log(found);
          if(typeof found !== 'undefined'){
            this.liststory[i].baseUrlprofile = found.result
          }else{
            this.liststory[i].baseUrlprofile = avatar
          }
          this.liststory.push([])
          this.liststory.splice(-1,1)
          //
        }
        console.log('fetch รูปโปรไฟล์ '+this.liststory.length+' รายการ สำเร็จ');
        //console.log(this.liststory);


        //console.log(this.srcList);
      })
    },
    fetchmultipic(mediaID,authtoken) {
      return new Promise(reslove =>{

        var URL = 'https://photoslibrary.googleapis.com/v1/mediaItems:batchGet?'
        URL+=mediaID
        let conf = {
        headers: {
            "Authorization": `Bearer ${authtoken}`,
            "Content-type": 'application/json'
          }
        }
        if(mediaID!==''){
          //console.log(mediaID);
          axios.get(URL, conf).then(res => {
            reslove(res.data)
          }).catch(e=>{
            this.$message.error('ติดต่อ google photo ไม่ได้ กรุณา refresh');
          })
        }else{
          //this.$message.error('กรุณาเพิ่มรูปประจำอุปกรณ์');
        }

      })
    }
  }
}
