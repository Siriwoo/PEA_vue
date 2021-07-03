<template>
  <v-container class="py-2 px-1 mt-0">
    <v-layout row wrap align-center justify-center>
      <v-flex xs12 md5 lg5>
        <v-card ref="form">
          <v-card-text>
            <v-text-field
            ref="name"
            v-model="servernameinfo"
            label="Server for information"
            placeholder=""
            required
          ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
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
// eslint-disable-next-line
/* eslint-disable */
  import { mapGetters, mapActions } from 'vuex'
  export default{
    data () {
      return {
        text: 'fuck'
      }
    },
    computed: {
      ...mapGetters(['configfile','restserver'])
    },
    mounted() {
      //do something after mounting vue instance
      var data = {}
      data.forsure = 'fetch configuration information'
      data.des = 'adn'
      // console.log(data)

      const params = new URLSearchParams()
      params.append('event_id', JSON.stringify(data))
      axios.post(this.restserver+'api/fetchconfiguration.php', params, {
        header: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      }).then(r => {
        //console.log('r: ', JSON.stringify(r, null, 2))
        this.lmenu = false
        console.log(r.data[0])
        if (r.data[0].user === 'exist') {
          console.log('user exist')
          // this.dialog = true
        } else {
          this.dialog = true
          this.AlertIcon = 'warning'
          this.textAlertTitle = 'ฮั่นแน่'
          this.textalert = 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้'

          this.$router.push({ path: '/' })
        }
      })
    }
  }
</script>
