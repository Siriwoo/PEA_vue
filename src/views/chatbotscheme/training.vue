<template>
  <v-container class="py-2 px-1 mt-0">
    <v-card flat>
      fortraining
    </v-card>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<script>
  import axios from 'axios'
  export default{
    data () {
      return {
        text: 'fuck',
        data: []
      }
    },
    created () {
      // do something after creating vue instance
      console.log('loaded right_of_do.vue')
      axios.get(process.env.VUE_APP_BASE_SERVER_PHP+'/api/alltable.php?table=permission_line')
      .then(response => {
        console.log(response.data)
        this.data = response.data
      }).catch(e => {

      })
    }
  }
</script>
