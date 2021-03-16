<template>
  <div class="components-container">
    <aside><strong>สร้าง layout scheme ใหม่ หรือ แก้ไขของเดิม</strong>
      <el-button type="primary" @click="dialogFormVisible = true">
        <i class="el-icon-document el-icon-left" />
        New
      </el-button>
      <el-button type="primary">
        <i class="el-icon-edit-outline el-icon-left" />
        Open
      </el-button>
    </aside>
    <split-pane split="vertical" @resize="resize">
      <template slot="paneL">
        <div class="left-container" />
      </template>
      <template slot="paneR">
        <split-pane split="horizontal">
          <template slot="paneL">
            <div class="top-container" />
          </template>
          <template slot="paneR">
            <div class="bottom-container" />
          </template>
        </split-pane>
      </template>
    </split-pane>
      <el-dialog title="ตั้งค่าเริ่มต้น Layout Scheme" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Scheme name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Orientation" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="เลือกวิธีการจัดวางหน้าจอ">
            <el-option v-for="item in orientation" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>

      <div class="chooseschreme">
        <el-form-item label="Type Scheme">
          <table class="tabletype">
            <tr>
              <td tabindex="0"><div class="single"></div>Single</td>
              <td tabindex="0"><div class="single">
                <div class="two-hor"></div>
              </div>two-horizontal</td>
              <td tabindex="0"><div class="single">
                <div class="two-ver"></div>
              </div>two-vertical</td>
            </tr>
            <tr>
              <td tabindex="0"><div class="single">
                <div class="three-hor1"></div>
                <div class="three-hor2"></div>
              </div>three-horizontal</td>
              <td tabindex="0"><div class="single">
                <div class="three-ver1"></div>
                <div class="three-ver2"></div>
              </div>three-vertical</td>
              <td tabindex="0"><div class="single">
                <div class="three-vh1"></div>
                <div class="three-vh2"></div>
              </div>three-ver-hor</td>
            </tr>
          </table>
        </el-form-item>

      </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'

export default {
  name: 'SplitpaneDemo',
  data() {
    return{
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        orientation: this.$store.getters.orientation,
        formLabelWidth: '120px'
    }
  },
  components: { splitPane },
  methods: {
    resize() {
      console.log('resize')
    }
  },
  mounted() {
    //do something after mounting vue instance
    console.log(this.orientation);
  }
}
</script>

<style  scoped>
.tabletype{
  width: 100%;
  text-align: center;
  border-spacing: 15px;
}
.tabletype td{
  width: 33%;
}
.tabletype td:focus {
    background-color:#eef1f6;
}
.single{
  width: 55%;
  background-color: #F38181;
  padding-top: 45%;
  margin: auto;
  position: relative;
}
.two-hor{
  position: absolute;
  bottom: 0px;
  height: 40%;
  width: 100%;
  background-color: #FCE38A;
}
.two-ver{
  position: absolute;
  right: 0px;
  top: 0px;
  height: 100%;
  width: 40%;
  background-color: #FCE38A;
}
.three-ver1{
  position: absolute;
  right: 0px;
  top: 0px;
  height: 100%;
  width: 20%;
  background-color: #FCE38A;
}
.three-ver2{
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100%;
  width: 20%;
  background-color: #95E1D3;
}
.three-hor1{
  position: absolute;
  right: 0px;
  top: 0px;
  height: 20%;
  width: 100%;
  background-color: #FCE38A;
}
.three-hor2{
  position: absolute;
  left: 0px;
  bottom: 0px;
  height: 20%;
  width: 100%;
  background-color: #95E1D3;
}
.three-vh1{
  position: absolute;
  right: 0px;
  top: 0px;
  height: 55%;
  width: 50%;
  background-color: #FCE38A;
}
.three-vh2{
  position: absolute;
  left: 0px;
  top: 0px;
  height: 55%;
  width: 50%;
  background-color: #95E1D3;
}
  .components-container {
    position: relative;
    height: 100vh;
  }

  .left-container {
    background-color: #F38181;
    height: 100%;
  }

  .right-container {
    background-color: #FCE38A;
    height: 200px;
  }

  .top-container {
    background-color: #FCE38A;
    width: 100%;
    height: 100%;
  }

  .bottom-container {
    width: 100%;
    background-color: #95E1D3;
    height: 100%;
  }
</style>
