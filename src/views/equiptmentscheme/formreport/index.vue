<template>
  <div class="app-container">
  <div class="viewmenu" v-if="showview">
    <el-row :gutter="10">
      <el-col :xs="6" :sm="6">
        <div class="">
          <el-select v-model="creport.selequipt" filterable placeholder="Select">
            <el-option
              v-for="item in optioneq"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="buttun_text">
          เลือกอุปกรณ์ที่จะสร้างแบบฟอร์ม
        </div>
      </el-col>
      <el-col :xs="5" :sm="5">

        <div class="">
          <el-select v-model="creport.seltype" filterable placeholder="Select">
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
      <el-col :xs="9" :sm="9">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="6"
          v-if="creport.seltype!='ทั้งหมด'" v-bind:style= "[(typepage=='เพิ่ม') ? bgtopnav:bgtopnavn]">
            <div class=""><el-button icon="el-icon-plus" circle type="warning" @click="enteradd()"></el-button></div>
            <div class="buttun_text">เพิ่ม/แก้ไข</div>
          </el-col>
          <el-col :xs="12" :sm="6"
          v-bind:style= "[(typepage=='ค้นหา') ? bgtopnav:bgtopnavn]">
            <div class=""><el-button icon="el-icon-search" circle @click="entersearch()"></el-button></div>
            <div class="buttun_text">ค้นหา</div>
          </el-col>
          <el-col :xs="24" :sm="12">
          <span class="resnum">ผลลัพธ์ {{tableData.length}} รายการ</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>


  </div>
<hr>

    <!--<el-button @click="resetDateFilter">reset date filter</el-button>-->
    <div class="boxsearch" v-if="typepage=='ค้นหา'">
      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        slot="empty"
        style="width: 100%">

        <el-table-column
          prop="id"
          label="ที่"
          width="70px"
          column-key="date"
        >
        </el-table-column>
        <el-table-column
          v-for="elem in checkedCities"
          :prop="elem"
          :label="elem"
          width=""
          column-key="date"
        >
        </el-table-column>
        <el-table-column
          prop="tag"
          label="Action"
          width="180"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="but2n(scope.$index,tableData,'edit')">แก้ไข</el-button>
            <el-button type="warning" plain size="mini" @click="but2n(scope.$index,tableData,'delete')">ลบ</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  <div class="boxadd" v-else-if="typepage=='เพิ่ม'&&seltype!='ทั้งหมด'">
    <div class="box_add_event">
      <el-form :model="creport">
        <el-form-item>
          <el-input
            placeholder="ใส่ชื่อแบบฟอร์ม"
            v-model="nameform"
            :disabled="edittext"
            autocomplete="off"></el-input>
          <div class="buttun_text">
            ชื่อแบบฟอร์ม (งดใช้ * & ' " / \ [ ])
          </div>
        </el-form-item>

      </el-form>

      <hr>
      <div class="" v-for="(elem,index) in masterScheme" >
        <el-row :gutter="10">
          <el-col :xs="4" :sm="4" class="faxr">
            <div class="w100">
              <div class="" v-if="elem.isshow">
              {{elem.config.topic}} :
              </div>
              <div class="" v-else>
                ซ่อน
              </div>
            </div>
          </el-col>
          <el-col :xs="14" :sm="14">
            <div class="" v-if="!elem.isshow">
              {{elem.typeelement}} นี้
            </div>
            <div class="" v-else-if="elem.typeelement=='ข้อความ'">
              <el-input
                v-if="elem.config.radiotext =='สั้น'"
                placeholder="Please input"
                v-model="elem.config.info"></el-input>
              <el-input
                type="textarea"
                v-if="elem.config.radiotext =='ยาว'"
                :rows="2"
                placeholder="Please input"
                v-model="elem.config.info">
              </el-input>
              <div v-if="elem.config.ispicture" class="buttun_text">
                **หัวข้อนี้ให้แนบรูปภาพด้วย
              </div>
            </div>
            <div class="" v-else-if="elem.typeelement=='Check box'">
              <div class="" v-for="elem2 in elem.config.groupradio">
                <el-row :gutter="7" v-if="elem2.radio!=''">
                  <el-col :xs="24" :sm="8">
                    <el-radio v-model="elem.config.choseradio" :label="elem2.radio">{{elem2.radio}}</el-radio>
                    <editorImage color="#1890ff" v-if="typeof elem2.info.list!='undefined'"
                    :key="refresheditimg"
                    class="editor-upload-btn"
                    @listendata="datafromeimg"
                    :imagedetail="isview(elem2.info)"
                    :infoelem="index"/>
                  </el-col>
                <el-col :xs="24" :sm="16" v-if="elem2.istext =='มี'&&elem.config.choseradio ==elem2.radio">
                  <el-row :gutter="7">
                    <el-col :xs="24" :sm="4">
                      ระบุ:
                    </el-col>
                    <el-col :xs="24" :sm="17">
                    <el-input
                      placeholder="Please input"
                      v-model="elem2.info.istext"></el-input>
                    </el-col>
                  </el-row>
                </el-col>
                </el-row>
              </div>
            </div>
            <div class="" v-else-if="elem.typeelement=='Select box'">
              <el-select v-model="elem.config.choseradio" placeholder="Select">
                <el-option
                  v-for="elem2 in elem.config.groupradio"
                  v-if="elem2.radio!=''"
                  :label="elem2.radio"
                  :value="elem2.radio">
                </el-option>
              </el-select>
            </div>
            <div class="" v-else-if="elem.typeelement=='รูปภาพ/คำอธิบาย'">
              สำหรับเพิ่มรูปภาพ
            </div>
            <div class="" v-else-if="elem.typeelement=='ผู้ปฏิบัติ'">
              สำหรับเพิ่มผู้ปฏิบัติ
            </div>

          </el-col>
          <el-col :xs="5" :sm="5">
            <el-button type="info" icon="el-icon-view"
              @click="but3tom(index,'showthis')"
              v-if="!elem.isshow"
            size="mini" circle></el-button>
            <el-button type="info" icon="el-icon-minus"
              @click="but3tom(index,'hidethis')"
              v-if="elem.isshow"
            size="mini" circle></el-button>
            <el-button type="info" icon="el-icon-delete"
              @click="but3tom(index,'delthis')"
              v-if="elem.isshow"
            size="mini" circle></el-button>
            <el-button type="success" icon="el-icon-arrow-down"
              @click="but3tom(index,'downlist')"
              v-if="elem.isshow&&index<masterScheme.length-1"
            size="mini" circle></el-button>
            <el-button type="success" icon="el-icon-arrow-up"
              @click="but3tom(index,'uplist')"
              v-if="elem.isshow&&index!=0"
            size="mini" circle></el-button>

          </el-col>
      </el-row>
      <hr>

      </div>
      <div  class="aright" >
        <el-button type="warning" @click="entermasterscheme()">บันทึกแบบฟอร์ม</el-button>
      </div>
    </div>
    <div class="box_add_event">
      <div class="sel_sadd">
        <el-select v-model="selsadd" placeholder="เลือกประเภทที่ต้องการเพิ่ม">
          <el-option
            v-for="item in optionsadd"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

      </div>
      <div class="action_sel_sadd">
        <div class="add_text" v-if="selsadd=='ข้อความ'">
          หัวข้อ:<el-input placeholder="หัวข้อ" v-model="inputtext"></el-input>
          <div class="box1">
            ขนาด:
            <el-radio v-model="radiotext" label="สั้น">สั้น</el-radio>
            <el-radio v-model="radiotext" label="ยาว">ยาว</el-radio>
          </div>
          <div class="box1">
            <el-checkbox v-model="ispicture">ให้แนบรูปภาพด้วย</el-checkbox>
          </div>
        </div>
        <div class="add_check_box" v-if="selsadd=='Check box'">
          หัวข้อ:<el-input placeholder="หัวข้อ" v-model="inputtext"></el-input>
          <div class="box1">
            หัวข้อย่อย:
            <el-row :gutter="10" v-for="(elem,index) in groupradio">
              <el-col :xs="14" :sm="14">
                <el-input
                class="box2"
                placeholder="พิมพ์แล้วกด Enter เพื่อเพิ่มหัวข้อย่อย"
                @keyup.enter.native="addgroupradio(elem.radio)"
                v-model="elem.radio"
                ></el-input>
              </el-col>
              <el-col :xs="10" :sm="10">
                <div class="box1">
                  มีข้อความหลังจากติ๊ก:
                  <el-radio v-model="elem.istext" label="มี">มี</el-radio>
                  <el-radio v-model="elem.istext" label="ไม่มี">ไม่มี</el-radio>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24">
                  <editorImage color="#1890ff"
                  :key="refresheditimg"
                  class="editor-upload-btn"
                  @listendata="datafromeimg"
                  :imagedetail="isview('edit')"
                  :infoelem="index"/>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="add_select_box" v-if="selsadd=='Select box'">
          หัวข้อ:<el-input placeholder="หัวข้อ" v-model="inputtext"></el-input>
          <div class="box1">
            หัวข้อย่อย:
            <el-row :gutter="10" v-for="elem in groupradio">
                <el-input
                class="box2"
                placeholder="พิมพ์แล้วกด Enter เพื่อเพิ่มหัวข้อย่อย"
                @keyup.enter.native="addgroupradio(elem.radio)"
                v-model="elem.radio"
                ></el-input>
            </el-row>
          </div>
        </div>
        <div class="add_picture_box" v-if="selsadd=='รูปภาพ/คำอธิบาย'">
          หัวข้อ:<el-input placeholder="หัวข้อรูป" v-model="inputtext"></el-input>
        </div>
        <div class="add_picture_box" v-if="selsadd=='embed'">
          หัวข้อ:<el-input placeholder="หัวข้อสิ่งที่จะฝังลงไป" v-model="inputtext"></el-input>
        </div>
        <el-button type="success"
        v-if="selsadd!='ซ่อน'"plain
        size="mini" @click="addtoscheme()">เพิ่มรูปแบบ</el-button>
      </div>

    </div>

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
  .viewmenu{
    margin: auto;
    width: 900px;
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
import editorImage from '@/views/components/Editimage'
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
NProgress.configure({ showSpinner: false })



export default {
  name: 'ComplexTable',
  mixins: [freqmethods],
  components: { Pagination,editorImage },

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
      schemitodel: {},
      nameform:'',
      creport: {
        nameform: '',
        selequipt: '',
        seltype: ''
      },
      edittext: false,
      imagedetail: {},
      refresheditimg: '',
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
      typepage: 'เพิ่ม',
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
      optioneq: [],
      optionsadd:[{value: 'ข้อความ',label: 'ข้อความ'},
        {value: 'Check box',label: 'Check box'},
        {value: 'Select box',label: 'Select box'},
        {value: 'รูปภาพ/คำอธิบาย',label: 'รูปภาพ/คำอธิบาย'},
        {value: 'ผู้ปฏิบัติ',label: 'ผู้ปฏิบัติ'},
        {value: 'ซ่อน',label: 'ซ่อน'},],
      allkey: [],
      dallkey: ['อุปกรณ์','ยี่ห้อ','รุ่น','สถานที่','รหัสทรัพย์สิน'],
      dialogthispage: false,
      dialogtitle: '',
      dialogdata: '',
      dialogtype: '',
      servererror: false,
      dialogmessage: '',
      loading: false,
      fileupload: '',
      tableData: [],
      ortableData: [],
      ispicture:false,
    }
  },
  watch: {
    'creport.selequipt': function (v){
      //console.log(v);
      this.tableData = []
      if(typeof getUserclick() !== 'undefined'){
        var tmp = JSON.parse(getUserclick())
        if(typeof JSON.parse(getUserclick()).creport !== 'undefined'){
          tmp.creport.selequipt = v
          setUserclick(tmp)
        }else{
          tmp.creport = {}
          tmp.creport.selequipt = v
          setUserclick(tmp)
        }
      }
    },
    'creport.seltype': function (v){
      this.tableData = []
      if(typeof getUserclick() !== 'undefined'){
        var tmp = JSON.parse(getUserclick())
        if(typeof JSON.parse(getUserclick()).creport !== 'undefined'){
          tmp.creport.seltype = v
          setUserclick(tmp)
        }else{
          tmp.creport = {}
          tmp.creport.seltype = v
          setUserclick(tmp)
        }
      }
      this.entersearch()
    },
    selsadd(){
      this.resetval()
    },
    loadingmainpage(v){
      //console.log(v);
      if(!v){
        this.queryfirstvalue()
      }
    },
    typepage(v){
      var tmp = JSON.parse(getUserclick())
      if(typeof JSON.parse(getUserclick()).creport !== 'undefined'){
        tmp.creport.typepage = v
        setUserclick(tmp)
      }else{
        tmp.creport = {}
        tmp.creport.typepage = v
        setUserclick(tmp)
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
    //console.log(this.equiptype);

  },
  methods: {
    fillinputform(d){
      this.masterScheme = d.detail.detail
      this.nameform = d['ชื่อแบบฟอร์ม']
      console.log(this.masterScheme);
    },
    isview(e){
      if(e=='edit'){
        var e= {}
        e.actscheme = 'edit'
      }else{
        e.actscheme = 'view'
      }
      return e
    },
    but2n(i,d,v){
      if(v=='info'){

      }else if (v=='edit') {
        if(typeof getUserclick() !== 'undefined'){
            var tmp = JSON.parse(getUserclick())
            tmp.focusformreport = d[i]
            this.typepage = 'เพิ่ม'
            this.fillinputform(d[i])

            setUserclick(tmp)
        }else {
          console.log('wrong here!! fix it');
        }
      }else if (v=='delete') {
        console.log(d[i]);
        var di = d[i]
        this.dialogthispage = true
        this.dialogtitle = "แน่ใจหรือ"
        this.dialogdata = `คุณต้องการลบแบบฟอร์ม "การ${di['ประเภทประวัติ']}" ชื่อ "${di['ชื่อแบบฟอร์ม']}" ของ "${di['ประเภทอุปกรณ์']}"  ใช่หรือไม่?`
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
    addhisoper(){
      var tmp = {};
      tmp.date = this.datetostr(this.operationhistory.tmp.date)
      tmp.text = this.operationhistory.tmp.text
      //console.log(tmp);
      var n = this.operationhistory.operation.length
      console.log(this.operationhistory.operation[n-1]);
      if(this.operationhistory.tmp.date!=''&&this.operationhistory.tmp.text!=''){
        if(this.operationhistory.operation[0].date===''){
          this.operationhistory.operation[0] = tmp
        }else{
          this.operationhistory.operation.push(tmp)
        }
        this.operationhistory.tmp.date = ''
        this.operationhistory.tmp.text = ''
      }else{
        this.notierror('กรอกข้อมูลไม่ครบ')
      }

      //console.log(this.operationhistory);
    },
    datafromeimg(value){
      console.log(value[0]);
      var t = value[0].masterinfo
      var rcc3 = value.map(obj4 =>{
         var rObj4 = {};
         rObj4.picturetoken = obj4.mediaItem.id;
         rObj4.explanation = ''
         return rObj4;
      });
      this.groupradio[t].info.list = rcc3
      console.log(this.groupradio);
      //this.masterScheme[t].list = this.masterScheme[t].list.concat(rcc3)
      //console.log(this.masterScheme);
      //console.log(rcc3)

      //this.imagedetail = rcc3
      //console.log(this.imagedetail);
    },
    resetval(){
      this.refresheditimg = Math.floor(Math.random() * 10)
      this.groupradio = [{radio:'',istext:'ไม่มี',info:{radio:'',istext:''}}]
      this.inputselect = ''
      this.inputtext = ''
    },
    confirmdate(){
      console.log(this.dateinfo.tmpdate);
      if(this.dateinfo.selstep==''||this.dateinfo.tmpdate==''||this.dateinfo.tmpdate==null){
        this.notierror('กรอกข้อมูลไม่ครบ')
      }else{
        this.dateinfo[this.dateinfo.selstep].info = this.datetostr(this.dateinfo.tmpdate)
        this.dateinfo[this.dateinfo.selstep].detail = this.dateinfo.tmpdate//.toString()
        this.dateinfo.stepjob.number = this.dateinfo[this.dateinfo.selstep].step
        this.dateinfo.stepjob.info = this.dateinfo.selstep
        var v = this.optionstep.find((v, index)=> {
          return v.value == this.dateinfo.selstep
        });
        if(v.id<this.optionstep.length){
          this.dateinfo.selstep = this.optionstep[v.id].value
        }

        console.log(this.dateinfo)
      }
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
    addtoscheme(){
      var tmp = {}
      var s = this.selsadd
      tmp.typeelement = s
      tmp.isshow = true
      tmp.config = {}
      var iserror = false
      if(s==='ข้อความ'){
        tmp.info = ''
        if(this.radiotext==''){
          iserror = true
        }
        tmp.config.radiotext = this.radiotext
        tmp.config.ispicture = this.ispicture
      }else if (s==='Check box') {
        tmp.config.groupradio = this.groupradio
        tmp.config.choseradio = ''
        /*if(this.groupradio[0].info.istext==''){
          iserror = true
        }*/
      }else if (s==='Select box') {
        tmp.config.groupradio = this.groupradio
        tmp.config.choseradio = ''
        /*if(this.groupradio[0].info.istext==''){
          iserror = true
        }*/
      }else if (s==='รูปภาพ/คำอธิบาย') {
        tmp.info = []
        tmp.list = []
        //tmp.config.inputselect = this.inputselect
      }else if (s==='ผู้ปฏิบัติ') {
        this.inputtext = 'ผู้ปฏิบัติ'
        tmp.list = []
      }
      tmp.config.topic = this.inputtext
      if(this.inputtext==''||iserror){
        this.notierror('กรอกข้อมูลไม่ครบ')
      }else{

        this.masterScheme.push(tmp)
      }
      this.resetval()
      /*console.log('+++++++++++++++++');
      console.log(this.masterScheme);
      console.log('------------------');*/
    },
    enteradd(){
      this.typepage = 'เพิ่ม'
      var t = this.focusequit
    },
    entersearch(){
      if(this.creport.selequipt!=''&&this.creport.seltype!=''){
        this.typepage = 'ค้นหา'
        var tmp = {}
        tmp.info = 'loadformreport'
        tmp.param1 = this.creport
        tmp.param2 = ''
        //console.log(tmp);
        this.$store.dispatch('info/loadinfo', tmp)
          .then((r) => {
            //console.log(r);
            try {
              this.tableData = r.data
              this.checkedCities = Object.keys(r.data[0]);
              //if(this.checkedCities!=='null')
              this.checkedCities.length = 3
              //console.log();
              //console.log(this.tableData);
              this.reindex()
            } catch (e) {
              console.log(e);
            }

          })
      }else {
        this.notierror('ข้อมูลสำหรับการค้นหาไม่ครบ')
      }

    },
    but3tom(i,d){
      console.log(this.masterScheme);
      if(d=='delthis'){
        this.masterScheme.splice(i, 1);
      }else if (d=='hidethis') {
        this.masterScheme[i].isshow = false
      }else if (d=='showthis') {
        this.masterScheme[i].isshow = true
      }else if (d=='downlist') {
        console.log(d);
        var tmp = this.masterScheme[i]
        this.masterScheme[i] = this.masterScheme[i+1]
        this.masterScheme[i+1] = tmp
        this.masterScheme.push([])
        this.masterScheme.splice(-1,1)
      }else if (d=='uplist') {
        console.log(d);
        var tmp = this.masterScheme[i]
        this.masterScheme[i] = this.masterScheme[i-1]
        this.masterScheme[i-1] = tmp
        this.masterScheme.push([])
        this.masterScheme.splice(-1,1)
      }
      console.log(this.masterScheme);
    },
    delformscheme(){
      var d = this.schemitodel
      console.log();
      var t = {
        equiptypeID:d.detail.equiptypeID,
        typeform:d.detail.typeform,
        nameform:d.detail.nameform
      }
      var tmp = {}
      tmp.info = 'deleteform'
      tmp.param1 = t
      tmp.param2 = ''
      //console.log(tmp);
      this.$store.dispatch('info/fetchandupdate', tmp)
      .then(r=>{
        console.log('hi');
        console.log(r);
        this.dialogthispage = false
        this.entersearch()
      })
    },
    entermasterscheme(){
      console.log('-------save Schecme-------');
      var v = this.isvalidtext(this.nameform)
      console.log(v);
      if(this.creport.seltype!=='ทั้งหมด'){
        if(this.creport.seltype!=''&&this.nameform!=''&&this.creport.selequipt!='' && v){
          var t = {
            equiptypeID:this.creport.selequipt,
            typeform:this.creport.seltype,
            nameform:this.nameform,
            detail:this.masterScheme
          }
          var tmp = {}
          tmp.info = 'updateform'
          tmp.param1 = t
          tmp.param2 = ''
          //console.log(tmp);
          this.$store.dispatch('info/fetchandupdate', tmp)
          .then(r=>{
            console.log(r);
          })
        }else{
          this.notierror('สร้างข้อมูลไม่ครบ หรือ ป้อนข้อมูลไม่ถูกต้อง')
        }
      }else{
        this.notierror('กรุณาเลือกประเภทของแบบฟอร์ม')
      }

      console.log(t);
      console.log('-------------------------');
    },
    queryfirstvalue(){

      if(typeof getUserclick() !== 'undefined'){
        if(this.isJson(getUserclick())){
          //console.log('before error');
          //console.log(getUserclick());
          if(typeof JSON.parse(getUserclick()).creport !== 'undefined'){
            this.creport = JSON.parse(getUserclick()).creport
            this.typepage = this.creport.typepage
            //console.log(this.focusequit);
          }else{

          }
          if(typeof JSON.parse(getUserclick()).focusformreport !== 'undefined'){
            var tmp = JSON.parse(getUserclick()).focusformreport
            this.fillinputform(tmp)
            //console.log(this.focusequit);
          }else{

          }



        }
      }else{
        console.log('raise go back to choose equiptment');
      }
      this.optioneq = this.equiptype.map(obj =>{
         var rObj = {};
         rObj.value = obj.id;
         rObj.label = obj.equip;
         return rObj;
      });

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
    searchall(c){
      console.log(this.checksearch);
      var st = this.forsearch.toUpperCase().split(' ')
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
      this.tableData = ''
      this.tableData = this.ortableData.filter(e=>{
        var astext = JSON.stringify(e)
        //console.log(astext);
        var matches = astext.match(re);

        if(matches!=null){
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
        }


      });
      //console.log(this.ortableData);
      this.reindex()
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
               //console.log('+++++++');
               //console.log(JSON.parse(getUserclick()));
             }
         }else if (this.checktypem==='thatlocation') {
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
    }
  }
}
</script>
