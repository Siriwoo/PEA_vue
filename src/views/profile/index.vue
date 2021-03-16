<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <transition name="fade" mode="out-in">
            <ActivityDetail @activity_detail="from_activity_detail" v-if="activeTab=='activity'"/>
            <user-card :user="user" :whoshow="whoshow" v-if="activeTab=='account'"/>
            <user-card :user="user" :whoshow="whoshow" v-if="activeTab=='timeline'"/>
          </transition>

        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Activity" name="activity" v-if="scheme!='stockecar'">
                <activity :activity_search="activity_search"
                :key="keyActivity"/>
              </el-tab-pane>

              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane label="Version" name="timeline">
                <timeline />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>
<style scoped>

</style>
<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import ActivityDetail from './components/activity_detail'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import { getUserData,getUserActivity } from '@/utils/auth'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, Account,ActivityDetail },
  data() {
    return {
      user: {},
      whoshow: 'owner',
      activeTab: 'activity',
      scheme: '',
      activity_search: {},
      keyActivity: 0,
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar'
    ])
  },
  created() {
    this.getUser()
  },
  mounted() {
    //do something after mounting vue instance
    var v = JSON.parse(getUserActivity())
    console.log(v);
    this.scheme = v.scheme
    if(v.scheme=='stockecar'){
      this.activeTab= 'account'
    }
  },
  methods: {
    from_activity_detail(f){
      console.log(f);
      if(f.person_view.length == 0){
        this.activity_search.person_view = 'ทุกคน'
      }else if (f.person_view.length == 1) {
        this.activity_search.person_view = f.person_view[0]
      }else {
        let b = ''
        for (var i = 0; i < f.person_view.length; i++) {
          let c = f.person_view[i].split(' ')
          b+= c[0]+c[1]
          if(i<f.person_view.length-1){
            b+=', '
          }
        }
        this.activity_search.person_view = b
      }
      if (f.depart_view.length > 1||f.person_view.length > 2) {
        let b = ''
        for (var i = 0; i < f.depart_view.length; i++) {
          let c = f.depart_view[i].split(' ')
          b+= c[0]+c[1]+'.'
          if(i<f.depart_view.length-1){
            b+=', '
          }
        }
        this.activity_search.depart_view = b
      }else {
        this.activity_search.depart_view = f.depart_view[0]
      }
      this.activity_search.realvalue = f
      this.keyActivity+=1
      console.log(this.activity_search);
    },
    getUser() {
      //console.log(JSON.parse(getUserData()));
      var userdata = JSON.parse(getUserData())
      this.user = {
        name: userdata.fullname,
        userdata: userdata
      }
    }
  }
}
</script>
