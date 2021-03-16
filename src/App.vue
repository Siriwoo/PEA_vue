<template>
  <div id="app">
    <v-app>
    <router-view />
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'App',
  /*created() {
   if (this.$workbox) {
     this.$workbox.addEventListener("waiting", () => {
       this.prompt = true;
     });
   }
 },
 methods: {
   async upgrade() {
     this.prompt = false;
     await this.$workbox.messageSW({ type: "SKIP_WAITING" });
   }
 },
 data() {
   return {
     prompt: false
   };
 }*/
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Kanit');

.v-application {
  font-family: 'Kanit', sans-serif !important;
}
body{
  padding: 0 !important;
}
</style>
