<template>
  <v-container class="py-2 px-1 mt-0">
    <v-card flat>
      <v-list two-line>
      <template v-for="(item, index) in items">
        <v-subheader
          v-if="item.header"
          :key="item.header"
        >
          {{ item.header }}
        </v-subheader>

        <v-divider
          v-else-if="item.divider"
          :key="index"
          :inset="item.inset"
        ></v-divider>

        <v-list-tile
          v-else
          :key="item.title"
          avatar
          @click="fill_paticipant(item)"
        >
          <v-list-tile-avatar>
            <img :src="item.avatar">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title v-html="item.title"></v-list-tile-title>
            <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
        </v-card>
        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="dialog = false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Edit</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark flat @click="dialog = false">Save</v-btn>
              </v-toolbar-items>
            </v-toolbar>
              <v-card px-2 py-2>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">{{scm.topic}}</h3>
                    <div>ห้อง: {{scm.room}} <br>
                      วันที่: {{scm.day}} เวลา: {{scm.stime}} - {{scm.etime}}<br>
                      แผนก: {{scm.deparment}}</div>
                  </div>
                </v-card-title>
              </v-card>
            <v-divider></v-divider>
            asa
            <v-divider></v-divider>
            <v-checkbox
              v-model="checkbox"
              :label="`กรอกเสร็จยัง: ${checkstring}`"
            ></v-checkbox>
          </v-card>
        </v-dialog>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
.name{
  color: #1b1e21;
  font-size: 16px;
  font-weight: bold;
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
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
export default{
  data () {
    return {
      text: 'fuck',
      tile: false,
      dialog: false,
      checkbox: false,
      listmeeting: [],
      checkstring: 'ยัง',
      scm: '',
      items: [
          {
            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
            title: 'Brunch this weekend?',
            subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
          },
          { divider: true, inset: true },
          {
            avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
            title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
            subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
          },
          { divider: true, inset: true },
          {
            avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
            title: 'Oui oui',
            subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
          }
        ]
    }
  },
  watch: {
    checkbox(val) {
      if(val){
        this.checkstring = 'เสร็จแล้ว'
      }else{
        this.checkstring = 'ยัง'
      }
    }
  },
  computed: {
    ...mapGetters(['statusLogin'])
  },
  mounted() {
    //do something after mounting vue instance
    this.getmeetingvconf()
  },
  methods: {
    fill_paticipant(item) {
      this.dialog = true
      console.log(this.listmeeting[item.index])
      this.scm = this.listmeeting[item.index]
    },
    getmeetingvconf() {
      var data = {}
      data.forsure = 'getmeetingvconf'
      // console.log(data)
      const params = new URLSearchParams()
      params.append('event_id', JSON.stringify(data))
      axios.post(this.restserver+'api/getmeetingvconf.php', params, {
        header: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      }).then(r => {
        //console.log('r: ', JSON.stringify(r, null, 2))
        console.log(r.data)
        this.listmeeting = r.data
        this.items = []
        for (var i = 0; i < r.data.length; i++) {
          var rm = r.data[i].room
          var o = {}
          o.subtitle = "<span class='text--primary'>"
          if ( rm ==="s2wm") {
            o.subtitle += 'Warroom '
            o.avatar = 'https://lh3.googleusercontent.com/58W_vni-mKQ8udqZabiKUFNGl_sqFwQmDBZwuayKI_nNo4WwflJW9NP8p550a52t3846ba3y5uEIbLglDI3rzetwgGPZBCVBWQDqpH2SGbbpL9BxI3-1GMCgB63IOxiO50nQXdwJ9K2lXF4SjEv0EQVBKe3CQytHfueTmiiLsgvrnQNdqlow8jrrkaDu9sb7krAkm30bCH9JwvGKCDQu1r2bmh7xeGMJAInz1BzzYHxM9S842YzvwKPEH4axou7rQUl25kBXrU6t2F9rmXypLsie41Ou8jy_8R_1SY4a2CfuTwcAPO6VHl7uFNzr7pAOnhDR8YA_Fcs5GwZhOUY_2iyV_wKIDIqFhkX3XAVe6i14za19YX_NRMWzTj9HGUVnvVKmPLQkfbPW-gakO9-ruSo_BcDtbref7_v6ssWdKISa_5XOcuNZZLmI-KmxclI1wYh5pjTK04ZPd2jrMOjvOXWAneSkSIC5jwandzXmgn1EgDDVaqh_Lzz8VsZVrQ28qxxi61zIPC5wAUMQQmfCbcsRlvztNp3PE1QPhysqSuvpLaaKH1DwRPBOykeoldKBSJ0l8TS0AzRajOW7RZXiSiUgv-eRC_4pNYdTCYZzTp_foK2M_fyqZIAgB131jtOzGN70fAMMxNU7HDLZ36_SGXxze-iffgI=s300-no'
          } else if (rm ==="s211") {
            o.subtitle += 'นันทนาการ '
            o.avatar = 'https://lh3.googleusercontent.com/Hrjh8uWkaIvRHP_Dtj2KRlwdt9v-WBHtsv7mN973vNf7V7VASo_-K1pLXn-jA014pNa0vUgMS7KtKwkD-TgcI1jbVyvuCbo-Cmd-LuQutgNizAlUy8K9KK_oquU8ICGdXG81TlKVfXBbtQ1rW4NzjDLnbRn6Xtxnq5eNIAzYNXfIP5L_YErNSzOgMETfQZQ70uKdw-NKq4hePKh0BQeJFBuFMyc6WrQzN6PNFTQJPTHbPuvppvuSNsp3Qo4HCYJYTKkp2w7fDVDfHJgZg6NwwHzW2BBrgXlwxddw7MZrVn9LTzfOy8KqQjl7p5NflUwytfy-6Lovy3m1bTXJQDqEAVibwysKqXBT1uQ8EWASF1cf9aMKazIkP-ho0fGeVkDY2Bs6eIXmIgdHCTa9wN0PaAj4Klc9YpdBYU2TQBrz1VQcdjgW9eLY79YqRpJdS7MCi8Vp8EoAEsAT-nZM5LucmbP4KabdcEcBAhInIqCqhkRhzC946JtwzQnTdg3_wm4TeZSy_79DhfAcWkLODcWx4M42YzPp3qaTsqLPhxqDTsoubH-wL_sBYHYQFK3-DZN5c6F0iWdknrAgpZRbGqgOe_xjsApcG65BWWTFRSbMDWO_nkfnG0aDdYUx3mWcF9_17aG-s13Cz-4hbFW9GmLx7XQkzczDqh0=s300-no'
          } else if (rm ==="s311") {
            o.subtitle += 'ชั้น 3 '
            o.avatar = 'https://lh3.googleusercontent.com/fXTrfTSYNjE1ejSo3QMyOLxPJfUjYBNBDiDnR4GXYjmQgdXJejAIG-dl6KmbUBMqTYpQWs7tMfnNX1avkKCr5W8955_4RXJT55ACCN6wUUhBjxI5Dvoy5obQBIPMMLwqapC3nW2-2CYbzyelrWkupbcyWJYAobmKZ3bXr1h3QMb2LcPb0K2EvZC2AFhdFpluI8pgxOkTFGaIzX_TlI-WA6e_vEJB0a3gg3q5774UKe6YlY82J50-1zML7hfUrAqyj-D_hdcqsmvbN7v_P8CI9zfL6_KL7DhWSugUOE1JKvDa6V78XsLzldpgqZDlWPcVxmGSyZiOzbChtNfUsqf9Raysexzkuq95Xpyt1kLdXwsqto_NfhSCzcaF7ShbulZTg5-6SvLq6jtlf5RhPwjJtIpuXzgn14-_mmV7SEuikjiifEsCvZTkH92x_qhB2OO84eoAP0aSXmWrt09q0wk6ci3Uc1OltlyB3CrOsiwV0uMtKa-DqElopkYIaFspxY909mMbyVtq9gEn0oUNdGl1QKupG2qi6Wcqr5lJp7P2BlPi2KSsfDsIlc6vgreGqXLZHn3VQVPi7vweUMlWmY6U5rnu7iP5mgRxJlYYH8G5dla4-enNlPiA7_W7QzPfXheyCDOWpcKi6LuKLvDzl3jdHPtIXht5sRk=s300-no'
          }
          o.title = r.data[i].topic
          var x = r.data[i].duration
          var d = new Date(r.data[i].day);
          var datestring = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear().toString().substr(-2);
          o.subtitle += datestring
          if(x === 'morn') {
            o.subtitle += '(ช่วงเช้า)'
          } else if (x === 'noon') {
            o.subtitle += '(ช่วงบ่าย)'
          } else if (x === 'allday') {
            o.subtitle += '(ทั้งวัน)'
          }
          o.subtitle += '</span> &mdash; '
          o.subtitle += r.data[i].deparment
          o.index = i
          this.items.push(o)
        }
      })
    }
  }
}
</script>
