<template>
  <v-container class="py-2 px-1 mt-0">
    <v-layout row wrap align-center justify-center>
      <v-flex xs12 md5 lg5 sm9>
        <v-card flat class="py-3 px-3 mt-0 fimg">
          <img :src="loginwfb" alt="" @click="gologin()"></img>
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
        AlertIcon:'',
        textAlertTitle:'',
        textalert:'',
        dialog: false,
        show1: false,
        valid: true,
        name: '',
        password: '',
        loginwfb: 'https://lh3.googleusercontent.com/-8GB0lTlpEWxnGwJm2gk8yqwobRk3E2snRCbo6LVQOQ-RNPzyk-mQdb-98DpmpVGiRAY6d7zW8mIccA2yZtUZF5iXOwEedbfmOM6gtnU-NGAaRhrOAEj61m9ww7PDDovhFh1nh5L2D8Ej1siMqPa9JEjhH79uo_epfcwUPxnyZhXOSTIozIRzWMOMDmtgsWtnncupug3twAwqwRwAxNagz8P8lO3oPFkRuKNLKYMTYcEDfuxRskBhLcCYQPar2b-WtFYT38ZZd8V8MZddxd8HOjuPM7CjT8I26D59FPiMGX9TDQ5x40AGxpFW2sVOgOx3Pkw15TYLUhlBFNe7GV60b06mLK4dPQxEkRNgTo5_e5h6tBPCMvDuB-naB3fF9o9ApPc9K1E9pqBMDOW27uqr_QvOXS3RRACC50XuUTazp6xRMazPxpGwGcO_OgdSSJ_n20FM_y6yElmKj9AxKSBTU7WLSmHu2qZhqC69e1WBYedB6ymgr8jMAxNvYibS2GaGysCcc2biq3bKw51yC6FKDiiyEajM7SlPRbsCAVFgIeDJkJb1YcUtIRc3etpoe2oBZd0KaGibN4NoW8XKU4YlQk0E-2bjUEN6rsn5ddOaKRTt_GlxOv0ekYVPFBX6BebqXbIwFB06yXJ_2H2VRCncxB688uUpwA=w600-h145-no'
      }
    },
    mounted() {
      //do something after creating vue instance
      //this.lmenu = true
      this.checksessionpage()

    },
    computed: {
      ...mapGetters(['statusLogin'])
    },
    methods: {
      ...mapActions(['set_statusLogin','set_usermenu']),
      checksessionpage(){
        var data = {}
        data.forsure = 'checksession'
        data.des = 'nrl'
        // console.log(data)
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(this.restserver+'api/checksession.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          //console.log('r: ', JSON.stringify(r, null, 2))
          this.lmenu = false
          console.log(r.data[0])
          if (r.data[0].user === 'exist') {
            // gotto timeline
            console.log('user exist')
            if (typeof this.statusLogin.name !== "undefined"){
              this.$router.push({ path: '/timeline' })
            } else {
              this.$router.push({ path: '/' })
            }

            // this.dialog = true
          } else {
            //stay here this page

            this.$router.push({ path: '/' })
          }
        })
      },
      loginWithFB(id,response){
        var data = {}
        data.forsure = 'login with facebook'
        data.idfacebook = id
        // console.log(data)
        const params = new URLSearchParams()
        params.append('event_id', JSON.stringify(data))
        axios.post(this.restserver+'api/loginWithFacebook.php', params, {
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          //console.log('r: ', JSON.stringify(r, null, 2))
          //console.log(r.data)
          if (r.data.res === 'OK') {
            // gotto timeline
            console.log('user exist')
            // this.dialog = true
            response.roles = r.data.roles
            this.set_statusLogin(response)
            //console.log(this.statusLogin)
            this.$router.push({ path: '/timeline' })

          } else {
            //stay here this page
            this.$router.push({ path: '/' })
          }
        })
      },
      gologin () {
        //console.log(this)
        if(this.statusLogin.status==='connected'){
          //console.log('already')
          this.loginWithFB(this.statusLogin.authResponse.userID,this.statusLogin)
          console.log(this.statusLogin)
        }else{
          var that = this
          window.fbAsyncInit = () => {

            FB.init({
              appId      : '258823515018294',
              cookie     : true,
              xfbml      : true,
              version    : 'v3.1'
            });

            FB.AppEvents.logPageView();

            FB.login((response) => {
                  // handle the response
              if (response.status === 'connected') {
                // Logged into your app and Facebook.

                FB.api('/me', (res)=> {
                  console.log(res);
                  if(typeof res.id !== 'undefined'){
                    FB.api('/me/picture?redirect=0', (res2)=> {
                      console.log(res2)
                      response.picture = res2
                      response.name = res
                      that.loginWithFB(res.id,response)
                    });

                  }
                });

              } else {
                this.dialog = true
                this.AlertIcon = 'warning'
                this.textAlertTitle = 'ฮั่นแน่'
                this.textalert = 'The person is not logged into this app or we are unable to tell.'
                // The person is not logged into this app or we are unable to tell.
              }
            }, {scope: 'public_profile,email'});

            /*FB.getLoginStatus((response) => {
              this.statusLogin = response
                 console.log(response);
             });*/

          };
        }


        (function(d, s, id){
           var js, fjs = d.getElementsByTagName(s)[0];
           if (d.getElementById(id)) {return;}
           js = d.createElement(s); js.id = id;
           js.src = "https://connect.facebook.net/en_US/sdk.js";
           fjs.parentNode.insertBefore(js, fjs);
         }(document, 'script', 'facebook-jssdk'));

      }
    }

  }
</script>
