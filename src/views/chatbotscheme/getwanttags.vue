<template>
  <v-container class="py-2 px-1 mt-0">
    <v-card flat>
          <v-card-text>
            <v-expansion-panels>
            <v-expansion-panel expand v-model="lv">
              <v-expansion-panel-content
                v-for="(elem,i) in g_tags" :key="i">
                <div slot="header"><v-icon @click="add_tag(elem.tag_id,elem.tag_short)">add_box</v-icon>{{elem.tag_short}}</div>
                <div  v-if="elem.child_LV2[0].tag_id!='none_none_child_LV2'">
                  <div v-for="(elem2,j) in elem.child_LV2" :key="j">
                    <div class="bg_card">
                      <div v-if="elem2.child_LV3[0].tag_id!='none_none_child_LV3'">
                        <v-expansion-panel expand focusable v-model="lv3" color="primary">
                          <v-expansion-panel-content>
                            <div slot="header"><v-icon @click="add_tag(elem2.tag_id,elem2.tag_short)">add_box</v-icon>{{elem2.tag_short}}</div>
                            <div v-for="(elem3,j) in elem2.child_LV3" :key="j">
                              <div class="bg_card">
                                <div v-if="elem3.child_LV4[0].tag_id!='none_none_child_LV4'">
                                  <v-expansion-panel expand focusable v-model="lv4">
                                    <v-expansion-panel-content>
                                      <div slot="header"><v-icon @click="add_tag(elem3.tag_id,elem3.tag_short)">add_box</v-icon>{{elem3.tag_short}}</div>

                                      <div v-for="(elem4,j) in elem3.child_LV4" :key="j">
                                        <div class="bg_card">
                                          <div v-if="elem4.child_LV5[0].tag_id!='none_none_child_LV5'">
                                            <v-expansion-panel expand focusable v-model="lv5">
                                              <v-expansion-panel-content>
                                                <div slot="header"><v-icon @click="add_tag(elem4.tag_id,elem4.tag_short)">add_box</v-icon>{{elem4.tag_short}}</div>

                                                <div v-for="(elem5,j) in elem4.child_LV5" :key="j">
                                                  <div class="bg_card">
                                                    <div v-if="elem5.child_LV6[0].tag_id!='none_none_child_LV6'">
                                                      <v-expansion-panel expand focusable v-model="lv6">
                                                        <v-expansion-panel-content>
                                                          <div slot="header"><v-icon @click="add_tag(elem5.tag_id,elem5.tag_short)">add_box</v-icon>{{elem5.tag_short}}</div>

                                                        </v-expansion-panel-content>
                                                      </v-expansion-panel>
                                                    </div>
                                                    <div v-else>
                                                      <v-icon @click="add_tag(elem5.tag_id,elem5.tag_short)">add_box</v-icon>{{elem5.tag_short}}
                                                    </div>
                                                  </div>
                                                </div>

                                              </v-expansion-panel-content>
                                            </v-expansion-panel>
                                          </div>
                                          <div v-else>
                                            <v-icon @click="add_tag(elem4.tag_id,elem4.tag_short)">add_box</v-icon>{{elem4.tag_short}}
                                          </div>
                                        </div>
                                      </div>

                                    </v-expansion-panel-content>
                                  </v-expansion-panel>
                                </div>
                                <div v-else>
                                  <v-icon @click="add_tag(elem3.tag_id,elem3.tag_short)">add_box</v-icon>{{elem3.tag_short}}
                                </div>
                              </div>
                            </div>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </div>
                      <div v-else>
                        <v-icon @click="add_tag(elem2.tag_id,elem2.tag_short)">add_box</v-icon>{{elem2.tag_short}}
                      </div>
                    </div>
                  </div>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          </v-card-text>
    </v-card>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

<script>
  import { mapActions, mapState } from 'vuex'
  export default{
    data () {
      return {
        text: 'fuck',
        lv: [],
        lv2: [],
        lv3: [],
        lv4: [],
        lv5: [],
        q_wanttag: []
      }
    },
    created () {
    },
    methods: {
      ...mapActions(['p_wanttag']),
      add_tag: function (id, name) {
        // console.log('fire this action')
        var tmp2 = true
        for (var i = 0; i < this.q_wanttag.length; i++) {
          if (this.q_wanttag[i].name === name) {
            tmp2 = false
          }
        }
        if (tmp2) {
          var tmp = {}
          tmp.id = id
          tmp.name = name
          tmp.show = true
          this.q_wanttag.push(tmp)
          this.p_wanttag(this.q_wanttag)
          // console.log(this.wanttag_sq)
        } else {
          this.d_alert = true
        }

        // console.log(id + '+' + name)
      }
    },
    computed: {
      ...mapState(['g_tags', 'wanttag_sq'])
    }
  }
</script>
