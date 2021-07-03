<template>
  <div class="app-container formreportcss">
    <div class="boxadd" v-if="(typepage=='เพิ่ม'||typepage=='ดูข้อมูล')&&seltype!='ทั้งหมด'">
      <div class="" v-if="seltype!=='ข้อมูล'">
        <el-row :gutter="10" class="viewmenu">
          <el-steps :active="dateinfo_r.stepjob.number" align-center>
            <el-step title="1 เปิดงาน" :description="dateinfo_r.opendate.info"></el-step>
            <el-step title="2 รับงาน" :description="dateinfo_r.getdate.info"></el-step>
            <el-step title="3 ดำเนินการ" :description="dateinfo_r.operation.info"></el-step>
            <el-step title="4 เสร็จสิ้น" :description="dateinfo_r.finish.info"></el-step>
          </el-steps>
        </el-row>
        <el-form :model="dateinfo_r"  ref="dateinfo_r" label-width="70px" v-if="typepage!='ดูข้อมูล'">
          <el-row :gutter="10">
          <el-col :xs="8" :sm="8">
           <el-form-item label="ขั้นตอน" prop="selstep">
            <el-select v-model="dateinfo_r.selstep"  placeholder="เลือกขั้นตอน">
              <el-option
                v-for="item in optionstep"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="11" :sm="8">
            <el-form-item label="เวลา" prop="dateq">
              <el-date-picker v-model="dateinfo_r.tmpdate" type="date" placeholder="Select date and time"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="3" :sm="3">
            <el-form-item>
              <el-button type="success" plain size="mini" @click="confirmdate('dateinfo_r')">อัพเดทวันที่</el-button>
            </el-form-item>
          </el-col>
          </el-row>
        </el-form>
      </div>



      <div class="box_add_event" v-if="seltype=='ข้อมูล'">
        <span class="lotext">ข้อมูลพื้นฐาน : [ID{{focusequit.ลำดับ}}][{{focusequit.สถานที่}}] {{focusequit.อุปกรณ์}}>{{focusequit.ยี่ห้อ}}>{{focusequit.รุ่น}}</span>
        <div class="bline" v-if="typepage!='ดูข้อมูล'">
          <h4>ยี่ห้อ/รุ่น :</h4>
          <el-cascader
          width="300px"
            v-model="infoscheme.typemodel"
            :options="equiptallf"
            :disabled="typepage=='ดูข้อมูล'"
            @change="handleChangeem"></el-cascader> ><span class="tmpgrey">{{infoscheme.typemodel[1]}}>{{infoscheme.typemodel[2]}}</span>
        </div>
        <!--div class="bline">
          รหัสทรัพย์สิน : <el-input placeholder="" v-model="focusequit['รหัสทรัพย์สิน']"></el-input>
        </div-->

        <div class="d_f">
          <div class="bline_50" v-for="(elem,index) in focusequit.keyelse">
            <h4>{{elem}} :</h4> <el-input placeholder="" v-model="infoscheme.keyelse[index]"></el-input>
          </div>
        </div>



      </div>
      <div class="box_add_event viewmenu">
        <div class="" v-if="seltype!='ข้อมูล'">
          <div class="">
            กฟฟ./สฟฟ. : {{focusequit.สถานที่}}
          </div>
          <div class="">
            รายการ : {{equiptlist}}
          </div>
          ชื่อโครงการ :
          <el-input
            :disabled="typepage=='ดูข้อมูล'||seltype=='บำรุงรักษา'"
            placeholder="ห้ามซ้ำกัน อาจใส่วันที่เพื่อหลีกเลี่ยงการซ้ำกัน"
            v-model="nameproject_r"></el-input>
        </div>
        <div class="" v-else>
          ข้อมูลโดยละเอียดยิบ :
        </div>
        <div class="sel_sadd" >

            <div class="mt-1" v-if="typepage!='ดูข้อมูล'">
              เลือกแบบฟอร์ม :
              <el-select v-model="selsadd" placeholder="เลือกรูปแบบ แบบฟอร์ม">
                <el-option
                  :disabled="typepage=='ดูข้อมูล'||typeuser=='viewer'"
                  v-for="item in optionsadd"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
        </div>
      </div>
      <div class="box_add_event onlyprint">
        กฟฟ./สฟฟ. : {{focusequit.สถานที่}}
        วันที่ : {{finishinfo}}
      </div>
      <div class="box_add_event">
        <div class="mb-2" v-for="(elem,index) in masterScheme_r">
              <el-row :gutter="10" >
                <el-col :xs="24" :sm="5" class="faxr">
                  <div class="w100">
                    <div class="" v-if="elem.isshow">
                    {{elem.config.topic}} :
                    </div>
                    <div class="" v-else>
                      ซ่อน
                    </div>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="19">
                  <!-- {{elem}} -->

                  <div class="" v-if="!elem.isshow">
                    {{elem.typeelement}} นี้
                  </div>
                  <div class="" v-else-if="elem.typeelement=='ข้อความ'">
                    <el-input
                    :disabled="typepage=='ดูข้อมูล'"
                      v-if="elem.config.radiotext =='สั้น'"
                      placeholder="Please input"
                      v-model="elem.config.info"></el-input>
                    <el-input
                      type="textarea"

                      v-if="elem.config.radiotext =='ยาว'"
                      :rows="elem.config.rows"
                      :disabled="typepage=='ดูข้อมูล'"
                      placeholder="Please input"
                      v-model="elem.config.info">
                    </el-input>
                    <div v-if="elem.config.ispicture">
                      <editorImage color="#1890ff"
                      :key="refresheditimg"
                      class="editor-upload-btn"
                      @listendata="datafromeimg"
                      :imagedetail="isview(elem,'edit')"
                      :infoelem="index"/>
                    </div>

                  </div>
                  <div class="" v-else-if="elem.typeelement=='Check box'">
                    <div class="" v-for="elem2 in elem.config.groupradio">
                      <el-row :gutter="7" v-if="elem2.radio!=''">
                        <el-col :xs="24" :sm="8">
                          <el-radio v-model="elem.config.choseradio"
                          :label="elem2.radio"
                          :disabled="typepage=='ดูข้อมูล'">{{elem2.radio}}</el-radio>
                          <editorImage color="#1890ff" v-if="typeof elem2.info.list!='undefined'"
                          :key="refresheditimg"
                          class="editor-upload-btn"
                          @listendata="datafromeimg"
                          :imagedetail="isview(elem2.info,'view')"
                          :infoelem="index"/>
                        </el-col>
                      <el-col :xs="24" :sm="16" v-if="elem2.istext =='มี'&&elem.config.choseradio ==elem2.radio">
                        <el-row :gutter="7">
                          <el-col :xs="24" :sm="4">
                            ระบุ:
                          </el-col>
                          <el-col :xs="24" :sm="17">
                          <el-input
                          :disabled="typepage=='ดูข้อมูล'"
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
                      :disabled="typepage=='ดูข้อมูล'"
                        v-for="elem2 in elem.config.groupradio"
                        v-if="elem2.radio!=''"
                        :label="elem2.radio"
                        :value="elem2.radio">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="" v-else-if="elem.typeelement=='ผู้ปฏิบัติ'">
                    <el-select
                      v-model="elem.list"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :disabled="typepage=='ดูข้อมูล'"
                      placeholder="Please enter a keyword"
                      :remote-method="remote_query_user"
                      :loading="loadinguser">
                      <el-option
                      :disabled="typepage=='ดูข้อมูล'"
                        v-for="item in optionsuser"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="" v-else-if="elem.typeelement=='รูปภาพ/คำอธิบาย'">
                    <editorImage color="#1890ff"
                    :key="refresheditimg"
                    class="editor-upload-btn"
                    @listendata="datafromeimg"
                    :imagedetail="isview(elem,'')"
                    :infoelem="index"/>
                  </div>
                </el-col>
                <!-- <el-col :xs="5" :sm="5" class="viewmenu">
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

                </el-col> -->

            </el-row>
              <hr class="new1">
            </div>
            <div class="stepjob" v-if="seltype!='ข้อมูล'">
              <!-- <el-row>
                <div class="topicheader">
                  ประวัติการดำเนินการ
                </div>
                  <div>
                    <div class="boxoperationhistory"
                    v-if="operationhistory.operation[0].date !==''"
                    v-for="(elem,index) in operationhistory.operation">
                      <span class="topic">{{elem.date}} :</span> {{elem.text}}
                      <el-button type="info" icon="el-icon-delete"
                        @click="delhis(index)"
                        v-if="typepage!='ดูข้อมูล'"
                      size="mini" circle></el-button>
                    </div>
                  </div>
                  <el-row :gutter="7" v-if="typepage!='ดูข้อมูล'">
                    <el-col :xs="7" :sm="7">
                      <el-date-picker v-model="operationhistory.tmp.date" type="date"
                      placeholder="เลือกวันที่ดำเนินการ"></el-date-picker>
                    </el-col>
                    <el-col :xs="15" :sm="15">
                      <el-input
                        placeholder="คำอธิบายงาน (Enter เพื่อเพิ่มประวัติการดำเนินการ)"
                        v-model="operationhistory.tmp.text" @keyup.enter.native="addhisoper()"></el-input>
                    </el-col>

                  </el-row>
                </el-col>

              </el-row> -->
              <el-row class="viewmenu">
                <div class="topicheader">
                  ประวัติการแก้ไขข้อมูล
                </div>
                <div class="boxoperationhistory">
                  <el-row :gutter="7" v-if="seltype!=='ข้อมูล'">
                    <el-col :xs="6" :sm="6">
                      <span class="topic">{{datetostr(whoCreate.timecreate)}}</span>
                    </el-col>
                    <el-col :xs="11" :sm="11">
                      : {{whoCreate.name}} สร้างข้อมูล
                    </el-col>
                  </el-row>
                </div>

                </el-col>

              </el-row>

          <hr>
        </div>

        <div  class="aright" v-if="typepage!='ดูข้อมูล'&&typeuser=='admin'">
          <el-button type="warning" v-if="seltype!='ข้อมูล'" @click="entermasterScheme_r('history')">บันทึกประวัติกิจกรรม</el-button>
          <el-button type="warning" v-else @click="entermasterScheme_r('info')">บันทึกข้อมูลอุปกรณ์</el-button>
        </div>
      </div>


  </div>
  </div>
</template>

<style lang="scss">
.formreportcss{
  .el-input.is-disabled .el-input__inner{
    color: #90949a;
  }
  .el-radio__input.is-disabled+span.el-radio__label {
    color: #303133 !important;
  }
  .el-radio__input.is-disabled.is-checked .el-radio__inner {
    background-color: #1890ff;
    border-color: #1890ff;
  }
  .new1{
    width:95%;
    border: 1px solid #f0f2f5;
    margin: auto;
  }
}
.onlyprint{
  display:none;
}
@media print {
  @page {size: portrait}
  .viewmenu{
    display:none;
  }
  .onlyprint{
    display:block;
  }
  body {
   margin: 0;
   padding: 0 !important;
   min-width: 770px;
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
  .d_f{
  }
  .bline{
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .bline_50{
    margin-top: 5px;
    margin-bottom: 5px;
    width:418px;
    display: inline-block;
    padding-left: 12px;
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
    .app-container{
      padding: 5px;
    }
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
// eslint-disable-next-line
/* eslint-disable */
import {freqmethods} from '@/mixins/freqmethods'
import editorImage from '@/views/components/Editimage'
import { mapGetters } from 'vuex'
export default {
  name: 'formreport',
  mixins: [freqmethods],
  components: { editorImage},
  props: ['typepage',
  'whoCreate',
  'updatehistory_detial',
  'seltype',
  'focusequit',
  'masterScheme',
  'nameproject',
  'operationhistory',
  'dateinfo',
  'focushistory',
  'flagupdatehistory'],
  data() {
    return {
      masterScheme_r: [],
      nameproject_r: '',
      dateinfo_r:{
        selstep:'opendate',
        stepjob: {info:'',number:0},
        tmpdate:'',
        opendate: {info:'',step:1,detail:''},
        getdate: {info:'',step:2,detail:''},
        operation:{info:'',step:3,detail:''},
        finish:{info:'',step:4,detail:''}
      },
      refresheditimg: '',
      equiptallf: [],
      optionsadd:[],
      typeuser: '',
      selsadd: '',
      optionstep:[{value:'opendate',label:'1 เปิดงาน',id:1},
        {value:'getdate',label:'2 รับงาน',id:2},
        {value:'operation',label:'3 ดำเนินการ',id:3},
        {value:'finish',label:'4 เสร็จสิ้น',id:4}],
      infoscheme:{
        typemodel:[],
        typeid:[],
        keyelse:[]
      }
    }
  },
  computed:{
    ...mapGetters([
      'roles',
      'equiptype',
      'equiptypeall',
      'loadingmainpage'
    ]),
    finishinfo: function () {
      if(typeof this.dateinfo_r !=='undefined'){
        if(typeof this.dateinfo_r.finish !=='undefined'){
          if(typeof this.dateinfo_r.finish.info !=='undefined'){
            return this.dateinfo_r.finish.info
          }
        }

      }
    },
    equiptlist: function () {
      return this.infoscheme.typemodel.join("/")
    }
  },
  created() {
    //do something after creating vue instance
    console.log('created formreport');

  },
  mounted() {
    console.log('mounted formreport');
    this.queryfirstvalue()
    // console.log("this.focusequit.keyelse");
    // console.log(this.focusequit.keyelse)
    // console.log("this.focusequit.keyelse");
    //this.confirmdate()
  },
  watch:{
    selsadd(v){
      if(v!=''){
        var t = this.optionsadd.find(e=>{
          return e.value == v
        })
        console.log(t);
        this.masterScheme_r = t.detail
      }

      //this.resetval()
    },
    equiptall(v){
      if(v.length>0){
        console.log('equiptall in formreport');
        console.log(v);
        console.log(this.focusequit);
        this.equiptallf = v.filter(e=>{
          return e.value == this.focusequit.equiptfillter
        })
        console.log(this.equiptallf);
      }
    }
  },
  methods: {
    queryfirstvalue(){
      console.log('++++queryfirstvalue()+++++');
      this.loadallequipttype()
      var t = this.focusequit
      console.log('focusequit in queryfirstvalue');
      console.log(t);

      this.infoscheme.typemodel = [t['อุปกรณ์'],t['ยี่ห้อ'],t['รุ่น']]
      //console.log(this.infoscheme.typemodel);
      this.modeltoid(this.infoscheme.typemodel)
      for (var i = 0; i < t.keyelse.length; i++) {
        this.infoscheme.keyelse[i]=t[t.keyelse[i]]
      }
      this.okload()
      this.rerowtext()
      this.nameproject_r = this.nameproject
      this.masterScheme_r = this.masterScheme
      console.log('masterScheme_r in queryfirstvalue');
      console.log(this.masterScheme_r);
      console.log('whoCreate in queryfirstvalue');
      console.log(this.whoCreate);
      this.dateinfo_r = this.dateinfo
      if(this.seltype=='บำรุงรักษา'&&this.typepage!='ดูข้อมูล'){
        var now = new Date();
        var tmp = 0+now.getFullYear()+543
        this.nameproject_r = 'บำรุงรักษา '+this.focusequit['อุปกรณ์']+' '+tmp
        //console.log(this.nameproject_r);
      }
      let f = this.full_default_depart()
      this.typeuser = f.typeuser
    },
    confirmdate(){
      console.log('++++++++this.confirmdate');
      console.log(this.dateinfo_r.tmpdate);
      if(this.dateinfo_r.selstep==''||this.dateinfo_r.tmpdate==''||this.dateinfo_r.tmpdate==null){
        console.log('++++++++this.dateinfo');
        console.log(this.dateinfo_r);
        this.notierror('กรอกข้อมูลไม่ครบ')
      }else{
        this.dateinfo_r[this.dateinfo_r.selstep].info = this.datetostr(this.dateinfo_r.tmpdate)
        this.dateinfo_r[this.dateinfo_r.selstep].detail = this.dateinfo_r.tmpdate//.toString()
        this.dateinfo_r.stepjob.number = this.dateinfo_r[this.dateinfo_r.selstep].step
        this.dateinfo_r.stepjob.info = this.dateinfo_r.selstep
        var v = this.optionstep.find((v, index)=> {
          return v.value == this.dateinfo_r.selstep
        });
        if(v.id<this.optionstep.length){
          this.dateinfo_r.selstep = this.optionstep[v.id].value
        }

        console.log(this.dateinfo_r)
      }
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
    rerowtext(){
      //console.log(this.masterScheme_r);
      for (var i = 0; i < this.masterScheme_r.length; i++) {
        if(this.masterScheme_r[i].typeelement=='ข้อความ'&&this.masterScheme_r[i].config.radiotext=='ยาว'){
          console.log(this.masterScheme_r[i].config);
          if(typeof this.masterScheme_r[i].config.info != 'undefined'){
            var lines = this.masterScheme_r[i].config.info.split(/\r|\r\n|\n/)
            var count = lines.length;
            this.masterScheme_r[i].config.rows = count
          }
        }
      }
      this.masterScheme_r.push([])
      this.masterScheme_r.splice(-1,1)
    },
    datafromeimg(value){
      console.log(this.masterScheme_r);
      var t = value[0].masterinfo
      var rcc3 = value.map(obj4 =>{
         var rObj4 = {};
         rObj4.picturetoken = obj4.mediaItem.id;
         rObj4.explanation = ''
         return rObj4;
      });
      //console.log(this.masterScheme_r.list);
      //console.log();
      if(typeof this.masterScheme_r.list == 'undefined'){
        this.masterScheme_r[t].list = rcc3
      }else{
        this.masterScheme_r[t].list = this.masterScheme_r[t].list.concat(rcc3)
      }


      //console.log(rcc3)

      //this.imagedetail = rcc3
      //console.log(this.imagedetail);
    },
    okload(){
      console.log('startokload');
      var tmp = {}
      tmp.info = 'loadformreport'
      tmp.param1 = {
        selequipt: this.focusequit.equiptypeID,
        seltype: 'ทั้งหมด'
      }
      tmp.param2 = ''
      //console.log(this.focusequit);
      this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          console.log('issuccess');
          this.allformscheme = r.data
          this.reoptionnameform(this.seltype)
          //console.log(this.allformscheme);
        })
    },
    reoptionnameform(v){
      console.log('+++++reoptionnameform++++');
      console.log(v);
      var t = this.allformscheme.filter(e=>{
        return e['ประเภทประวัติ'] === v
      })
      console.log(t);
      this.optionsadd = t.map(o=>{
        var l = {}
        l.value = o['ชื่อแบบฟอร์ม']
        l.label = o['ชื่อแบบฟอร์ม']
        l.detail = o['detail']['detail']
        return l
      })
      //console.log(this.optionsadd);
      this.rerowtext()
      console.log('+++++reoptionnameform++++');
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
      }
      tmp.config.topic = this.inputtext
      if(this.inputtext==''||iserror){
        this.notierror('กรอกข้อมูลไม่ครบ')
      }else{

        this.masterScheme_r.push(tmp)
      }
      this.resetval()
      /*console.log('+++++++++++++++++');
      console.log(this.masterScheme_r);
      console.log('------------------');*/
    },
    handleChangeem(v){
      console.log(v);
      this.modeltoid(v)
    },
    modeltoid(t){
      //console.log(this.equiptypeall);
      this.infoscheme.typeid = t.map(e=>{
        var f
        f = this.equiptypeall.find(g=>{
          //console.log(e+ 'vs' + g.equip);
          return g.equip == e
        })
        if(typeof f != 'undefined'){
          return f.id
        }else{
          return 9999
        }

      })
      //console.log(this.infoscheme.typeid)
    },
    isview(e,i){
      if(e==''){
        e = {}
      }
      if(this.typepage=='ดูข้อมูล'||i=='view'){
        e.actscheme = 'view'
      }else{
        e.actscheme = 'edit'
      }
      if(i=='edit'&&this.typepage=='!ดูข้อมูล'){
        e.actscheme = 'edit'
      }
      return e
    },
    entermasterScheme_r(type){
      console.log('-------save Schecme(entermasterScheme_r)-------');
      console.log(this.focusequit);
      console.log(this.dateinfo_r);
      //console.log(this.masterScheme_r);
      //console.log(this.operationhistory);
      var tmp = {}
      var j = {}
      var k = {}
      var idhistory = 0
      if(type=='history'){
        tmp.info = 'updatehistory'
        j = {
          dateinfo:this.dateinfo_r,
          masterScheme:this.masterScheme_r,
          operationhistory:this.operationhistory
        }
        if(this.flagupdatehistory){
          idhistory  = this.focushistory.idhistory
        }else{
          idhistory = 0
        }
      }else if (type=='info') {
        tmp.info = 'updateinfo'
        //console.log(this.focusequit);
        this.nameproject_r = 'bypassif'
        j = {}
        for (var i = 0; i < this.focusequit.keyelse.length; i++) {
          j[this.focusequit.keyelse[i]] = this.infoscheme.keyelse[i]
        }
        console.log(j);
        var k = {
          //dateinfo_r:this.dateinfo_r,
          masterScheme:this.masterScheme_r
          //operationhistory:this.operationhistory
        }
      }
      //var v = this.isvalidtext(this.nameproject_r)
      var v = true
      if(this.nameproject_r!=""&&v){
        var t = {
          nameproject:this.nameproject_r,
          equiptypeID:this.focusequit.equiptypeID,
          locationID:this.focusequit.locationID,
          idequipmentsql:this.focusequit['ลำดับ'],
          masterTypeID:this.infoscheme.typeid[1],
          propertyCode:this.focusequit['รหัสทรัพย์สิน'],
          edgeTypeID:this.infoscheme.typeid[2],
          location:this.focusequit['สถานที่'],
          equipt:this.focusequit['อุปกรณ์'],
          typeHistory:this.seltype,
          dateinfo:this.dateinfo_r,
          idhistory: idhistory,
          infodetail:JSON.stringify(JSON.stringify(j)),
          extradetail:JSON.stringify(JSON.stringify(k)),
          adminstr:this.focusequit.adminstr,
          whoCreate:this.focusequit.empcode
        }
        tmp.param1 = t
        tmp.param2 = ''
        console.log(tmp);
        this.$store.dispatch('info/fetchandupdate', tmp)
        .then(r=>{
          //console.log('hi');
          console.log('here inserted id');
          console.log(r);
          this.$emit('resfromsql', r)
          //this.resetfirstval()
          //var tmp = JSON.parse(getUserclick())
          /*tmp.focusequit = d[i]
          tmp.seloptionhis = 'อุปกรณ์'
          console.log(d[i]);
          setUserclick(tmp)*/
          //this.queryfirstvalue()
          //this.dialogthispage = false
          //this.entersearch()
        })
      }else{
        this.notierror('กรอกข้อมูลไม่ครบ หรือไม่ถูก')
      }
      //console.log(t);
      //this.dialogthispage = true
      console.log('-------------------------');
    }
  }
}
</script>
