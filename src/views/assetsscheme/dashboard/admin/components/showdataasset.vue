
<template>
  <div>
    <v-app-bar color="#F0F0E8">
      <v-toolbar-title class="px-3">รายการทรัพย์สิน</v-toolbar-title>
      <!-- จำนวนรายการที่ผลลัพธ์ที่ค้นหาได้ทั้งหมด -->
      <v-field class="cont_list">
        (ผลการค้นหา {{ beers.length }} รายการ)
      </v-field>
      <v-spacer></v-spacer>
      <div>
        <v-text-field
          v-model="searchassets"
          clearable
          flat
          solo
          hide-details
          prepend-inner-icon="el-icon-search"
          label="ค้นหาอุปกรณ์"
        >
          เครื่องมือและอุปกรณ์
        </v-text-field>
      </div>
    </v-app-bar>
    <v-content class="py-4 px-0 conb">
      <v-content class="py-1 px-5 conb">
        <el-row :gutter="10">
          <el-col :xs="5" :sm="5">
            <div class="">
              <el-select filterable placeholder="Select">
                <el-option> </el-option>
              </el-select>
            </div>
            <div class="buttun_text">ประเภทอุปกรณ์</div>
          </el-col>

          <el-col :xs="5" :sm="5">
            <div class="">
              <el-select filterable placeholder="Select">
                <el-option> </el-option>
              </el-select>
            </div>
            <div class="buttun_text">พื้นที่ดูแล</div>
          </el-col>
        </el-row>
      </v-content>
    </v-content>

    <v-content class="conb px-5">
      <v-dialog v-model="dialog" scrollable max-width="800px">
        <template v-slot:activator="{ on, attrs }">
          <v-data-iterator
            :items="beers"
            :items-per-page.sync="ipp"
            :page.sync="page"
            hide-default-footer
            class="d-flex flex-column mh-100 overflow-hidden"
          >
            <template v-slot:header>
              <div class="headline white--text mr-2 text-truncate py-3"></div>
            </template>
            <!-- แสดงข้อมูลในรูปแบบการ์ด -->
            <template v-slot:default="props" class="card">
              <v-row class="fill-height overflow-auto" id="container">
                <v-col
                  v-for="item in props.items"
                  :key="item.name"
                  :cols="12 / itemsPerRow"
                  class="py-2"
                >
                  <!-- การ์ดใส่อุปกรณ์ คลิกเพื่อดูข้อมูลด้านใน-->
                  <v-card class="fill-height" v-bind="attrs" v-on="on" >
                    <div class="text-center">
                      <img height="200px" class="card-img-top" v-bind:src="item.image_url" alt="image">
                    </div>
                    
                    <v-card-title>
                      <!--name-->
                      <span class="font-weight-light text-truncate">
                        <!--ID Number && Name-->
                        <span v-text="item.id"></span> {{ item.name }}
                        <v-chip
                          small
                          outlined
                          class=""
                          v-if="item.id.toString() == beers.length.toString()"
                        ></v-chip>
                      </span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <!--detail-->
                      <span v-html="item.tagline" class="mr-2"></span>
                      <!--date-->
                      <v-chip v-text="item.first_brewed"></v-chip>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </template>
            <template v-slot:footer>
              <v-row
                class="no-gutters mt-auto py-2 shrink"
                align="center"
                justify="center"
              >
                <span class="mx-2">Rows per page</span>{{ rowsPerPage }} (based
                on viewport height)

                <v-spacer></v-spacer>
                <span class="mr-4 grey--text">
                  Page {{ page }} of
                  <span
                    v-text="numberOfPages"
                    class="font-weight-bold primary--text"
                  ></span>
                </span>
                <v-btn
                  small
                  dark
                  rounded
                  color="blue darken-3"
                  class="mr-1"
                  @click="formerPage"
                >
                  <i class="el-icon-back custom-icon"></i>
                </v-btn>
                <v-btn
                  small
                  dark
                  rounded
                  color="blue darken-3"
                  class="ml-1"
                  @click="nextPage"
                >
                  <i class="el-icon-right custom-icon"></i>
                </v-btn>
              </v-row>
            </template>
          </v-data-iterator>
        </template>
        <!-- Popup Dialog แสดงรายละเอียดของอุปกรณ์ **หาเงื่อนไขเพิ่ม-->
        <v-card>
          <div v-for="beers in beers" :key="beers">
            <v-card-title>
              <div class="headline">{{ beers.name }}</div>
            </v-card-title>
            <v-card-text>
              <v-container></v-container>

              <small>แสดงรายละเอียดของอุปกรณ์</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>

              <!--Action เมื่อดูข้อมูลเสร็จ-->
              <v-btn color="blue darken-1" text @click="dialog = false">
                close
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
    </v-content>
  </div>
</template>

<style lang="scss">
.wrapper-image {
    height: 12rem;
    display: flex;
    align-items: flex-start;
}
.card-img-top {
  width: auto;
  border-top-left-radius: calc(0.25rem - 1px);
  border-top-right-radius: calc(0.25rem - 1px);
}

.card {
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 0;
  height: 650px;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}

.card-body{
position: absolute;
bottom:0;
}
.boxmain {
  padding-left: 5px;
}
@media screen and (max-width: 768px) {
  .css_qna {
    .el-dialog {
      margin: auto;
      width: 98%;
    }
    .el-dialog__body {
      padding: 0px 0px 0px !important;
    }
  }
}
.custom-icon {
  font-size: 1.5rem;
}
.conb {
  background: #e9eef2;
}
.cont_list {
  color: #8094ae;
}
h1,
h2 {
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
.headerask {
  font-weight: bold;
  font-size: 16px;
}

.space {
  min-width: 7px;
}
.show_data_card {
  background: #e9eef2;
  border: 1px solid #ddd;
  color: #fff;
  border-radius: 3px;
  padding-left: 3px;
  padding-top: 3px;
  min-height: 90px;
}
.smallpic {
  width: 70px;
}

.mh-100 {
  min-height: 100vh;
  max-height: 100vh;
  height: 100vh;
}

.overflow-hidden {
  overflow: hidden;
}

.theme--light.v-application {
  background-color: #ddd;
}
</style>

<script>
// eslint-disable-next-line
/* eslint-disable */
import Pagination from "@/components/Pagination";
import DataTable from "@/views/components/DataTable";
import { mapGetters, mapActions, mapState } from "vuex";
import axios from "axios";
//  console.log(mapState(['g_text']))
export default {
  name: "AssetShow",
  components: { Pagination, DataTable },
  data() {
    return {
      dialog: false,
      componentKey_dAns: 0,
      loading3: false,
      dialognotsave: false,
      AlertIcon: "",
      textAlertTitle: "",
      textalert: "",
      searchassets: "",
      contextEventx: {
        status: false,
        text: "",
        value: "",
      },
      bottom: false,
      beers: [],
      assets: [],
      assetdata: [],
      orassetdata: [],
      rowsPerPageArray: [3, 4, 6],
      rpp: 4,
      page: 1,
      busy: false,
    };
  },
  mixins: [],
  computed: {
    ...mapGetters(["stat_qna"]),
    ...mapState(["selectedIntentVux"]),
  },
  watch: {},
  mounted() {
    //do something after mounting vue instance
    this.stat_qna[0].contextId = null;
    this.userdata = JSON.parse(getUserData());
    //console.log();
  },
  filters: {
    shortthen: function (value) {
      if (!value) return "";
      value = value.toString();
      return (
        value.substring(0, 9) +
        "...." +
        value.substring(value.length - 3, value.length)
      );
    },
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.beers.length / this.ipp);
    },
    rowsPerPage() {
      return this.rpp;
    },
    itemsPerRow() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 1;
        case "sm":
          return 2;
        case "md":
          return 3;
        case "lg":
          return 4;
        case "xl":
          return 6;
      }
    },
    ipp() {
      return Math.ceil(this.rowsPerPage * this.itemsPerRow);
    },
  },

  methods: {
    getBeers(c) {
      // get items from the server
      axios
        .get("https://api.punkapi.com/v2/beers?per_page=56")
        .then((response) => {
          this.beers = response.data;
          setTimeout(() => {
            this.calcRowsPerPage();
          }, 100);
          console.log(response);
        });
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    clk() {},
    finding() {},
    calcRowsPerPage() {
      let container = document.getElementById("container");
      let minItemHeight = 170;
      if (container) {
        let containerHeight = parseInt(container.clientHeight, 0);
        console.log(containerHeight);
        this.rpp = Math.floor(
          Math.max(containerHeight, minItemHeight) / minItemHeight
        );
      } else {
        this.rpp = 3;
      }
    },
  },
  created() {
    this.getBeers();
  },
  mounted() {
    window.addEventListener("resize", () => {
      //debounce
      if (!this.busy) {
        this.busy = true;
        setTimeout(() => {
          this.calcRowsPerPage();
          this.busy = false;
        }, 300);
      }
    });
  },
};
</script>
