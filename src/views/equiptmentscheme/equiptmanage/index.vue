<template>
  <div class="app-container_add">
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
  <span class="custom-tree-node" slot-scope="{ node, data }" >
    <span v-if="node.label=='btnadd'&&typeuser=='admin'">
      + <el-button size="mini" type="primary" @click="bappend(data,'add')">เพิ่ม</el-button>
    </span>
    <span v-else>
      <span v-if="node.label!='btnadd'">+ {{ node.label }}</span>
      <span class="issmall" v-if="typeuser=='admin'">
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
      </span>
    </span>

          <!--<el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button>-->

  </span>
</el-tree>

<el-dialog :title="titledialog" :visible.sync="dialogFormVisible" width="76%">
  <el-form :model="form">
    <el-form-item label="ชื่อเต็ม" :label-width="formLabelWidth">
      <el-input :disabled="editablef" v-model="form.fullname" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="ชื่อในวงเล็บ" :label-width="formLabelWidth">
      <el-input :disabled="editablef" v-model="form.shortname" autocomplete="off"></el-input>
    </el-form-item>
    <!--<el-form-item label="Zones" :label-width="formLabelWidth">
      <el-select v-model="form.region" placeholder="Please select a zone">
        <el-option label="Zone No.1" value="shanghai"></el-option>
        <el-option label="Zone No.2" value="beijing"></el-option>
      </el-select>
    </el-form-item>-->
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" :key="refresheditimg"
      class="editor-upload-btn" @listendata="datafromeimg"
      :imagedetail="imagedetail"/>
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
//NProgress.configure({ showSpinner: false })
let id = 1000;
export default {
  components: { editorImage },
  watch: {
      filterText(val) {
        //console.log(this.equiptall);
        this.$refs.tree.filter(val);
      }
    },
  created() {
    //do something after creating vue instance
    //console.log(freqmethods);
    //NProgress.start()

  },
  mounted() {
    //do something after mounting vue instance
    if(!this.loadingmainpage){
      this.queryfirstvalue()
    }

    //console.log(this.data)
  },
  mixins: [freqmethods],
  methods: {
    queryfirstvalue(){
      this.loadallequipttype()
      this.loaduserdata()
    },
    loaduserdata(){
      let f = this.full_default_depart()
      this.typeuser = f.typeuser
    },
    loadallequipttype(){
      console.log('1');
      var ddpart = {
        admin: this.defaultdepart()
      }
      console.log(ddpart);
      this.$store.dispatch('info/loadallequipttype', ddpart)
        .then((r) => {
          r= r.data
          this.data = this.hierequipt(r)
          //NProgress.done()
        })
        .catch((e) => {
          console.log(e);
          //NProgress.done()
        })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    editlocation(data){
      console.log(data)
    },
    bappend(data,type){
      console.log(data);

      this.form.actscheme = type
      this.imagedetail.actscheme = type
      var dt = 'อุปกรณ์/ยี่ห้อ/รุ่น ของ '+ data.label
      this.refresheditimg++
      if(type=='add'){
        this.form.detail = {
          pictures:[]
        }
        this.form.fullname = ''
        this.form.shortname = ''
        this.imagedetail.list = []
        this.titledialog = 'เพิ่มรายการย่อย '+dt
        this.editablef = false
      }else if(type=='edit'){

        this.form.fullname = data.equip
        this.form.shortname = data.equip_short
        this.form.detail = JSON.parse(data.detail)
        console.log(this.form.detail);
        var pimg = JSON.parse(data.detail).pictures
        this.imagedetail.list = pimg
        this.imagedetail.albumid = this.albumIds.pea_pm
        console.log(pimg);
        this.titledialog = 'แก้ไข '+dt
        this.editablef = false
      }else if (type=='view') {
        this.form.fullname = data.equip
        this.form.shortname = data.equip_short
        this.form.detail = JSON.parse(data.detail)
        this.titledialog = 'ช้อมูล '+dt
        console.log(this.form.detail);
        var pimg = JSON.parse(data.detail).pictures
        this.imagedetail.list = pimg
        this.imagedetail.albumid = this.albumIds.pea_pm
        this.editablef = true
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
        this.loadallequipttype()
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
        typeuser: '',
        outerVisible: false,
        innerVisible: false,
        editablef: true,
        refresheditimg: 0,
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
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    }
}
</script>
<style>
.app-container_add{
  width: 1000px;
  margin: auto;
  padding: 7px;
}
@media screen and (max-width: 768px) {
  .el-dialog{
    width:98% !important;
  }

  .app-container_add{
    overflow: auto;
  }
}

  .google-map {
    width: 800px;
    height: 600px;
    margin: 0 auto;
    background: gray;
    }



</style>
