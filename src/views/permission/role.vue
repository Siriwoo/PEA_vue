<template>
  <div class="components-container board">
    <el-table
     :data="tableData"
     style="width: 100%">
     <el-table-column
       prop="date"
       label="Date"
       width="180">
     </el-table-column>
     <el-table-column
       prop="name"
       label="Name"
       width="180">
     </el-table-column>
     <el-table-column
       prop="address"
       label="Address">
     </el-table-column>
   </el-table>
  </div>
</template>
<script>


export default {
  name: 'rolemanage',

  data() {
        return {
          tableData: [{
            date: '2016-05-03',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles'
          }, {
            date: '2016-05-02',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles'
          }, {
            date: '2016-05-04',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles'
          }, {
            date: '2016-05-01',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles'
          }]
        }
      }
}
</script>
<style lang="scss">
.board {
  width: 1000px;
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4A9FF9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}
</style>
