<template>
  <div class="app-container">
    <el-row type="flex" class="row-bg" justify="center">
      <!-- <el-col :xs="7" :sm="7">
        <div class="">
          <el-select v-model="selequipt" filterable placeholder="Select">
            <el-option
              v-for="item in optioneq"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="buttun_text">
          เลือกอุปกรณ์ที่ต้องการดูเทียบกับสถานที่
        </div>
      </el-col> -->
      <el-col :xs="24" :sm="24" :md="12">
        <el-input
          placeholder="Filter keyword"
          v-model="filterText">
        </el-input>

        <el-tree
          class="filter-tree boxtree"
          :data="data"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          ref="tree">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span v-if="node.label=='btnadd'">
              + <el-button size="mini" type="primary" @click="bappend(data,'add')">เพิ่ม</el-button>
            </span>
            <span v-else>
              <span>+ {{ node.label }}</span>
              <!--<span>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => bappend(data,'view')">
                  <i class="el-icon-tickets"></i>ดูข้อมูล
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => bappend(data,'edit')">
                  <i class="el-icon-edit"></i>แก้ไข
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => bappend(data,'add')">
                  <i class="el-icon-plus"></i>เพิ่มรายการย่อย
                </el-button>
              </span>-->
            </span>

                  <!--<el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)">
                    Delete
                  </el-button>-->

          </span>
        </el-tree>
      </el-col>
    </el-row>


<el-dialog :title="titledialog" :visible.sync="dialogFormVisible" width="70%">
  <el-form :model="form">
    <el-form-item label="ชื่อเต็ม" :label-width="formLabelWidth">
      <el-input v-model="form.fullname" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="ชื่อในวงเล็บ" :label-width="formLabelWidth">
      <el-input v-model="form.shortname" autocomplete="off"></el-input>
    </el-form-item>
    <!--<el-form-item label="Zones" :label-width="formLabelWidth">
      <el-select v-model="form.region" placeholder="Please select a zone">
        <el-option label="Zone No.1" value="shanghai"></el-option>
        <el-option label="Zone No.2" value="beijing"></el-option>
      </el-select>
    </el-form-item>-->
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" :key="refresheditimg" class="editor-upload-btn" @listendata="datafromeimg" :imagedetail="imagedetail"/>
    </div>
  </el-form>



  <span slot="footer" class="dialog-footer" v-if="this.form.actscheme!='view'">
    <el-button @click="dialogFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="append()">Confirm</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
import editorImage from '@/views/components/Editimage'
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { getUserData } from '@/utils/auth'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import NProgress from 'nprogress' // progress bar
import { freqmethods } from '@/mixins/freqmethods'
import { mapGetters } from 'vuex'
NProgress.configure({ showSpinner: false })
let id = 1000;
export default {
  components: { editorImage },
  watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      loadingmainpage(v){
        //console.log(v);
        if(!v){
          this.loadalllocations()
          this.queryfirstvalue()
        }
      },
      selequipt(v){

      }
    },
  created() {
    //do something after creating vue instance
    //console.log(freqmethods);
    //NProgress.start()
    if(!this.loadingmainpage){
      this.loadalllocations()
    }
  },
  computed:{
    ...mapGetters([
      'locations',
      'loadingmainpage',
      'equiptype'
    ])
  },
  mounted() {
    //do something after mounting vue instance
    if(!this.loadingmainpage){
      this.queryfirstvalue()
    }
  },
  mixins: [freqmethods],
  methods: {
    queryfirstvalue(){

      this.optioneq = this.equiptype.map(obj =>{
         var rObj = {};
         rObj.value = obj.id;
         rObj.label = obj.equip;
         return rObj;
      });

    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    loadalllocations(){

      var lm = this.locations.map(obj =>{
         var rObj = {};
         rObj.id = obj.ID;
         rObj.equip_short = '';
         rObj.equip = `${obj.TypeOffice}.${obj.Name1}`;
         rObj.belong_to = obj.belong_to
         rObj.detail = {
           AddressOffice:obj.AddressOffice,
           lat:obj.lat,
           longti:obj.longti,
           detail:obj.detail,
         };

         return rObj;
      });
      //console.log(lm);
      this.data = this.hierequipt(lm)
      //console.log(this.data);
    },
    editlocation(data){
      console.log(data)
    },
    bappend(data,type){
      console.log(data);

      this.form.actscheme = type
      this.imagedetail.actscheme = type
      var dt = 'ข้อมูลของ '+ data.label
      this.refresheditimg++
      if(type=='add'){
        this.form.detail = {
          pictures:[]
        }
        this.form.fullname = ''
        this.form.shortname = ''
        this.imagedetail.list = []
        this.titledialog = 'เพิ่มรายการย่อย '+dt
      }else if(type=='edit'){

        this.form.fullname = data.equip
        this.form.shortname = data.equip_short
        var pimg
        if(this.isJson(data.detail)){
          this.form.detail = JSON.parse(data.detail)
          pimg = JSON.parse(data.detail).pictures
        }else{
          this.form.detail = {}
          pimg = []
        }
        console.log(this.form.detail);

        this.imagedetail.list = pimg
        this.imagedetail.albumid = this.albumIds.pea_pm
        console.log(pimg);
        this.titledialog = 'แก้ไข '+dt
      }else if (type=='view') {

      }
      this.tdata = data
      if(data.id==99999){
        this.tdata.id = 0
      }
      this.dialogFormVisible = true
    },
    append() {
      this.form.detail = JSON.stringify(this.form.detail)
      this.form.idmaster = this.tdata.id
      this.form.admin = `[${this.defaultdepart()}]`
      console.log(this.form);
      this.$store.dispatch('info/addequipt',this.form).then(r=>{
        //const newChild = { id: id++, label: `${this.form.fullname}(${this.form.shortname})`, children: [] };
        this.loadalllocations()
        this.dialogFormVisible = false
      }).catch(e=>{
        console.log(e);
      })
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
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    }
  },

    data() {
      return {
        tdata:'',
        selequipt: '',
        refresheditimg: 0,
        optioneq: [],
        titledialog: '',
        imagedetail: {},
        dialogFormVisible: false,
        form: {
          fullname: '',
          shortname: '',
          actscheme : '',
          detail: {},
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },

        formLabelWidth: '120px',
        filterText: '',
        data: [{
          id: 1,
          label: 'Level one 1',
          children: [{
            id: 4,
            label: 'Level two 1-1',
            children: [{
              id: 9,
              label: 'Level three 1-1-1'
            }, {
              id: 10,
              label: 'Level three 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: 'Level one 2',
          children: [{
            id: 5,
            label: 'Level two 2-1'
          }, {
            id: 6,
            label: 'Level two 2-2'
          }]
        }, {
          id: 3,
          label: 'Level one 3',
          children: [{
            id: 7,
            label: 'Level two 3-1'
          }, {
            id: 8,
            label: 'Level two 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    }
}
</script>
<style  scoped>
  .app-container{
    margin: auto;
  }

  .google-map {
    width: 800px;
    height: 600px;
    margin: 0 auto;
    background: gray;
  }
  .buttun_text{
    margin-top: 3px;
    font-size: 13px;
    color: grey;
  }



</style>
