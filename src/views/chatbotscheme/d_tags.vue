<template>
  <v-container class="py-0 px-0 mt-0">
    <v-card text>
      <v-card-title
          class="headline grey lighten-2 py-3 px-3"
          primary-title
        >
          <div class="big_text">
            เพิ่ม Tags
          </div>
          <div class="small_text">
            กดเลือก Tag ที่ต้องการ
          </div>
        </v-card-title>
        <el-input
          placeholder="Filter keyword"
          v-model="filterText">
        </el-input>

        <el-tree
        class="filter-tree"
        :data="g_tags"
        :props="defaultProps"
        node-key="id"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="add_tag"
        ref="tree">
      <!--span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span-->
    </el-tree>

        <v-divider></v-divider>
        <div class="box_contain_tag">
          <span v-for="(elem,i) in wanttag" :key="i">
            <v-chip v-model="elem.show">{{elem.name}} <i class="el-icon-close" @click="remove_tag(i)"></i></v-chip>
          </span>
        </div>
        <v-dialog
          v-model="d_alert"
          max-width="500px"
        >
        <v-card>
          <v-card-text>
            ซ้ำๆ ลูกพี่
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="primary" text @click="d_alert=false">OK</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>

        </v-dialog>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="do_text_q"
          >
            APPLY
          </v-btn>
        </v-card-actions>
    </v-card>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.small_text{
  font-size: 11px;
  width: 200px;
}

.bg_card{
  background: #e9eef2;
  border: 1px solid #ddd;
  color: #575a5d;
  border-radius: 3px;
  padding-left: 3px;
  padding-top: 3px;
  min-height: 45px;
}
.inline{
  display: inline-block;
  width:100px;
}
.box_contain_tag{
  min-height: 45px;
}
</style>

<script>
// eslint-disable-next-line
/* eslint-disable */
  import { mapActions, mapGetters, mapState } from 'vuex'
  export default{
    data () {
      return {
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        c_tag: [],
        text: '',
        lv: [],
        lv3: [],
        lv4: [],
        lv5: [],
        lv6: [],
        wanttag: [],
        d_alert: false
      }
    },
    watch: {
      filterText(val) {
        //console.log(this.$refs.tree);
        this.$refs.tree.filter(val);
      }
    },
    created () {
      // do something after creating vue instance
      console.log('loaded d_tags.vue')
      console.log(this.g_tags);
    },
    methods: {
      filterNode(value, data) {
        //console.log(data);
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      ...mapActions(['d_toggle', 'set_tags']),
      do_text_q: function () {
        // console.log('local click')
        this.stat_qna[2].text = this.wanttag
        this.$store.dispatch('chatbot/d_toggle', 2)
      },
      tog_tag: function (i) {
        this.lv[i] = !this.lv[i]
        // console.log(this.lv)
      },
      add_tag: function (data) {
        console.log(data);
        var id = data.id
        var name = data.tag_short
        console.log(id)
        console.log(name);
        var tmp2 = true
        for (var i = 0; i < this.wanttag.length; i++) {
          if (this.wanttag[i].name === name) {
            tmp2 = false
          }
        }
        if (tmp2) {
          var tmp = {}
          tmp.id = id
          tmp.name = name
          tmp.show = true
          this.wanttag.push(tmp)
        } else {
          this.d_alert = true
        }

        // console.log(id + '+' + name)
      },
      remove_tag: function (i) {
        this.wanttag.splice(i, 1)
      }
    },
    computed: {
      ...mapGetters(['stat_qna','g_tags']),
    }
  }
</script>
