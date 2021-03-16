<template>
  <div>
    <el-table
      v-loading="loading"
      :data="tableData"
      v-bind="$attrs"
      v-on="listeners"
      style="width: 100%">
      <slot name="columns">
        <el-table-column
          sortable
          v-for="column in columns"
          :key="column.prop"
          :width="column.width"
          v-bind="column"
          >
          <template slot-scope="{row}">
            <slot :name="column.prop || column.type || column.label" :row="row">
              {{row[column.prop]}}
            </slot>
          </template>
        </el-table-column><!---->
      </slot>
    </el-table>
    <slot name="pagination" :page="page" :total="total">
      <el-pagination
        v-model="page"
        :total="total"
        @current-change="getTableData"
        layout="prev, pager, next"
        >
      </el-pagination>
    </slot>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  inheritAttrs: false,
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    getData: {
      type: Function,
      default: () => Promise.resolve([])
    }
  },
  data() {
    return {
      tableData: [],
      page: 1,
      total: 10,
      sortParams: [],
      loading: false
    };
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        ["sort-change"]: this.onSortChange
      };
    }
  },
  methods: {
    async getTableData(page) {
      this.loading = true;
      let reqPage = page || this.page;
      console.log(reqPage);
      console.log(this.total);
      try {
        let response = await this.getData({
          page: reqPage,
          sortParams: this.sortParams
        });
        console.log(response);
        if(typeof response !== 'undefined'){
          this.tableData = response;
          this.total = response.length;
        }

      } finally {
        this.loading = false;
      }
    },
    onSortChange({ column, prop, order }) {
      if (prop !== null) {
        let shortOrder = order === "ascending" ? "asc" : "desc";
        this.sortParams = [`${prop}|${shortOrder}`];
      } else {
        this.sortParams = [];
      }
      this.getTableData();
    }
  },
  created() {
    this.getTableData();
    console.log(this.columns);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
