<template>
  <div class="app">
  <el-main>
  <el-row :gutter="12">
    <el-col :span="8">
      <el-card shadow="never" class="box-card">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">Choose file</el-button>
          <div slot="tip" class="el-upload__tip">excel files with a size less than 500kb</div>
        </el-upload>
        <el-button @click="uploadfile">upload file</el-button>
      </el-card>
    </el-col>
  </el-row>
      <el-col :span="8">
        <el-button icon="el-icon-download" @click="JSONToCSVConvertor">Export ผลลัพธ์  รายการ</el-button>
    </el-col>
  </el-main>

  <el-main>
      <div>
        <data-table :get-data="getData" v-loading="mshowbyequipt">
              ref="table"
              :columns="columns">
      <div slot="Operations" slot-scope="{row}">
        <div class="operation-style">
          <el-button type="primary" plain size="mini" @click="clickfield(row.ที่-1,tableData,'history')">ข้อมูล/ประวัติ</el-button>
        </div>
      </div>
    </data-table>
    </div>
    </el-main>
  </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import DataTable from "@/views/components/DataTable";
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import { getUserData } from '@/utils/auth'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import axios from 'axios'
import 'element-ui/lib/theme-chalk/display.css';
import NProgress from 'nprogress' // progress bar
import { setUserclick, getUserclick} from '@/utils/auth'
import {freqmethods} from '@/mixins/freqmethods'
import {frefucequipt} from '@/views/equiptmentscheme/mixins/frefucequipt'
NProgress.configure({ showSpinner: false })


export default {
  name: 'ComplexTable',
  mixins: [freqmethods,frefucequipt],
  components: { Pagination,DataTable },

  computed: {
    ...mapGetters([
      'roles',
      'locations',
      'equiptype',
      'loadingmainpage'
    ])
  },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      sstart: '',
      send: '',
      seloptionhis: '',
      dialogarkmerge_title: 'ลำดับเหล่านี้มีในฐานข้อมูลแล้ว เลือก update หรือลบรายการออกจากไฟล์ excel',
      dialogarkmerge: false,
      seltype: '',
      showupload: false,
      showbyequipt: false,
      showbylocation: false,
      showbyhistory: false,
      columns: [],
      showcheckbar: false,
      ReportTitle: 'Export',
      checktypem: '',
      showview: true,
      curmenu: 'View',
      checksearch: 'or',
      forsearchdevice: '',
      checkAll: false,
      checkedCities: [],
      isIndeterminate: true,
      seltypehistory:'',
      selsadd: '',
      sellocation: '',
      options: [{
          value: 'Option1',
          label: 'Option1'
        }],
      equiptoptions: [{
          value: 'Option1',
          label: 'Option1'
        }],
      locationoptions: [{
          value: 'Option1',
          label: 'Option1'
        }],
      allkey: [],
      dallkey: ['ExcelID','อุปกรณ์','ยี่ห้อ','รุ่น','สถานที่'],
      dialogthispage: false,
      dialogtitle: '',
      servererror: false,
      dialogmessage: '',
      loading: false,
      fileupload: '',
      tableData: [],
      ortableData: [],
      dupcompare: '',
      rerender: 0
    }
  },
  watch: {
    seltypehistory(v){
      console.log(v);
      //this.loadallequipttype()
      if(v!==''){
        if(typeof getUserclick() !== 'undefined'){
          if(typeof JSON.parse(getUserclick()).equiptohis !== 'undefined'){
            var tmp = JSON.parse(getUserclick())
            tmp.equiptohis = v
            setUserclick(tmp)
            //console.log(JSON.parse(getUserclick()));
          }
        }
        this.selsadd =  ''
        this.tableData = []
        if(v==='ข้อมูล'){
          //this.typepage = 'ค้นหา'
          this.typepage = 'เพิ่ม'
          this.fillinputform(this.focusequit)
        }else {
          //this.typepage = 'เพิ่ม'
          this.fillinputform(this.focusequit)
          this.typepage='ค้นหา'
          this.entersearch()
        }

        //this.reoptionnameform(v)
        console.log('watch seltype');
      }
      //console.log('istohere');
    },
    loadingmainpage(v){
      //console.log(v);
      if(!v){
        this.queryfirstvalue()
      }
    },
    sellocation(v){
      //console.log(v);
      var tmp = {}
      tmp.sellocation = v
      //console.log(JSON.parse(getUserclick()));
      if(typeof getUserclick() !== 'undefined'){
        if(typeof JSON.parse(getUserclick()) !== 'undefined'){
          tmp = JSON.parse(getUserclick())
          tmp.sellocation = v
          //console.log(JSON.parse(getUserclick()));
        }
      }
      setUserclick(tmp)
      var tmp2 = {}
      tmp2.topic = 'thatlocation'
      tmp2.info = v
      this.loadethatinfo(tmp2,'watch>sellocation')
    },
    seltype(v){
      console.log('++seltype++');
      console.log(v);
      var tmp = {}
      tmp.seltype = v
      //console.log(JSON.parse(getUserclick()));
      if(typeof getUserclick() !== 'undefined'){
        if(typeof JSON.parse(getUserclick()) !== 'undefined'){
          tmp = JSON.parse(getUserclick())
          tmp.seltype = v
          //console.log(JSON.parse(getUserclick()));
        }
      }
      setUserclick(tmp)
      //console.log(JSON.parse(getUserclick()))
      //console.log('vvv');
      //console.log(this.options);
      /*var x = this.options.find(function(element) {
        console.log(element);//
        console.log(v);
        return element.value == v;
      });*/
      //console.log(x);
      var tmp2 = {}
      tmp2.topic = 'thatquipt'
      tmp2.info = v
      this.loadethatinfo(tmp2,'watch>seltype')
      //console.log(ddpart);
      console.log('++seltype++');
    }
  },
  created() {
    if(!this.loadingmainpage){
      this.queryfirstvalue()
    }
    //this.loadlocation

  },
  methods: {
    JSONToCSVConvertor() {
        var JSONData = this.tableData
        var ShowLabel = true
        var ReportTitle = this.ReportTitle
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData
        console.log(arrData);
        var CSV = '\uFEFF';
        arrData = arrData.map(e=>{
          var d= {}
          for (var i = 0; i < this.checkedCities.length; i++) {
            d[this.checkedCities[i]] = e[this.checkedCities[i]]
          }
          return d
        })
        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";

            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {

                //Now convert each value to string and comma-seprated
                row += index + ',';
            }

            row = row.slice(0, -1);

            //append Label row with line break
            CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";

            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);

            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {
            alert("Invalid data");
            return;
        }

        //Generate a file name
        var fileName = "MyReport_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g,"_");

        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + CSV;

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    issort(e){
      /*
      if(e=='ลำดับ'||e=='ExcelID'){
        return true
      }else{
        return false
      }*/
      return true

    },
    datafromeimg(value){
      //console.log(value);


      var rcc3 = value.map(obj4 =>{
         var rObj4 = {};
         rObj4.picturetoken = obj4.mediaItem.id;
         rObj4.explanation = ''
         return rObj4;
      });
      if(this.form.actscheme=='add'){
        this.form.detail = {}
        this.form.detail.pictures = []
        this.form.detail.pictures = rcc3
      }else if (this.form.actscheme=='edit') {
        //console.log(this.form.detail.pictures);
        //console.log(rcc3);
        this.form.detail.pictures = this.form.detail.pictures.concat(rcc3)
        //console.log(this.form.detail.pictures);
      }else if(this.form.actscheme=='view'){
        this.form.detail.pictures = this.form.detail.pictures.concat(rcc3)
      }

      console.log(this.form.detail);
    },
    clickfield(i,d,v){
      console.log(i);
      if(v=='info'){

      }else if (v=='history') {
        if(typeof getUserclick() !== 'undefined'){
          if(this.isJson(getUserclick())){
            var tmp = JSON.parse(getUserclick())
            tmp.focusequit = d[i]
            tmp.seloptionhis = 'อุปกรณ์'
            console.log(d[i]);
            setUserclick(tmp)
            this.$router.push({ path: '/historyreport/index'})

          }
        }else {
          console.log('wrong here!! fix it');
        }
      }
    },
    queryfirstvalue(){

      var thatquiptorlocation = 'thatquipt'
      var seltype = 'เลือกอะไรสักอย่าง'
      var sellocation = 'เลือกอะไรสักอย่าง'

      if(typeof getUserclick() !== 'undefined'){
        if(this.isJson(getUserclick())){
          //console.log('before error');
          //console.log(getUserclick());
          if(typeof JSON.parse(getUserclick()).sellocation !== 'undefined'){
            sellocation = JSON.parse(getUserclick()).sellocation
          }
          if(typeof JSON.parse(getUserclick()).forsearchdevice !== 'undefined'){
            this.forsearchdevice = JSON.parse(getUserclick()).forsearchdevice

            if(typeof JSON.parse(getUserclick()).checksearch !== 'undefined'){
              this.checksearch = JSON.parse(getUserclick()).checksearch
            }
            this.searchall()
          }else{
            console.log('no search existing');
          }
          if(typeof JSON.parse(getUserclick()).seltype !== 'undefined'){
            seltype = JSON.parse(getUserclick()).seltype
          }

          if(typeof JSON.parse(getUserclick()).deviceinfoscheme !== 'undefined'){
            thatquiptorlocation = JSON.parse(getUserclick()).deviceinfoscheme.whatshow
            if(thatquiptorlocation == 'mshowbyequipt'){
              this.seltype = seltype
            }else{
              this.sellocation = sellocation
            }
            this.dodropdownview(thatquiptorlocation)
          }else {
            this.dodropdownview('mshowbyequipt')
          }
        }
      }
    },

    loadlocations(){

      var tmp2 = {}
      tmp2.topic = 'thatlocation'
      tmp2.info = this.sellocation
      this.loadethatinfo(tmp2,'loadlocations')
      var r= this.locations
      var rr = r.map(obj =>{
         var rObj = {};
         rObj.value = obj.ID;
         rObj.label = `${obj.TypeOffice}.${obj.Name1}`;
         return rObj;
      });
      this.locationoptions = rr
    },
    loadequipt(){

      var tmp2 = {}
      tmp2.topic = 'thatquipt'
      tmp2.info = this.seltype
      this.loadethatinfo(tmp2,'loadequipt')
      var r= this.equiptype

      var rr = r.map(obj =>{
         var rObj = {};
         rObj.value = obj.id;
         rObj.label = obj.equip;
         return rObj;
      });
      this.equiptoptions = rr

      if(this.isJson(getUserclick())){
        if(typeof JSON.parse(getUserclick()).selcol === 'undefined'){

          var tmp = JSON.parse(getUserclick())
          tmp.selcol = this.equiptoptions

          setUserclick(tmp)
        }else{
          var seltype = 'เลือกอะไรสักอย่าง'
        }
      }
      console.log('++loadequipt++');
    },
   loadethatinfo(v,comefrom){
       console.log("++loadethatinfo++");
       var tmp = {}
       tmp.info = v.topic
       tmp.param1 = this.full_default_depart().title
       tmp.param2 = v.info
       //console.log(tmp);
       const loading = this.$loading({
         lock: true,
         text: 'Loading',
         spinner: 'el-icon-loading',
         background: 'rgba(0, 0, 0, 0.7)'
       });

       this.$store.dispatch('info/loadinfo', tmp)
         .then((r) => {

           loading.close();
           r= r.data
           if(r.length>0){
             var mrk = Object.keys(JSON.parse(r[0].infodetail))
             var t = r.map(o=>{

               //console.log(no);
               return this.infoequipt_adapter(o)

             })
             this.tableData = t
             this.ortableData = t
             this.reindex()
             if(typeof JSON.parse(getUserclick()).forsearchdevice !== 'undefined'){
               this.forsearchdevice = JSON.parse(getUserclick()).forsearchdevice
               this.searchall()
             }
             //console.log(this.tableData);
           }else{
             var mrk = []
             this.tableData = []
             this.ortableData = []
             this.reindex()
           }
           if(v.topic==='thatquipt'){
           }else if (v.topic==='thatlocation') {
             var mrk = []
           }
           this.allkey = this.dallkey.concat(mrk)

           if(this.isJson(getUserclick())){
             var tmp = JSON.parse(getUserclick())
             if(this.showbyequipt){

               if(typeof JSON.parse(getUserclick()).selcol !== 'undefined'){

                 var found = tmp.selcol.find(function(element) {
                   return element.value === v.info;
                 });

                 if(typeof found !=='undefined'){
                   if(typeof found.selthis !== 'undefined'){
                     this.checkedCities = found.selthis
                   }else{
                     this.checkedCities = this.allkey
                   }
                 }else{
                   this.checkedCities = this.allkey
                   this.savetoselcol(v.info,this.allkey)

                 }
               }
             }else if (this.showbylocation) {
               if(typeof JSON.parse(getUserclick()).selloccol !== 'undefined'){
                 this.checkedCities = tmp.selloccol

               }else{
                 this.checkedCities = this.allkey
               }
             }
             this.selthiscol()
           }

           var rr = r.map(obj =>{
              var rObj = {};
              rObj.value = obj.id;
              rObj.label = obj.equip;

              return rObj;
           });
           NProgress.done()
         })
         .catch((e) => {
           NProgress.done()
         })


   },
   savetoselcol(value,selthis){
     var l = this.equiptoptions.find(e=>e.value==value)
     var s = JSON.parse(getUserclick())
     if(typeof l === 'undefined'){
       l = {
         label: ''
       }
     }
     var tmp = {
       selthis:selthis,
       value:value,
       label:l.label
     }
     var found = s.selcol.findIndex((element)=> {
       return element.value === value;
     })
     if(found !== -1){
       s.selcol[found] = tmp
     }else{
       s.selcol.push(tmp)
     }
     setUserclick(s)
   },
   searchall(){
     if(typeof this.$refs.table != 'undefined'){
       this.$refs.table.getTableData()
     }
   },
    getData(c){

      if(typeof getUserclick() !== 'undefined'){
        var tmp = JSON.parse(getUserclick())
        if(typeof JSON.parse(getUserclick()).searchequipt !== 'undefined'){
          tmp.forsearchdevice = this.forsearchdevice

          setUserclick(tmp)
        }else{
          tmp.forsearchdevice = {}
          tmp.forsearchdevice = this.forsearchdevice
          setUserclick(tmp)
        }
        tmp.checksearch = this.checksearch
        setUserclick(tmp)


      }
      //console.log(this.checksearch);
      this.forsearchdevice = this.forsearchdevice.toUpperCase()
      /*console.log('this.forsearchdevice');
      console.log(this.forsearchdevice);
      console.log('this.forsearchdevice');*/

      var st = this.forsearchdevice.split(' ')
      //console.log(st);
      var rx = ''
      for (var i = 0; i < st.length; i++) {
        rx+=st[i]
        if(i<st.length-1){
          rx+='|'
        }
      }
      var re = new RegExp(rx, "g");

      //console.log(re);
      return new Promise((resolve, reject) => {
        try {
          console.log(c);
          this.tableData = ''
          this.tableData = this.ortableData.filter(e=>{
            var astext = JSON.stringify(e)
            var astext = astext.toUpperCase()
            //console.log(astext);
            var matches = astext.match(re);

            if(matches!=null){
              matches = [...new Set(matches)];
              //console.log(matches);

              if(this.checksearch=='or'){
                if(matches.length>0){
                  return e
                }
              }else if (this.checksearch=='and') {
                if(matches.length===st.length){
                  return e
                }
              }
            }else {
              if (this.checksearch=='not') {
                return e
              }
            }


          });
          //console.log(this.ortableData);
          //getonly that page
          this.reindex()
          /*console.log(this.tableData);
          this.tableData = this.tableData.filter(e=>{
            return ((e.ที่ <= c.page*30)&&(e.ที่ >= ((c.page-1)*10)+1))
          })
          console.log(this.tableData);
          this.reindex()*/
          resolve(this.tableData)
        } catch (e) {
          console.log(e);
          reject(e)
        }

      })
    },
    reindex(){
      for (var i = 0; i < this.tableData.length; i++) {
        this.tableData[i].ที่ = i+1
        //this.tableData[i].id = i+1
      }
    },
    handleCommand(c){
      this.dodropdownview(c)
    },
    dodropdownview(c){
      console.log('++dodropdownview++');
      console.log('what should load: '+c);
      var tmp = {}
      tmp.deviceinfoscheme = {
        whatshow:c
      }
      this.showview = false
      this.showupload = false
      this.showbyequipt = false
      this.showbylocation = false
      this.showbyhistory = false
      if(c=="mshowupload"){
        console.log('mshowupload');
        this.showupload = true
        this.curmenu = 'อัพโหลดอุปกรณ์'

      }
      //เปลี่ยนเป็นใช้ปีในการค้นหา
      else if(c=="mshowbyequipt"){
        this.showview = true
        this.showbyequipt = true
        this.searchall()
        this.loadequipt()
        this.curmenu = 'รายการตามปีที่ได้รับอุปกรณ์'
      }
      else if(c=="mshowbylocation"){
        this.showview = true
        this.showbylocation = true
        this.curmenu = 'รายการตามสถานที่'
        this.searchall()
        this.loadlocations()
      }
      else if(c=="mshowbyhistory"){
        this.showbyhistory = true
        this.curmenu = 'ทะเบียนประวัติ'
      }
      //console.log(JSON.parse(getUserclick()));
      if(typeof getUserclick() !== 'undefined'){
        if(typeof JSON.parse(getUserclick()) !== 'undefined'){
          tmp = JSON.parse(getUserclick())
          tmp.deviceinfoscheme = {
            whatshow:c
          }
          //console.log(JSON.parse(getUserclick()));
        }
      }
      setUserclick(tmp)
      console.log('++dodropdownview++');
    },
    handleCheckAllChange(val) {
       this.checkedCities = val ? this.allkey : [];
       this.isIndeterminate = false;

       this.selthiscol()
     },
     handleCheckedCitiesChange(value) {
       let checkedCount = value.length;
       this.checkAll = checkedCount === this.allkey.length;
       this.isIndeterminate = checkedCount > 0 && checkedCount < this.allkey.length;
       this.selthiscol()
     },
     selthiscol(){
       console.log('++selthiscol++');
       console.log('deviceinfo.vue : step2');
       console.log(this.checkedCities);
       if(this.checkedCities[0]!=="ที่"){
         this.checkedCities.splice( 0, 0, "ที่");
       }
       this.columns = this.checkedCities.map(obj=>{
         var rObj = {};
         rObj.prop = obj
         rObj.label = obj
         if(obj=='ที่'){
           rObj.width = '57'
         }else if(obj=='ExcelID'){
           rObj.width = '90'
           rObj.label = 'xlsID'
         }
         return rObj
       })
       var tm1 = {
         fixed: "right",
         label: "Operations"
       }
       this.columns.push(tm1)
       console.log(this.columns);
       if(this.isJson(getUserclick())){
         console.log('Do save column');
         if(this.showbyequipt){
           console.log('showbyequipt');
             if(typeof JSON.parse(getUserclick()).selcol !== 'undefined'){
               this.savetoselcol(this.seltype,this.checkedCities)
               //console.log('+++++++');
               //console.log(JSON.parse(getUserclick()));
             }
         }else if (this.showbylocation) {
           console.log('showbylocation');
           //console.log('11111111111111');
           //console.log(this.checkedCities);
           var tmp2 = JSON.parse(getUserclick())
           tmp2.selloccol = this.checkedCities
           //console.log(JSON.stringify(tmp2));
           setUserclick(tmp2)
           //console.log('333333333333');

           //console.log(JSON.parse(getUserclick()));
             //console.log('+++++++');
             //console.log(JSON.parse(getUserclick()));
         }
       }else{
         console.log(getUserclick());
       }
       console.log('++selthiscol++');
     },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    processFile(event) {
      this.fileupload = this.$refs.file.files[0]
    },
    async uploadfile(){
      const formData = new FormData();
      formData.append("file", this.fileupload);
      var userdata = JSON.parse(getUserData())
      //console.log(userdata);
      formData.append("admin", userdata.depart);
      console.log(this.fileupload)
      try {
        await axios.post(process.env.VUE_APP_BASE_SERVER+"/info/uploadfile", formData)
          .then( (res)=> {
            //console.log('here result na');
            //this.tableData = result.data
            res = res.data

            if(res.code===50072){
              this.dialogthispage = true
              var l = res.all.length
              this.servererror = true
              this.dialogtitle = 'Error ทั้งหมด '+l+' จุด'
              this.dialogmessage = res.all
            }if(res.code===50073){
              this.dialogarkmerge = true
              this.dupcompare = res.message
              console.log(res);
            }else{
              this.notisuccess(res.message)
            }
            this.queryfirstvalue()
            //console.log(res);
          }, function (error) {
            console.log(error);
          });
      } catch (e) {
        console.log(e);
      } finally {

      }

        //return false
    },
    updateinfoequipt(p,e,i){
      //console.log(this.dupcompare[i].message[p])

      var tmp = {}
      tmp.info = 'updateinfoequipt'
      tmp.param1 = p
      tmp.param2 = e
      console.log(tmp);
      this.$store.dispatch('info/fetchandupdate', tmp)
        .then((r) => {
          console.log(r.data);
          this.dupcompare[i].message[p].status = 'ok'
          this.dupcompare = this.regenerateArray(this.dupcompare)
          this.rerender++
        })
    }
  }
}
</script>

<style lang="scss">
#app {
        position: relative;
        width: 100%;
        height: 100vh;
        display:flex;
        justify-content: center;
        align-items: center;
    }
.el-main {
        background-color: #E9EEF3;
        color: #333;
       
        line-height: 20px;
    }
.barsearch > * {
  display: inline-block;
}
.bs1 {
  width: 8%;
}
.bs2 {
  width: 18%;
}
.bs3 {
  width: 24%;
}
.bs4 {
  width: 25%;
}
.resnum {
  margin-left: 5px;
  color: grey;
}
.maintop {
  display: flex;
  align-items: center;
  align-self: flex-start;
}
.Aligner-item--top {
  align-self: flex-start;
}
.topmenu {
  display: flex;
  width: 95%;
}
.topmenu > * {
  margin-right: 10px;
}
.buttun_text {
  margin-top: 3px;
  font-size: 13px;
  color: grey;
}
.maintop > * {
  margin-right: 5px;
}
.app-container {
  padding: 3px;
}
.box-card {
    width: 480px;

  }
</style>

