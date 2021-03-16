<template>
  <div class="app-container">
  <div class="viewmenu" v-if="showview">
    <el-row :gutter="10">
      <el-col :xs="11" :sm="3" :lg="3">
        <el-select v-model="seloptionhis" filterable placeholder="Select">
          <el-option
            v-for="item in optionhis"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="buttun_text">
          ประวัติของ
        </div>
      </el-col>
      <el-col :xs="11" :sm="4" :lg="4">

        <div class="">
          <el-select v-model="seltype" filterable placeholder="Select">
            <el-option
              v-for="item in optionst"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="buttun_text">
          ประเภทประวัติ
        </div>
      </el-col>
      <el-col :xs="20" :sm="16" class="suitemo">
        <div class="" v-if="seloptionhis=='อุปกรณ์'">
          <div class="textheader">
            {{focusequit.อุปกรณ์}}>{{focusequit.ยี่ห้อ}}>{{focusequit.รุ่น}}
          </div>
          <div class="lotext">
            [{{focusequit.สถานที่}}][ID{{focusequit.ลำดับ}}] รหัสทรัพย์สิน:{{focusequit.รหัสทรัพย์สิน}}
          </div>
        </div>
        <div class="" v-else-if="seloptionhis=='ช่วงเวลา'">
          <div class="mb-1 buttun_text">
            วันที่เริ่มต้นค้นหา : <el-date-picker
              v-model="sstart"
              type="date"
              placeholder="วันที่เริ่มต้น">
            </el-date-picker>
          </div>
          <div class="mb-1 buttun_text">
            วันที่สิ้นสุดค้นหา : <el-date-picker
              v-model="send"
              type="date"
              placeholder="วันที่สิ้นสุด">
            </el-date-picker>
          </div>
        </div>
        <div class="" v-else-if="seloptionhis=='สถานที่'">
          <el-select v-model="sellocation"  filterable placeholder="เลือกสถานที่">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-col>


      <el-col :xs="24" :sm="24">
        <el-row>
          <el-col :xs="12" :sm="4"
          v-if="seltype!='ข้อมูล'"
          v-bind:style= "[(typepage=='ค้นหา') ? bgtopnav:bgtopnavn]">
            <div class=""><el-button icon="el-icon-search" circle @click="entersearch()"></el-button></div>
            <div class="buttun_text">ค้นหา</div>
          </el-col>
          <el-col :xs="12" :sm="4"
          v-if="seltype!='ทั้งหมด'&&typeuser=='admin'" v-bind:style= "[(typepage=='เพิ่ม') ? bgtopnav:bgtopnavn]">
            <div class=""><el-button icon="el-icon-edit" circle type="warning" @click="enteradd()"></el-button></div>
            <div class="buttun_text">เพิ่ม/แก้ไข</div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="bs3_h">
              <el-radio v-model="checksearch" label="or" @keyup.enter.native="searchall">หรือ</el-radio>
              <el-radio v-model="checksearch" label="and" @keyup.enter.native="searchall">และ</el-radio>
              <el-radio v-model="checksearch" label="not" @keyup.enter.native="searchall">ไม่เท่ากับ</el-radio>

              <el-input
                placeholder="พิมพ์คำที่ต้องการกรองแล้วกด Enter"
                prefix-icon="el-icon-search"
                @keyup.enter.native="searchall"
                width="50%"
                v-model="forsearchdevice">
              </el-input>
            </div>
          </el-col>


          <el-col :xs="24" :sm="12">
          <span class="resnum">ผลลัพธ์ {{tableData.length}} รายการ</span>
          </el-col>
          </el-row>
      </el-col>
    </el-row>
    <hr>

  </div>
  <formreport
    :typepage="typepage"
    :seltype="seltype"
    :focusequit="focusequit"
    :key="refreshformreport"
    :masterScheme="masterScheme"
    :nameproject="nameproject"
    :operationhistory="operationhistory"
    :dateinfo="dateinfo"
    :focushistory="focushistory"
    :flagupdatehistory="flagupdatehistory"
    @resfromsql="resfromsql"
    v-if="readyform&&typepage!='ค้นหา'"
    >
  </formreport>

    <!--<el-button @click="resetDateFilter">reset date filter</el-button>-->
    <div class="boxsearch" v-if="typepage=='ค้นหา'">
      <!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">แสดงทั้งหมด</el-checkbox>
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="city in allkey" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>-->
      <data-table :get-data="getData"
                ref="table"
                :columns="columns">
      <div slot="expand" slot-scope="{row}">
        <p>detail: {{row.detail}}</p>
      </div>
       <b slot="email" slot-scope="{row}">
        {{row.email}}
       </b>
       <span slot="salary" slot-scope="{row}">
        $ {{row.salary}}
       </span>
        <div slot="Operations" slot-scope="{row}">
          <div class="operation-style">
            <el-button type="primary" plain size="mini" @click="but2n(row.ลำดับ-1,tableData,'info')">ดูข้อมูล</el-button>
            <el-button v-if="typeuser=='admin'" type="primary" plain size="mini" @click="but2n(row.ลำดับ-1,tableData,'edit')">แก้ไข</el-button>
            <el-button v-if="typeuser=='admin'" type="warning" plain size="mini" @click="but2n(row.ลำดับ-1,tableData,'delete')">ลบ</el-button>
          </div>
        </div>
    </data-table>

    </div>


<el-dialog
  :title="dialogtitle"
  :visible.sync="dialogthispage"
  width="50%">
  {{dialogdata}}
  <span slot="footer" class="dialog-footer">
    <span v-if="dialogtype =='delform'">
      <el-button type="primary" @click="delformscheme()">ลบ</el-button>
      <el-button type="primary" @click="dialogthispage = false">ยกเลิก</el-button>

    </span>
    <span v-else>
      <el-button type="primary" @click="dialogthispage = false">OK</el-button>
    </span>
  </span>
</el-dialog>
  </div>
</template>

<style scoped>
.onlyprint{
  display:none;
}
.bs3_h{
  width: 100%;
  padding-left: 10px;
}
@media print {
  @page {size: portrait}
  .viewmenu{
    display:none;
  }
  .onlyprint{
    display:block;
  }
}
  .resnum{
    font-size: 15px;
    color: grey;
  }

  .textheader{
    font-size: 15px;
  }
  .buttun_text{
    margin-top: 3px;
    font-size: 13px;
    color: grey;
  }

  .lotext{
    color: #F48024;
    font-size: 18px;
    line-height: 1.5;
  }
  .action_sel_sadd{
    margin-top: 5px;
    margin-right: 5px;

  }
  .box1{
    margin-top: 7px;
    margin-bottom: 7px;
  }
  .box2{
    margin-top: 2px;
    margin-bottom: 2px;
  }
  .box_add_event{
    border: 0.5px solid #d2d2d2;
    border-radius: 10px;
    padding: 6px;
    margin-bottom: 5px;
    padding-top: 10px;
    background-color: white;
  }
  .fuckyou{
    margin-left: -50px;
  }
  .faxr{
    text-align: right;
  }
  .w100{
    width:100%;
    overflow-wrap: break-word;
  }
  .aright{
    text-align: center;
    margin-top: 10px;
  }
  .boxadd{
    margin: auto;

  }
  .tmpgrey{
    color: grey;
    font-size: 15px;
  }
  .bline{
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .topicheader{
    font-size: 20px;
    font-weight: bold;
    margin-top: 6px;
    padding-left: 7px;
  }
  .boxoperationhistory{
    margin: 8px;
  }
  .topic{
    color: #1890ff;
  }
  .operation-style{
    width: 205px;
  }
  @media (max-width:768px) {
    .faxr{
      text-align: left;
    }
    .operation-style{
      text-align: left;
      width: 100px;
    }
    .suitemo{
      margin-top: 10px;
      width:100%
    }
    .suitemo>*{

    }
    .mb-1{
      display:inline-block;
      width: 49%;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: 170px;
    }

  }
  @media screen and (min-width: 768px) {
    .boxadd{
      margin: auto;
      width: 850px;
    }
    .resnum{
      font-size: 19px;
    }
    .textheader{
      font-size: 21px;
    }
  }
</style>
<script>
import DataTable from "@/views/components/DataTable";
import editorImage from '@/views/components/Editimage'
import formreport from '@/views/components/formreport'
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import { getUserData } from '@/utils/auth'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import axios from 'axios'
import NProgress from 'nprogress' // progress bar
import { setUserclick, getUserclick} from '@/utils/auth'
import {freqmethods} from '@/mixins/freqmethods'
import {frefucequipt} from '@/views/equiptmentscheme/mixins/frefucequipt'
NProgress.configure({ showSpinner: false })



export default {
  name: 'ComplexTable',
  mixins: [freqmethods,frefucequipt],
  components: { Pagination,editorImage, DataTable,formreport},

  computed: {
    ...mapGetters([
      'roles',
      'locations',
      'equiptype',
      'equiptypeall',
      'loadingmainpage'
    ]),
    finishinfo: function () {
      if(typeof this.dateinfo !=='undefined'){
        if(typeof this.dateinfo.finish !=='undefined'){
          if(typeof this.dateinfo.finish.info !=='undefined'){
            return this.dateinfo.finish.info
          }
        }

      }
    }
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
      checksearch: '',
      readyform: false,
      refreshformreport: 0,
      columns: [],
      flagupdatehistory: false,
      focushistory: {idhistory: ''},
      depart: 'no',
      options: '',
      sellocation: '',
      sstart: '',
      send: '',
      seloptionhis: 'อุปกรณ์',
      infoscheme:{
        typemodel:[],
        typeid:[],
        keyelse:[]
      },
      dialogtype: '',
      dialogdata: '',
      schemitodel: '',
      allformscheme:[],
      nameproject: '',
      operationhistory:{
        tmp:{
          date:'',
          text:''
        },
        operation:[{
          date:'',
          text:''
        }]
      },
      imagedetail: {},
      refresheditimg: '',
      dateinfo:{
        selstep:'opendate',
        stepjob: {info:'',number:0},
        tmpdate:'',
        opendate: {info:'',step:1,detail:''},
        getdate: {info:'',step:2,detail:''},
        operation:{info:'',step:3,detail:''},
        finish:{info:'',step:4,detail:''}
      },
      bgtopnav:{
        textAlign: 'center',
        backgroundColor: '#eae7e7',
        border:' 1px solid #ccc9c9',
        paddingTop: '5px',
        borderRadius: '50px 20px',
        transition: '.5s'
      },
      bgtopnavn:{
        paddingTop: '5px',
        textAlign: 'center',
      },
      typeuser: '',
      typepage: '',
      inputtext: '',
      radiotext: 'สั้น',
      inputselect: '',
      selsadd: '',
      checktypem: '',
      focusequit: '',
      masterScheme: [],
      tmpScheme: [],
      groupradio: [{radio:'',istext:'ไม่มี',info:{radio:'',istext:''}}],
      showupload: false,
      showview: true,
      curmenu: 'View',
      checksearch: 'or',
      forsearch: '',
      checkAll: false,
      checkedCities: [],
      isIndeterminate: true,
      seltype:'',
      sellocation: '',
      optionsadd:[],
      optionstep:[{value:'opendate',label:'1 เปิดงาน',id:1},
        {value:'getdate',label:'2 รับงาน',id:2},
        {value:'operation',label:'3 ดำเนินการ',id:3},
        {value:'finish',label:'4 เสร็จสิ้น',id:4}],
      allkey: [],
      dallkey: ['อุปกรณ์','ยี่ห้อ','รุ่น','สถานที่','รหัสทรัพย์สิน'],
      dialogthispage: false,
      dialogtitle: '',
      servererror: false,
      dialogmessage: '',
      loading: false,
      fileupload: '',
      forsearchdevice: '',
      tableData: [],
      ortableData: [],
      equiptallf: [],
      oroptionst: []
    }
  },
  watch: {
    seloptionhis(v){
      this.tableData = []
      console.log(v);
      if(v==='ช่วงเวลา'||v==='สถานที่'){
        this.optionst = this.optionst.filter(e=>{
          return e.value !== 'ข้อมูล'
        })
        this.seltype = 'ทั้งหมด'
      }else{
        this.optionst = this.oroptionst
      }
      if(typeof getUserclick() !== 'undefined'){
        if(typeof JSON.parse(getUserclick()).seloptionhis !== 'undefined'){
          var tmp = JSON.parse(getUserclick())
          tmp.seloptionhis = v
          setUserclick(tmp)
          console.log(JSON.parse(getUserclick()));
        }
      }
    },
    equiptall(v){
      if(v.length>0){
        console.log(v);
        console.log(this.focusequit);
        this.equiptallf = v.filter(e=>{
          return e.value == this.focusequit.equiptfillter
        })
        console.log(this.equiptallf);
      }
    },
    typepage(v){
      console.log(v)
      if(typeof getUserclick() !== 'undefined'){
        var tmp = JSON.parse(getUserclick())
        //;
        if(typeof JSON.parse(getUserclick()) !== 'undefined'){
          tmp.typepage = v
          setUserclick(tmp)
          //console.log(JSON.parse(getUserclick()));
        }
      }
      //console.log('is to here222');
    },
    seltype(v){
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
    selsadd(v){
      if(v!=''){
        var t = this.optionsadd.find(e=>{
          return e.value == v
        })
        console.log(t);
        this.masterScheme = t.detail
      }
      console.log('isssss here');
      //this.resetval()
    },
    loadingmainpage(v){
      //console.log(v);
      if(!v){
        this.queryfirstvalue()
      }
    }
  },
  created() {
    if(!this.loadingmainpage){
      this.queryfirstvalue()
    }
    //this.loadlocation

  },
  mounted() {
    //do something after mounting vue instance
    this.imagedetail.list = []
    this.dateinfo.tmpdate = new Date();

    this.oroptionst = this.optionst
  },
  methods: {
    resfromsql(r){
      if(r.ressql.insertId!=0){
        console.log(r.ressql.insertId);
        this.flagupdatehistory = true
        this.focushistory.idhistory = r.ressql.insertId
      }else{
        console.log('เป็นการ update id history:'+this.focushistory.idhistory);
      }

    },
    fuc_refreshformreport(){
      console.log(this.refreshformreport);
      this.refreshformreport +=1
    },
    reoption(){
      var r= this.locations
      //console.log(r);
      var rr = r.map(obj =>{
         var rObj = {};
         rObj.value = obj.ID;
         rObj.label = `${obj.TypeOffice}.${obj.Name1}`;
         return rObj;
      });
      this.options = rr
    },
    delformscheme(){

      var d = this.schemitodel
      console.log(d);
      var t = {
        equiptypeID:d.detail.equiptypeID,
        typeHistory:d.detail.typeHistory,
        nameproject:d.detail.nameproject,
        locationID:d.detail.locationID,
        idhistory:d.idhistory
      }
      var tmp = {}
      tmp.info = 'deletehistorylist'
      tmp.param1 = t
      tmp.param2 = ''
      //console.log(tmp);
      this.$store.dispatch('info/fetchandupdate', tmp)
      .then(r=>{
        console.log('hi');
        console.log(r);
        this.dialogthispage = false
        this.entersearch()
      }).catch(e=>{
        this.dialogthispage = false
      })
    },
    fillinputform(d){
      console.log(d)
      if(this.seltype =='ข้อมูล'){
        if(typeof JSON.parse(d.extradetail) !== 'undefined'){
          var x = JSON.parse(d.extradetail)

          this.dateinfo = []
          this.masterScheme = x.masterScheme
          this.operationhistory = x.operationhistory
          this.nameproject = []

        }
      }else {
        //console.log(d.detail);
        if(typeof d.detail !== 'undefined'){
          if(typeof JSON.parse(d.detail.infodetail) !== 'undefined'){
            this.flagupdatehistory = true
            var x = JSON.parse(d.detail.infodetail)
            //console.log(x);
            this.dateinfo = x.dateinfo
            this.masterScheme = x.masterScheme
            this.operationhistory = x.operationhistory
            this.nameproject = d.detail.nameproject
          }
        }else{
          this.flagupdatehistory = false
          this.resetfirstval()
        }

      }
      console.log('fillinputform');
      this.fuc_refreshformreport()
      this.readyform = true

    },
    but2n(i,d,v){
      console.log(i);
      if(typeof getUserclick() !== 'undefined'){
          var tmp = JSON.parse(getUserclick())
          tmp.focushistory = d[i]
          this.focushistory = d[i]
          console.log(d[i]);

          this.seltype = d[i]['ประเภทประวัติ']
          this.fillinputform(d[i])

          setUserclick(tmp)
      }else {
        console.log('wrong here!! fix it');
      }
      console.log('++++++d[i]++++++');
      console.log(d[i].detail);
      console.log('++++++d[i]++++++');
      var tmp = {}
      tmp.info = "singleequipt"
      tmp.param1 = this.full_default_depart().title
      tmp.param2 = d[i].detail.equiptmentID
      //console.log(tmp);
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          //console.log('++++vvv++++');
          this.focusequit = this.infoequipt_adapter(r.data[0])
          var tmp = JSON.parse(getUserclick())
          tmp.focusequit = this.focusequit
          this.fuc_refreshformreport()
          setUserclick(tmp)
          //console.log(this.focusequit);
          //console.log('++++vvv++++');
          loading.close();
        })
      if(v=='info'){
        this.typepage = 'ดูข้อมูล'
      }else if (v=='edit') {
        this.typepage = 'เพิ่ม'
        //console.log(this.typepage);
      }else if (v=='delete') {
        console.log(d[i]);
        var di = d[i]
        this.dialogthispage = true
        this.dialogtitle = "แน่ใจหรือ"
        this.dialogdata = `คุณต้องการลบประวัติ "การ${di['ประเภทประวัติ']}" ชื่อ "${di['ชื่อโครงการ']}"  ใช่หรือไม่?`
        this.dialogtype = 'delform'
        this.schemitodel = d[i]
      }
    },
    delhis(i){

        if(this.operationhistory.operation.length==1){
          this.operationhistory.operation[0].date=''
          this.operationhistory.operation[0].text=''
        }else{
          this.operationhistory.operation.splice(i, 1);
        }


      console.log(this.operationhistory.operation);
    },
    resetval(){
      this.groupradio = [{radio:'',istext:'ไม่มี',info:{radio:'',istext:''}}]
      this.inputselect = ''
      this.inputtext = ''
    },
    addgroupradio(v){
      //console.log(v);
      var g = this.groupradio
      if(v!==''&&g[g.length-1].radio!==''){
        var tmp = {}
        tmp.radio = ''
        tmp.istext = 'ไม่มี'
        tmp.info = {}
        tmp.info.radio = ''
        tmp.info.istext = ''
        //console.log('+++++++++++++++++');
        //console.log(tmp);
        this.groupradio.push(tmp)
        //console.log(this.groupradio);
        //console.log('------------------');
      }
    },
    resetfirstval(){
      this.selsadd =  ''
      this.dateinfo = {
        selstep:'opendate',
        stepjob: {info:'',number:0},
        tmpdate:'',
        opendate: {info:'',step:1,detail:''},
        getdate: {info:'',step:2,detail:''},
        operation:{info:'',step:3,detail:''},
        finish:{info:'',step:4,detail:''}
      }
      this.operationhistory = {
        tmp:{
          date:'',
          text:''
        },
        operation:[{
          date:'',
          text:''
        }]
      }
      this.masterScheme= []
      this.nameproject = ''
    },
    enteradd(){
      console.log(this.checkedCities);
      this.tableData = []
      //this.queryfirstvalue()
      this.typepage = 'เพิ่ม'
      //
      //this.resetfirstval()
      this.fillinputform(this.focusequit)
      //console.log('istohere222');
      /*var t = this.focusequit
      this.dialogtitle = `[${this.seltype}]
      ID${t.ลำดับ} > ${t.สถานที่} > ${t.อุปกรณ์} > ${t.ยี่ห้อ} > ${t.รุ่น}`
      this.dialogthispage = true;*/
    },
    entersearch(){
      this.typepage = 'ค้นหา'
      this.getData2()
    },
    entersearch2(){
      this.typepage = 'ค้นหา'
      if(typeof this.$refs.table != 'undefined'){
        this.$refs.table.getTableData()
      }
    },
    getData2(){
      if(true){

        //console.log(this.focusequit);
        console.log(this.seloptionhis)
        var t = {}
        if(typeof JSON.parse(getUserData()).depart !=='undefined' ){
          //var x  = JSON.parse(getUserData())
          this.depart = this.full_default_depart().title
          var flagvalid = true
          if(this.seloptionhis==='อุปกรณ์'){
            t = {
              adminstr:this.depart,
              equiptmentID:this.focusequit['ลำดับ'],
              equiptypeID:this.focusequit.equiptypeID,
              locationID:this.focusequit.locationID,
              location:this.focusequit['สถานที่'],
              equipt:this.focusequit['อุปกรณ์'],
              typeHistory:this.seltype
            }
          }else if (this.seloptionhis==='ช่วงเวลา') {
            if(this.depart==''||this.send==''){
              flagvalid = false
            }
            t = {

              adminstr:this.depart,
              sstart:this.sstart,
              send:this.send,
              typeHistory:this.seltype
            }
          }else if (this.seloptionhis==='สถานที่') {
            t = {
              adminstr:this.depart,
              locationID:this.sellocation,//,
              typeHistory:this.seltype
            }
          }
          if(flagvalid){
            t.seloptionhis = this.seloptionhis
            var tmp = {}
            tmp.info = 'loadhistorylist'
            tmp.param1 = t
            tmp.param2 = this.typepage
            console.log(tmp);
              this.$store.dispatch('info/loadinfo', tmp)
                .then((r) => {
                  console.log(r);
                  try {
                    var k = 0
                    this.tableData = r.data.map(obj=>{
                      k++
                      var rObj = {};
                      rObj.ลำดับ = k
                      rObj.สถานที่ = obj.สถานที่
                      rObj.ชื่อโครงการ = obj.ชื่อโครงการ
                      rObj.ประเภทประวัติ = obj.ประเภทประวัติ
                      rObj.วันที่ = obj.วันที่
                      if(typeof this.optionstep[obj.สถานะงาน-1] !== 'undefined'){
                        if(typeof this.optionstep[obj.สถานะงาน-1].label !== 'undefined'){
                          rObj.สถานะงาน = this.optionstep[obj.สถานะงาน-1].label
                        }else{
                          rObj.สถานะงาน = ''
                        }
                      }else{
                        rObj.สถานะงาน = ''
                      }
                      rObj.idhistory = obj.idhistory
                      rObj.detail = obj.detail
                      /*if(this.isJson(obj.detail.infodetail)){
                        rObj.detail = JSON.parse(obj.detail.infodetail).masterScheme
                      }else {
                        console.log('detail not json');
                      }*/

                      return rObj
                    })


                    if(r.data[0]!=null||typeof r.data[0] !== 'undefined'){
                      console.log(Object.keys(r.data[0]));
                      this.checkedCities = Object.keys(this.tableData[0]);
                      this.checkedCities.length = 6

                      this.columns = this.checkedCities.map(obj=>{
                        var rObj = {};
                        if(obj=='ลำดับ'){
                          rObj.width = '61'
                        }
                        rObj.prop = obj
                        rObj.label = obj
                        return rObj
                      })
                      var tm1 = {
                        fixed: "right",
                        label: "Operations"
                      }
                      this.columns.push(tm1)
                      var tm1 = [{
                        type: "expand"
                      }]
                      //this.columns = tm1.concat(this.columns)
                      console.log(this.columns);
                    }

                    this.ortableData = this.tableData
                    this.searchall()
                    //console.log();
                    //console.log(this.tableData);
                  } catch (e) {
                    console.log(e);
                  }
                })


          }

        }else{
          console.log('no userdata redirect to login page, should not here');
        }

      }else {
        this.notierror('ข้อมูลสำหรับการค้นหาไม่ครบ')
      }

    },
    but3tom(i,d){
      if(d=='delthis'){
        this.masterScheme.splice(i, 1);
      }else if (d=='hidethis') {
        this.masterScheme[i].isshow = false
      }else if (d=='showthis') {
        this.masterScheme[i].isshow = true
      }

    },
    queryfirstvalue(){
      this.loadallequipttype()
      console.log(JSON.parse(getUserclick()));
      if(getUserclick() !== null){
        this.reoption()
        if(this.isJson(getUserclick())){
          //console.log('before error');

          if(typeof JSON.parse(getUserclick()).typepage !== 'undefined'){
            this.typepage = JSON.parse(getUserclick()).typepage
            //console.log(this.typepage);
            if(this.typepage=='ค้นหา'){
              this.entersearch()
            }

            //console.log(JSON.parse(getUserclick()));
          }
          if(typeof JSON.parse(getUserclick()).focusequit !== 'undefined'){
            //focus equipt ควรใช้การ load แทน การดึงมาจาก local storage
            this.focusequit = JSON.parse(getUserclick()).focusequit
            //console.log('+++++focusequit+++++++');
            //console.log(this.focusequit);
            //console.log('+++++focusequit+++++++');
            var tmp = {}
            tmp.info = "singleequipt"
            tmp.param1 = this.full_default_depart().title
            tmp.param2 = this.focusequit['ลำดับ']
            //console.log(tmp);
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$store.dispatch('info/loadinfo', tmp)
              .then((r) => {
                //console.log('++++vvv++++');
                //console.log('++++++++++focusequit');
                //console.log(this.focusequit)
                //console.log('++++++++++focusequit');
                this.focusequit = this.infoequipt_adapter(r.data[0])

                console.log('ตัวแปร this.focusequit ที่จะส่งไป form component');
                console.log(this.focusequit);
                //console.log('++++++++++getUserData');
                //console.log(JSON.parse(getUserData()))
                //console.log('++++++++++getUserData');
                //this.focusequit.empcode =
                //this.focusequit.adminstr =
                //console.log(this.focusequit);
                //console.log('++++vvv++++');
                loading.close();
                var t = this.focusequit
                this.infoscheme.typemodel = [t['อุปกรณ์'],t['ยี่ห้อ'],t['รุ่น']]
                //this.modeltoid(this.infoscheme.typemodel)
                for (var i = 0; i < t.keyelse.length; i++) {
                  this.infoscheme.keyelse[i]=t[t.keyelse[i]]
                }
                //console.log(this.infoscheme.typemodel);
                if(typeof JSON.parse(getUserclick()).equiptohis !== 'undefined'){
                  this.seltype = JSON.parse(getUserclick()).equiptohis
                  /*console.log('vvvvvvvvvvvvvvvv');
                  console.log(this.seltype);
                  console.log('vvvvvvvvvvvvvvvv');*/

                  //console.log(this.focusequit);
                }else{
                  var tmp = JSON.parse(getUserclick())
                  tmp.equiptohis = ''
                  setUserclick(tmp)
                }
                if(typeof JSON.parse(getUserclick()).seloptionhis !== 'undefined'){
                  console.log('this.seloptionhis');
                  this.seloptionhis = JSON.parse(getUserclick()).seloptionhis
                }else{
                  var tmp = JSON.parse(getUserclick())
                  tmp.seloptionhis = ''
                  setUserclick(tmp)
                }
                if(typeof JSON.parse(getUserData()).depart !=='undefined' ){
                  var t  = JSON.parse(getUserData())
                  this.focusequit.empcode = t.empcode
                }else{
                  console.log('no userdata redirect to login page, should not here');
                }
                this.fuc_refreshformreport()
              }
            )



          }else{
            this.godeviceinfo_first()
          }
        }
      }else{
        this.godeviceinfo_first()
      }
      let f = this.full_default_depart()
      this.typeuser = f.typeuser
    },
    godeviceinfo_first(){
      this.notierror('เลือกอุปกรณ์ที่ต้องการดูประวัติก่อน')
      this.$router.push({ path: '/deviceinfo/index'})
    },
    loadlocations(){

      //console.log(seltype);
      var tmp2 = {}
      tmp2.topic = 'thatlocation'
      tmp2.info = this.sellocation
      this.loadethatinfo(tmp2)
      var r= this.locations
      //console.log(r);
      var rr = r.map(obj =>{
         var rObj = {};
         rObj.value = obj.ID;
         rObj.label = `${obj.TypeOffice}.${obj.Name1}`;
         return rObj;
      });
      this.options = rr
    },
    loadequipt(){

      //console.log(seltype);
      var tmp2 = {}
      tmp2.topic = 'thatquipt'
      tmp2.info = this.seltype
      this.loadethatinfo(tmp2)
      //console.log(this.equiptype);
      var r= this.equiptype
      //console.log('+65564+5++4+');
      //console.log(r);
      var rr = r.map(obj =>{
         var rObj = {};
         rObj.value = obj.id;
         rObj.label = obj.equip;
         return rObj;
      });
      this.options = rr
      //console.log('77777');
      //console.log(JSON.parse(getUserclick()));
      //console.log(this.options);
      if(this.isJson(getUserclick())){
        if(typeof JSON.parse(getUserclick()).selcol === 'undefined'){
          console.log("selcol === 'undefined'");
          var tmp = JSON.parse(getUserclick())

          tmp.selcol = this.options
          setUserclick(tmp)
          console.log(JSON.parse(getUserclick()));
        }else{
          var seltype = 'เลือกอะไรสักอย่าง'
        }
      }

    },
   loadethatinfo(v){
     if(this.checktypem==v.topic){
       //console.log(this.checktypem);
       //console.log(v);
       var tmp = {}
       tmp.info = this.checktypem
       tmp.param1 = JSON.parse(getUserData()).depart
       tmp.param2 = v.info
       //tmp.param3 = this.seltype
       //console.log(tmp);
       this.$store.dispatch('info/loadinfo', tmp)
         .then((r) => {
           r= r.data
           this.tableData = r
           this.ortableData = r
           this.reindex()
           if(v.topic==='thatquipt'){
             if(r.length>0){
               var mrk = Object.keys(JSON.parse(r[0].infodetail))
             }else{
               var mrk = []
             }
           }else if (v.topic==='thatlocation') {
             var mrk = []
           }

           this.allkey = this.dallkey.concat(mrk)
           //console.log(this.allkey);
           if(this.isJson(getUserclick())){
             var tmp = JSON.parse(getUserclick())
             //console.log(tmp);
             if(this.checktypem==='thatquipt'){
               if(typeof JSON.parse(getUserclick()).selcol !== 'undefined'){
                 /*console.log('+++');
                 console.log(tmp);
                 console.log('+++');*/
                 var found = tmp.selcol.find(function(element) {
                   /*console.log('+++');
                   console.log(element);
                   console.log(v);
                   console.log('+++');*/
                   return element.value === v.info;
                 });
                 //console.log('5555');
                 //console.log(found);
                 if(typeof found !=='undefined'){
                   if(typeof found.selthis !== 'undefined'){
                     //console.log('typeof found.selthis !==');
                     this.checkedCities = found.selthis
                   }else{
                     this.checkedCities = this.allkey
                     //console.log('fak');
                   }
                 }

               }
             }else if (this.checktypem==='thatlocation') {

               if(typeof JSON.parse(getUserclick()).selloccol !== 'undefined'){
                 //console.log('+++++');
                 //console.log(JSON.parse(getUserclick()));
                 this.checkedCities = tmp.selloccol

               }else{
                 this.checkedCities = this.allkey

                 //console.log('fak');
                 // this.selthiscol(v.info)
                 //console.log(selthiscol);
               }
             }
             this.selthiscol()

           }

           //console.log(this.allkey);
           var rr = r.map(obj =>{
              var rObj = {};
              rObj.value = obj.id;
              rObj.label = obj.equip;

              return rObj;
           });
           NProgress.done()
         })
         .catch((e) => {
           console.log(e);
           NProgress.done()
         })
     }else {
       console.log('Drop this event where motherfaker rasie');
     }

   },
   searchall(){
     if(typeof this.$refs.table != 'undefined'){
       this.$refs.table.getTableData()
     }
   },
    getData(c){
      if(typeof getUserclick() !== 'undefined'){
        var tmp = JSON.parse(getUserclick())
        if(typeof JSON.parse(getUserclick()).forsearchhistory !== 'undefined'){
          tmp.forsearchhistory = this.forsearchdevice

          setUserclick(tmp)
        }else{
          tmp.forsearchhistory = {}
          tmp.forsearchhistory = this.forsearchdevice
          setUserclick(tmp)
        }
        setUserclick(tmp)


      }
      console.log('searchall');
      console.log(this.checksearch);
      var st = this.forsearchdevice.toUpperCase().split(' ')
      //console.log(st);
      var rx = ''
      for (var i = 0; i < st.length; i++) {
        rx+=st[i]
        if(i<st.length-1){
          rx+='|'
        }
      }
      var re = new RegExp(rx, "g");
      console.log(re);
      return new Promise((resolve, reject) => {
        try {
          this.tableData = ''
          this.tableData = this.ortableData.filter(e=>{
            var astext = JSON.stringify(e)
            //console.log(astext);
            var astext = astext.toUpperCase()
            var matches = astext.match(re);

            if(matches!=null){
              //console.log(matches);
              matches = [...new Set(matches)];
              if(this.checksearch=='or'){
                if(matches.length>0){
                  return e
                }
              }else if (this.checksearch=='and') {
                if(matches.length===st.length){
                  return e
                }
              }
            }


          });
          this.reindex()
          resolve(this.tableData)
        } catch (e) {
          console.log(e);
          reject(e)
        }
        })
      //console.log(this.ortableData);
    },
    reindex(){
      for (var i = 0; i < this.tableData.length; i++) {
        this.tableData[i].id = i+1
      }
    },
    handleCommand(c){
      if(c=="mshowupload"){
        console.log('mshowupload');
        this.showupload = true
        this.showview = false
        this.curmenu = 'Upload'
      }
      if(c=="mshowview"){
        console.log('mshowview');
        this.showupload = false
        this.showview = true
        this.curmenu = 'View'

      }

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

       if(this.isJson(getUserclick())){
         if(this.checktypem==='thatquipt'){
             if(typeof JSON.parse(getUserclick()).selcol !== 'undefined'){
               var tmp = JSON.parse(getUserclick())
               var rt = tmp.selcol.map(obj =>{
                  var rObj = {};
                  rObj.value = obj.value;
                  rObj.label = obj.label;
                  //if(typeof rObj.selthis !== 'undefined'){
                    rObj.selthis = obj.selthis;
                  //}
                  if(rObj.value===this.seltype){
                    rObj.selthis = this.checkedCities;
                  }
                  return rObj;
               });
               tmp.selcol = rt
               setUserclick(tmp)
               //console.log(JSON.parse(getUserclick()));
             }
         }else if (this.checktypem==='thatlocation') {
           //console.log('11111111111111');
           //console.log(this.checkedCities);
           var tmp2 = JSON.parse(getUserclick())
           tmp2.selloccol = this.checkedCities
           //console.log(JSON.stringify(tmp2));
           setUserclick(tmp2)

           //console.log(JSON.parse(getUserclick()));
             //console.log('+++++++');
             //console.log(JSON.parse(getUserclick()));
         }
       }

     },
    resetDateFilter() {
        this.tableData = this.ortableData
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
        await axios.post(process.env.VUE_APP_BASE_SERVER+"info/uploadfile", formData)
          .then( (res)=> {
            //console.log('here result na');
            //this.tableData = result.data
            res = res.data
            if(res.code===50072){
              this.dialogthispage = true
              var l = res.all.length
              this.servererror = true
              this.dialogtitle = 'Error ทั้งหมด '+l+' แห่ง'
              this.dialogmessage = res.all
            }
            console.log(res);
          }, function (error) {
            console.log(error);
          });
      } catch (e) {
        console.log(e);
      } finally {

      }

        //return false
    }
  }
}
</script>
