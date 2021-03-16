import store from '@/store'
const axios = require('axios');

import { getToken, setUserclick,setToken, removeToken, setUserData, getUserData,getUserclick } from '@/utils/auth'
export const freqmethods = {
  data (){
    return{
      xweek: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
      xmonth: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.','ส.ค.','ก.ย.','ต.ค','พ.ย.','ธ.ค.'],
      albumIds:{
        avatar:'AGleGm89cgk7GB1Kc2_r2m8J44sgEOY7AQaKmlj6M0Qt0tnX3DuhnVr8ste-ZGbciYOT9EIYtUfC',
        pea_pm:'AGleGm_qmeqcYexS5EemPtjX67HqGXBGC_8pT2lVAjq8t8ap455boEUIICq5JHvqwFZS49qdiocJ',
        pea_publisher:'AGleGm9Gvq4tExxyDl9SLDdpd7iGMXN5y71psEaCCslw2UxlvSkquwIMFXyBs0XTTbyMtetprwbu',
        pea_history:'AGleGm9DOWLdPgfVWPuyiosmb2mvnFz19HUaByeHUv4TqEc1qmOhgDSm22iIkFudoEPAb-hYdlim'
      },
      equiptall:[],
      isloadallequipttype: false,
      loadinguser: false,
      optionsuser: [],
      optionst: [
        {value: 'ข้อมูล',label: 'ข้อมูล'},
        {value: 'ซ่อม/แก้ไข/ปรับปรุง',label: 'ซ่อม/แก้ไข/ปรับปรุง'},
        {value: 'บำรุงรักษา',label: 'บำรุงรักษา'},
        {value: 'ติดตั้ง',label: 'ติดตั้ง'},
        {value: 'ย้าย',label: 'ย้าย'},
        {value: 'รื้อถอน',label: 'รื้อถอน'},
        {value: 'ยุบสภาพ',label: 'ยุบสภาพ'},
        {value: 'Event',label: 'Event'},
        {value: 'อบรมการใช้งาน',label: 'อบรมการใช้งาน'},
        {value: 'ขออนุมัติ',label: 'ขออนุมัติ'}],
      /*optionhis:[
        {value: 'อุปกรณ์',label: 'อุปกรณ์'},
        {value: 'ช่วงเวลา',label: 'ช่วงเวลา'},
        {value: 'สถานที่',label: 'สถานที่'}
      ],*/
      optionhis:[
        {value: 'เจาะจงอุปกรณ์',label: 'เจาะจงอุปกรณ์'},
        {value: 'ภาพรวม',label: 'ภาพรวม'}
      ]
    }
  },
  created() {
    //do something after creating vue instance
    //console.log('hello i am mixin');
    //console.log(this.tokenStr);
  },
  computed:{
    cdatetostr(v){
      return this.datetostr(v)
    }
  },
  methods: {
    loadequiptype(){
      console.log('+++loadequiptype++');
      //NProgress.start()
      console.log(this.defaultdepart());
      console.log('ishere');
      var tmp = {}
      tmp.info = 'equiptype'
      tmp.param1 = this.defaultdepart()
      this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          var ddpart = {
            admin: this.defaultdepart()
          }
          console.log(ddpart);
          this.$store.dispatch('info/loadallequipttype', ddpart)
            .then((r) => {
              console.log(r);
              this.isloadequiptype = true
              //NProgress.done()
              console.log('+++loadequiptype++');
            })
            .catch((e) => {
              console.log(e);
              //NProgress.done()
            })

          //r= r.data
          //console.log(r);
          //NProgress.done()
        })
    },
    getandsetUserclick(k,v){
      //k is key
      //v is value
      if(typeof getUserclick() !== 'undefined'){
        var tmp = JSON.parse(getUserclick())
        tmp[k] = v
        setUserclick(tmp)
        return v
      }else{
        return 'no object getUserclick'
      }
    },
    cropdepart(v,want){
      var path = v
      console.log(v);
      if(v.includes("กฟย")){
        //อยู่ กฟย
        this.typeoffice = 'กฟย'
      }else if (v.includes("กฟส")) {
        //อยู่ กฟส
        let t = path.split(" ");
        path = t.slice(1, t.length).join(" ")
        this.typeoffice = 'กฟส'
        //path = t3.join(" ") + " ";
      }else{
        //อยู่ จุดรวมงาน
        this.typeoffice = 'จุดรวมงาน'
      }

      var split = path.split(" ");
      if(want == "just_view"){
        path = split.slice(0, split.length - 1).join(" ") + " "; //เอาคำว่า รผก ออก
      }

      return path
    },
    trimq(str) {
      //remove first quoate and last
      var result = str.slice(1,-1);
      return result
    },
    getEventColor (event) {
      return event.color
    },
    getTypehistoryColor(e){
      var c
      if(e=='ซ่อม/แก้ไข/ปรับปรุง'){
        c = 'orange'
      }else if (e=='ติดตั้ง') {
        c = 'indigo'
      }else if (e=='บำรุงรักษา') {
        c = 'cyan'
      }else if (e=='ย้าย') {
        c = 'pink'
      }else if (e=='รื้อถอน') {
        c = 'purple'
      }else if (e=='ยุบสภาพ') {
        c = '#673AB7'
      }else if (e=='Event') {
        c = 'teal'
      }else if (e=='อบรมการใช้งาน') {
        c = '#795548'
      }else {
        c = 'deep-purple'
      }
      return c
    },
    formatDate (a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`
    },
    valifydate(t){
      var s = t.split("-");
      if(s[1].length!=2){
        s[1] = '0'+s[1]
      }
      if(s[2].length!=2){
        s[2] = '0'+s[2]
      }
      return `${s[0]}-${s[1]}-${s[2]}`
    },
    valifytime(t){
      var s = t.split(":");
      if(s[0].length!=2){
        s[0] = '0'+s[0]
      }
      if(s[1].length!=2){
        s[1] = '0'+s[1]
      }
      return `${s[0]}:${s[1]}`
    },
    remote_query_user(query) {
      if (query !== '') {
        this.loadinguser = true;
        var tmp = {}
        tmp.info = 'loaduserbyquery'
        tmp.param1 = this.trunwordq(query)
        this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          this.loadinguser = false;
          this.optionsuser = r.data.map(obj=>{
            var robj = {
              value:`${obj.username}`,
              label:`(${obj.username})${obj.prename} ${obj.name} ${obj.lastname}`
            }
             return  robj
          })
          console.log(r);
        })
      } else {
          this.optionsuser = [];
        }
    },
    trunwordq(q){
      return q.replace(/ /gi, "%");
    },
    abouttime(info,p2){
      var d = new Date()
      if(info=='NowShift'){

        var n = d.getHours()
        var ks = {
          k1:false,
          k2:false,
          k3:false,
        }
        console.log(p2);
        if(p2=='จุดรวมงาน'){
          if(n>=0&&n<8){
            ks.k1 = true
          }else if (n>=8&&n<16) {
            ks.k2 = true
          }else if (n>=16&&n<=23) {
            ks.k3 = true
          }
        }else {
          if(n>=0&&n<17){
            ks.k1 = true
          }else if (n>=17&&n<=23) {
            ks.k2 = true
          }
        }

        return ks
      }
    },
    datetostr(v){
      if(v=='now'){
        var now = new Date();
      }else{
        var now = new Date(v);
      }
      var thday = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัส","ศุกร์","เสาร์"]
      var thmonth = ["มกราคม","กุมภาพันธ์","มีนาคม",
          "เมษายน","พฤษภาคม","มิถุนายน", "กรกฎาคม","สิงหาคม","กันยายน",
          "ตุลาคม","พฤศจิกายน","ธันวาคม"]
      var tmp = 0+now.getYear()+543
      var tmp2 = tmp+''
      var tmp3 = tmp2.substr(1, 3);
      return `${thday[now.getDay()]} ${now.getDate()}, ${thmonth[now.getMonth()]} ${tmp3}`
    },
    notierror(v){
      this.$message.error(v);
    },
    notisuccess(v){
      this.$message.success(v);
    },
    isvalidtext(x){
      var r = new RegExp(/[&\/\\#,+()$~%.'":*?<>{}]/, "gi")
      var v = r.test(x);
      return !v
    },
    full_default_depart(){
      let d = JSON.parse(getUserclick()).view_depart
      var ddpart = {}
      if(typeof d!=='undefined'){
        ddpart.title = JSON.parse(getUserclick()).view_depart
        ddpart.typeuser = JSON.parse(getUserclick()).view_typeuser
      }else {
        ddpart.title = JSON.parse(getUserData()).depart
        ddpart.typeuser = 'admin'
      }
      return ddpart
    },
    defaultdepart() {
      let d = JSON.parse(getUserclick()).view_depart
      var ddpart = ''
      if(typeof d!=='undefined'){
        ddpart = JSON.parse(getUserclick()).view_depart.split(" ")
      }else {
        ddpart = JSON.parse(getUserData()).depart.split(" ")
      }
      if(ddpart.length>=2){
        ddpart = ddpart[0]+' '+ddpart[1]
      }else {
        ddpart = ddpart[0]
      }
      return ddpart
    },
    userdata(){
      var data = JSON.parse(getUserData())
      return data
    },
    loadallequipttype(t){
      console.log('++loadallequipttype++');
      //console.log('1');
      var ddpart = {
        admin: this.defaultdepart()
      }
      console.log(ddpart);
      this.$store.dispatch('info/loadallequipttype', ddpart)
        .then((r) => {
          r= r.data
          this.equiptall = this.hierequipt(r)
          this.isloadallequipttype = true
          if(t==='reload dashboard'){
            this.queryfirstvalue()
          }
          console.log(this.equiptall);
          //NProgress.done()
          console.log('++loadallequipttype++');
        })
        .catch((e) => {
          console.log(e);
          //NProgress.done()
        })
    },
    isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    regenerateArray(r){
      r.push([])
      r.splice(-1,1)
      return r
    },
    datetotext(d){
      return d.toISOString().substring(0, 10)
    },
    doexcelserver(d){
      var data = {}
      data.scope = d.scope
      data.detail = {}

      let date = new Date(), y = date.getFullYear(), m = date.getMonth();
      let firstDay = new Date(y, m, 1);
      let lastDay = new Date(y, m + 1, 0);
      data.detail.firstDay = firstDay
      data.detail.lastDay = lastDay
      data.detail.xmonth = this.xmonth[m]
      data.detail.tyear = y+543
      firstDay.setDate(firstDay.getDate() + 1);
      lastDay.setDate(lastDay.getDate() + 1);
      console.log(this.focuswarehouse);

      if(data.scope=='report_checkcar'){
        data.detail.focuswarehouse = {}
        data.detail.focuswarehouse.depart = this.cropdepart(this.focuswarehouse.adminstr,'just_view')
        data.detail.focuswarehouse.codename = this.focuswarehouse.codename
        data.detail.focuswarehouse.name1 = this.focuswarehouse.name1
        data.detail.focuswarehouse.name2 = this.focuswarehouse.name2
        data.detail.filename = d.scope+'('+this.focuswarehouse.name1+')'+'_from_'+this.datetotext(firstDay)+'_to_'+this.datetotext(lastDay)
      }

      data.dataset = d
      console.log(data);
      /**/const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
      });

          // console.log(data)
      //const params = new URLSearchParams()
      //params.append('event_info', JSON.stringify(data))
     axios({
        method: 'POST',
        url: process.env.VUE_APP_BASE_SERVER_LINE+'/peaflow/info/loadexcel',
        data : data,
        responseType: 'blob'
      }).then(res=>{
        console.log(res.data);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        let blob = new Blob([res.data],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
        );
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = data.detail.filename+'.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        loading.close();
      }).catch(err=>{
        loading.close();
        console.log(err)
      })/**/
    },
    hierequipt(r){
      console.log('hierequipt');
      //console.log(r);
      //console.log('end=====hierequipt');
      var nr = r.filter(e=>{return e.belong_to == 0})
      var tmpe = []
      var tmpp = {}
      var tmpbtn = {
        id:99999,
        label:'btnadd'
      }

      var rc = nr.map(obj =>{
         var rObj = {};
         rObj.id = obj.id;
         rObj.equip_short = obj.equip_short;
         rObj.equip = obj.equip;
         rObj.detail = obj.detail;
         rObj.belong_to = obj.belong_to;
         var es = ''
         if(obj.equip_short!=''){
           es = '('+obj.equip_short+')'
         }
         rObj.label = obj.equip+es
         rObj.value = obj.equip
         var c = r.filter(e=>{return e.belong_to == obj.id})
         if(c.length!=0){
           var rcc = c.map(obj2 =>{
              var rObj2 = {};
              rObj2.id = obj2.id;
              rObj2.equip_short = obj2.equip_short;
              rObj2.equip = obj2.equip;
              rObj2.detail = obj2.detail;
              rObj2.belong_to = obj2.belong_to;
              var es = ''
              if(obj2.equip_short!=''){
                es = '('+obj2.equip_short+')'
              }
              rObj2.label = obj2.equip+es
              rObj2.value = obj2.equip
              var c2 = r.filter(e=>{return e.belong_to == obj2.id})
              if(c2.length!=0){
                var rcc2 = c2.map(obj3 =>{
                   var rObj3 = {};
                   rObj3.id = obj3.id;
                   rObj3.equip_short = obj3.equip_short;
                   rObj3.equip = obj3.equip;
                   rObj3.detail = obj3.detail;
                   rObj3.belong_to = obj3.belong_to;
                   var es = ''
                   if(obj3.equip_short!=''){
                     es = '('+obj3.equip_short+')'
                   }
                   rObj3.label = obj3.equip+es
                   rObj3.value = obj3.equip
                   var c3 = r.filter(e=>{return e.belong_to == obj3.id})

                   if(c3.length!=0){
                     var rcc3 = c3.map(obj4 =>{
                        var rObj4 = {};
                        rObj4.id = obj4.id;
                        rObj4.equip_short = obj4.equip_short;
                        rObj4.equip = obj4.equip;
                        rObj4.detail = obj4.detail;
                        rObj4.belong_to = obj4.belong_to;
                        var es = ''
                        if(obj4.equip_short!=''){
                          es = '('+obj4.equip_short+')'
                        }
                        rObj4.label = obj4.equip+es
                        rObj4.value = obj4.equip
                        var c4 = r.filter(e=>{return e.belong_to == obj4.id})
                        return rObj4;
                     });
                     //rcc3.push(tmpbtn)
                     rObj3.children = rcc3
                   }

                   return rObj3;
                });
                //rcc2.push(tmpbtn)
                rObj2.children = rcc2
              }
              return rObj2;
           });
           //rcc.push(tmpbtn)
           rObj.children = rcc
         }
         return rObj;
      });
      rc.push(tmpbtn)
      /*for (var i = 0; i < nr.length; i++) {
        //console.log(i);
        var c = r.filter(e=>{return e.belong_to == r[i].id})
        var rc = c.map(obj =>{
           var rObj = {};
           rObj.id = obj.id;
           rObj.label = obj.equip+'('+obj.equip_short+')'
           return rObj;
        });
        if(c.length!=0){
          tmpp = {
            id:i+1,
            label:r[i].equip+'('+r[i].equip_short+')',
            children: rc
          }
        }else {
          tmpp = {
            id:i+1,
            label:r[i].equip+'('+r[i].equip_short+')'
          }
        }

        tmpe.push(tmpp)
      }*/
      return rc
    }
  }
}
