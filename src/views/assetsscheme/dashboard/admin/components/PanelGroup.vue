<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="24" :sm="24" :lg="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('ซ่อม/แก้ไข/ปรับปรุง')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="tools_color" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            ซ่อม/แก้ไข/ปรับปรุง
          </div>
          <count-to :start-val="0" v-if="is_data_fetched" :end-val="datashowpanel[0]['ซ่อม_แก้ไข_ปรับปรุง']" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('บำรุงรักษา')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="technical-support_color" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            บำรุงรักษา
          </div>
          <count-to :start-val="0" v-if="is_data_fetched" :end-val="datashowpanel[0]['บำรุงรักษา']" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('ย้าย')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="destination_color" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            ย้าย
          </div>
          <count-to :start-val="0" v-if="is_data_fetched" :end-val="datashowpanel[0]['ย้าย']" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('ติดตั้ง')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="server_color" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            ติดตั้ง
          </div>
          <count-to :start-val="0" v-if="is_data_fetched" :end-val="datashowpanel[0]['ติดตั้ง']" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('Event')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="megaphone_color" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Event
          </div>
          <count-to :start-val="0" v-if="is_data_fetched" :end-val="datashowpanel[0]['Event']" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('ทั้งหมด')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="line-chart_color" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            ทั้งหมด
          </div>
          <count-to :start-val="0" v-if="is_data_fetched" :end-val="datashowpanel[0]['sumalljob']" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: ['datashowpanel','is_data_fetched'],
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 5px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
        float: right;
      }
    }
  }
}

@media (max-width:550px) {


}
</style>
