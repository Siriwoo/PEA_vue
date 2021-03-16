<template>
  <v-container class="py-2 px-1 mt-0">
    <v-layout row wrap align-center justify-center>
      <v-flex xs12 md4 lg4 sm9>

        <v-card flat class="py-0 px-0 mt-0">

            <v-tabs
              centered
              color="secondary"
              dark
              icons-and-text
              v-model="tab"
              grow
              height="50px"
            >
            <v-tabs-slider color="accent"></v-tabs-slider>

              <v-tab href="#tab-1">

                เข้าสู่ระบบ
              </v-tab>

              <v-tab href="#tab-2">
                ลงทะเบียน
              </v-tab>
              <v-tab-item
                v-for="i in 2"
                :id="'tab-' + i"
                :key="i"
              >
                <div v-if="i=='1'">
                  <v-form ref="form" v-model="valid" lazy-validation>
                  <div class="blocklogin px-2 py-2">
                    พิมพ์ชื่อ/รหัสเพื่อเข้าสู่ระบบ
                    <div class="py-3">
                      <v-text-field
                        v-model="name"
                        :rules="nameRules"
                        :counter="10"
                        label="Name"
                        required
                      ></v-text-field>
                    </div>
                    <div class="py-2">
                      <v-text-field
                        v-model="password"
                        :rules="passRules"
                        :append-icon="show1 ? 'visibility_off' : 'visibility'"
                        :type="show1 ? 'text' : 'password'"
                        label="Password"
                        required
                        @click:append="show1 = !show1"
                      ></v-text-field>
                    </div>

                    <v-btn
                      :disabled="!valid"
                      @click="submit"
                      block
                    >
                      เข้าสู่ระบบ
                    </v-btn>
                    <v-btn @click="clear"
                    block>clear</v-btn>
                  </div>
                  </v-form>
                </div>
                <div v-if="i=='2'">
                  <v-form ref="form" v-model="valid2" lazy-validation>
                  <div class="py-2">
                    <div class="blocklogin px-2 py-2">
                      พิมพ์ชื่อ/รหัส เพื่อลงทะเบียนใช้งานระบบที่ดีที่สุดในโลก
                      <div class="py-3">
                        <v-text-field
                          v-model="sname"
                          :rules="nameRules"
                          :counter="10"
                          label="Name"
                          required
                        ></v-text-field>
                      </div>
                      <div class="py-2">
                        <v-text-field
                          v-model="spassword"
                          :rules="passRules"
                          :append-icon="show1 ? 'visibility_off' : 'visibility'"
                          :type="show1 ? 'text' : 'password'"
                          label="Password"
                          required
                          @click:append="show1 = !show1"
                        ></v-text-field>
                      </div>
                      <div class="py-3">
                        <v-text-field
                          v-model="cpassword"
                          :rules="passRules"
                          :append-icon="show1 ? 'visibility_off' : 'visibility'"
                          :type="show1 ? 'text' : 'password'"
                          label="Confirm Password"
                          required
                          @click:append="show1 = !show1"
                        ></v-text-field>
                      </div>
                      <v-btn
                        :disabled="!valid2"
                        @click="signup"
                        block
                      >
                        ลงทะเบียน
                      </v-btn>
                      <v-btn @click="clear"
                      block>clear</v-btn>
                    </div>
                  </div>
                  </v-form>
                </div>
                </v-tab-item>
            </v-tabs>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="dialog"
      width="500"
    >

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          <v-icon>{{AlertIcon}}</v-icon> {{textAlertTitle}}
        </v-card-title>

        <v-card-text>
          {{textalert}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
.fimg {
  text-align: center;
}
.fimg img{
  width:90%;
}
</style>

<script>
  import axios from 'axios'
  import { mapGetters, mapActions } from 'vuex'
  export default{
    data () {
      return {
        text: 'fuck',
        sname: '',
        spassword: '',
        cpassword: '',
        tab: '',
        AlertIcon:'',
        textAlertTitle:'',
        statusLogin: '',
        textalert:'',
        dialog: false,
        show1: false,
        valid: true,
        valid2: true,
        name: '',
        password: '',
        nameRules: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 10) || 'Name must be less than 10 characters'
        ],
        passRules: [
          v => !!v || 'Password is required'
        ]
      }
    },
    computed:{
      ...mapGetters(['restserver'])
    },
    mounted() {
      //do something after creating vue instance
      //this.lmenu = true
      //console.log('Is here validate.vue');
      console.log(this.restserver);
      var data = {}
      data.forsure = 'checksession'
      data.des = 'nrl'
      // console.log(data)
      console.log();
      const params = new URLSearchParams()
      params.append('event_id', JSON.stringify(data))
      //console.log('test');
      axios.post(this.restserver+'api/checksession.php', params, {
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

    },
    methods: {
      ...mapActions(['set_statusLogin','set_usermenu']),
      signup () {
        //console.log(this.$refs.form);
        if (this.spassword === this.cpassword){
          if (this.$refs.form[1].validate()) {
            // Native form submission is not yet supported
            var data = {}
            data.name = this.sname
            data.password = this.cpassword
            // console.log(data)
            const params = new URLSearchParams()
            params.append('event_id', JSON.stringify(data))
            axios.post(this.restserver+'api/signup.php', params, {
              header: {
                'Content-type': 'application/x-www-form-urlencoded'
              }
            }).then(r => {
              //console.log('r: ', JSON.stringify(r, null, 2))
              console.log(r.data)
              if (r.data[0].code === '200') {
                this.AlertIcon = 'warning'
                this.textAlertTitle = 'OK OK OK'
                this.textalert = 'เป็นอันว่าคุณใช้ user '+r.data.userid+' เพื่อเข้าสู่ระบบน๊ะจ๊ะ'
                this.dialog = true
                var response = {}
                response = r.data[0]
                //response.profile = JSON.parse(r.data[0].profile)
                this.set_statusLogin(response)
                this.$router.push({ path: '/timeline' })
              }else if (r.data[0].code === '401') {
                this.AlertIcon = 'warning'
                this.textAlertTitle = 'ฮั่นแน่....'
                this.textalert = 'userid นี้ ถูกใช้ไปแล้วจ้า'
                this.dialog = true
              }else {
                console.log('valid')

              }
            })
          }
        }else{
          this.AlertIcon = 'warning'
          this.textAlertTitle = 'Oh noooo'
          this.textalert = 'password ที่พิมพ์ไม่ตรงกันน่ะ'
          this.dialog = true
        }

      },
      submit () {
        //console.log(this.$refs.form);
        if (this.$refs.form[0].validate()) {
          // Native form submission is not yet supported
          var data = {}
          data.name = this.name
          data.password = this.password
          // console.log(data)
          const params = new URLSearchParams()
          params.append('event_id', JSON.stringify(data))
          axios.post(this.restserver+'api/submit.php', params, {
            header: {
              'Content-type': 'application/x-www-form-urlencoded'
            }
          }).then(r => {
            //console.log('r: ', JSON.stringify(r, null, 2))
            console.log(r.data[0])
            if (r.data[0].roles === 'invalid') {
              this.AlertIcon = 'warning'
              this.textAlertTitle = 'ฮั่นแน่'
              this.textalert = 'username หรือ password ผิด หรืออาจยังไม่มี account นี้'
              this.dialog = true
            } else {
              console.log('valid')
              var response = {}
              response = r.data[0]
              //response.profile = JSON.parse(r.data[0].profile)
              this.set_statusLogin(response)
              this.$router.push({ path: '/timeline' })
            }
          })
        }
      },
      clear () {
        this.$refs.form[0].reset()
        this.$refs.form[1].reset()
      }
    }

  }
</script>
