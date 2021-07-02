<template>
  <div class="app">
  <el-main>
  <el-row :gutter="12">
    <el-col :span="8">
      <el-card shadow="never" class="box-card">
      <el-row :span="8">
        <form class="" enctype="multipart/form-data">
            <el-col>
              <label for="file">Upload file</label>
              <input type="file" @change="processFile()" ref="file">


              <el-button @click="uploadfile" class="right-side">upload file</el-button>
              </el-col>
        </form>
            </el-row>

            <v-spacer></v-spacer>
        
      </el-card>
    </el-col>
  </el-row>

  </el-main>

  <el-main>
   <div class="" v-if="showcheckbar">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">แสดงทั้งหมด</el-checkbox>
              <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="city in allkey" :label="city" :key="city">{{city}}</el-checkbox>
              </el-checkbox-group>
            </div>
      <div>
        <data-table :get-data="getData">
              ref="table"
              :columns="columns">
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
      'loadingmainpage',
      'centers'
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
      dallkey: ['id','สินทรัพย์','เลขที่สินค้าคงคลัง','SERIAL_NO','อุปกรณ์','CAP_DATE','สถานที่','มูลค่าการได้มา','ค่าเสื่อมสะสม','มูลค่าตามบัญชี'],
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
    
    loadingmainpage(v){
      //console.log(v);
      if(!v){
        this.queryfirstvalue()
      }
    },    
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
    //------------------------------------------------------------------------//
    async uploadfile(){
      const formData = new FormData();
      formData.append("file", this.fileupload);
      var userdata = JSON.parse(getUserData())
      console.log(userdata);
      formData.append("admin", userdata.depart);
      console.log(this.fileupload)
      try {
        await axios.post(process.env.VUE_APP_BASE_SERVER+"/info/uploadassetfile", formData)
          .then( (res)=> {
            console.log('here result na');
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
            console.log(res);
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
    width: 720px;

  }
.right-side{
  position: relative;
  left: 3cm;
}
</style>

