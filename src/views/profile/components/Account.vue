<template>
  <el-form>
    <el-form-item label="ชื่อ">
      <el-input v-model.trim="user.name" disabled/>
    </el-form-item>
    <el-form-item label="คำทักทาย">
      <el-input v-model.trim="userscheme.greeting" />
    </el-form-item>

    <el-form-item>
      ต้องการดู :
      <el-select
        v-model="value"
        multiple
        filterable
        remote
        reserve-keyword
        placeholder="Please enter a keyword"
        :remote-method="remoteMethod"
        :loading="loading">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {setUserData, getUserData } from '@/utils/auth'
export default {
  data(){
    return {
      userscheme:{
        greeting: 'Hello',
        viewer: []
      },
      options: [],
      value: [],
      loading: false,
      states: ["Alabama", "Alaska", "Arizona"]
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          userdata: {}
        }
      }
    }
  },
  mounted() {
    //do something after mounting vue instance
    console.log('mounted in Account');
    console.log(this.user.userdata);
    if(this.user.userdata.viewer!==null){
      this.value = this.user.userdata.viewer.split(',')
    }

  },
  methods: {
    submit() {
      var t = {
        empcode:this.user.userdata.empcode,
        viewer:this.value,
      }
      var tmp = {}
      tmp.info = 'updateuseraccount'
      tmp.param1 = t
      tmp.param2 = ''
      //console.log(tmp);
      this.$store.dispatch('info/fetchandupdate', tmp)
      .then(r=>{
        console.log(r);
        //console.log(JSON.parse(getUserData()))
        this.user.userdata.viewer = this.value.join(',')
        setUserData(this.user.userdata)
        //console.log(JSON.parse(getUserData()))
      })
    },
    trunwordq(q){
      return q.replace(/ /gi, "%");
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        var tmp = {}
        tmp.info = 'loaddepartbyquery'
        tmp.param1 = this.trunwordq(query)
        this.$store.dispatch('info/loadinfo', tmp)
        .then((r) => {
          this.loading = false;
          this.options = r.data.map(obj=>{
            var robj = {
              value:`${obj.full_name_short}`,
              item:`${obj.full_name_short}`
            }
             return  robj
          })
          console.log(this.options);
        })
      } else {
          this.options = [];
        }
    }
  }
}
</script>
