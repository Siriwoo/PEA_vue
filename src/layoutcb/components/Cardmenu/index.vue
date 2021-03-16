<template>
  <div class="">
    <div class="forcenter">
      <div class="mainbox" @click="domenuscheme(elem.scheme)"
      v-for="elem in scheme"
      :key="elem.key">
        <img class="pic-menuscheme" :src="require(`@/assets/menu-scheme/${elem.icon}`)" alt="404">
        <div class="">
          {{elem.title}}
        </div>
      </div>
    </div>
  </div>


</template>

<script>
import { getUserData, setUserActivity, getUserActivity } from '@/utils/auth'
import store from '@/store'
import router from '@/router'
export default {
  name: 'Cardmenu',
  data(){
    return {
      scheme: []
    }
  },
  methods: {
    domenuscheme(scheme) {
      //console.log(scheme);
      this.$router.push({ path: '/dashboard'})
      async function main(){
        const accessRoutes = await store.dispatch('permission/generateRoutesScheme', scheme)
        // src/store/permission.js
        //console.log(accessRoutes);
        // dynamically add accessible routes

        if(getUserActivity()){
          var useac = JSON.parse(getUserActivity())
        }else{
          var useac = {}
        }
        useac.scheme = scheme
        setUserActivity(useac)
        router.addRoutes(accessRoutes)
        var useac2 = JSON.parse(getUserActivity())
        console.log(useac2);
        location.reload()
      }
      main()
    }
  },
  mounted() {
    const menuScheme = JSON.parse(getUserData())
    //console.log(menuScheme)
    if (menuScheme) {
      //console.log(menuScheme.menuscheme);
      this.scheme = menuScheme.menuscheme
    }else{
      console.log('redirect to use menu')
    }
  }
}
</script>

<style scoped>
.mainbox {
  display: inline-block;
  vertical-align: middle;
  width: 137px;
  height: 131px;
  background-color: #edeff4;
  border: 1px solid #d8dfea;
  border-radius: 5px 2px;
  box-shadow: 0px 0px 5px #888888;
  margin: 10px;
  text-align: center;
  padding-top: 5px;

}
.mainbox:hover {
  background-color: #656a76;
  color: white;
  cursor:pointer;
  border: 1px solid #656a76;
}
.mainbox img{
  height: 70px;
  margin: auto;
}
.hamburger.is-active {
  transform: rotate(180deg);
}
.forcenter{
  display: inline;
  margin: auto;
}
</style>
