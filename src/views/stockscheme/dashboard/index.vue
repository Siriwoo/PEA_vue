<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    //console.log('comhere before loop');
    console.log('created dashboard');
    if (!this.roles.includes('admin')) {
      //this.currentRole = 'adminDashboard'
    }
  },
  mounted() {
    //do something after mounting vue instance
    console.log('dashboard');
  }
}
</script>
<style lang="scss">
.dashboard-container{
  background-color: rgb(240, 242, 245);
}

@import url('https://fonts.googleapis.com/css?family=Kanit');

html, body {
  font-family: 'Kanit', sans-serif;
}
</style>
