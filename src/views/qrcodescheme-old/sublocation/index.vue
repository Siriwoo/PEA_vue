<template>
  <div class="app-container_add">
    <el-select
    v-model="value"
    filterable
    remote
    reserve-keyword
    placeholder="เลือก กฟฟ."
    :remote-method="remoteMethod"
    :loading="loading">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-button icon="el-icon-edit" circle></el-button>


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
      <!--<span class="issmall">
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
import editorImage from '../@/views/components/Editimage'
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
      this.loadallwarehouse()
    },
    remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          var tmp = {}
          tmp.info = 'loadlocationbyquery'
          tmp.param1 = query
          this.$store.dispatch('info/loadinfo', tmp)
          .then((r) => {
            this.loading = false;
            this.options = r.data.map(obj=>{
              var robj = {
                value:`${obj.TypeOffice}.${obj.Name1}`,
                item:`${obj.TypeOffice}.${obj.Name1}`
              }
               return  robj
            })
            console.log(this.options);
          })
        } else {
          this.options = [];
        }
    },
    loadallwarehouse(){
      //console.log('1');
      //console.log(getUserData());
      var ddpart = JSON.parse(getUserData()).depart

      this.loading = true;
      var tmp = {}
      tmp.info = 'loadallwarehouse'
      tmp.param1 = ddpart
      //console.log(tmp);
      this.$store.dispatch('info/loadinfo', tmp)
      .then((r) => {
        r = this.normalizer(r.data)
        this.data = this.hierequipt(r)
        console.log(this.data);
        this.loading = false;
        //console.log(r);
      })
      .catch((e) => {
        console.log(e);
        //NProgress.done()
      })
    },
    normalizer(r){
      //console.log(r);
      var v
      v = r.map(obj=>{
        var rObj = {
          id : obj.id,
          equip_short : obj.name2,
          equip : obj.name1,

        }
        if(obj.belong_to.includes("fuc")){
          rObj.belong_to = 0
        }else{
          rObj.belong_to = obj.belong_to
        }
        return rObj
      })
      console.log(v);
      return v
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    bappend(){
      console.log('tmp');
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
        options: [],
        value: [],
        list: [],
        loading: false,
        tdata:'',
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
