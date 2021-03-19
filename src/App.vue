<template>
  <div id="app">
    <v-app>
    <router-view />
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'App'
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
