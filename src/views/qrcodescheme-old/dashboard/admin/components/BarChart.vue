<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import {freqmethods} from '@/mixins/freqmethods'

const animationDuration = 3000

export default {
  mixins: [resize],
  mixins: [freqmethods],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    type: {
      type: String,
      default: 'week'
    }
  },
  data() {
    return {
      chart: null,
      f_initchart: false,
      xA : [{
        type: 'category',
        data: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
        axisTick: {
          alignWithLabel: true
        }
      }]
    }
  },
  watch: {
    type: {
      handler: function (v) {
        //console.log(v);
        this.$nextTick(() => {
          if(this.type=='week'){
            this.xA[0].data = this.xweek
          }else if(this.type=='month'){
            this.xA[0].data = this.xmonth
            //console.log(this.type);
          }else if(this.type=='year'){
            var d = new Date();
            var n = d.getFullYear();
            this.xA[0].data = [n+543,(n-1)+543,(n-2)+543,(n-3)+543,(n-4)+543,(n-5)+543,(n-6)+543]
            //console.log(this.type);
          }else{
            this.xA[0].data = []
            //console.log(this.type);
          }
          this.initChart()
        })


        // check someData and eventually call
        //this.initCalendar();
      },
      immediate: true
    }
  },
  mounted() {
    //console.log('564654');
    //console.log(this.$el);

  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      //console.log(this.$el);
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: this.xA,
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: 'pageA',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [79, 52, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: 'pageB',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [80, 52, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: 'pageC',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [30, 52, 200, 334, 390, 330, 220],
          animationDuration
        }]
      })
      if(!this.f_initchart){
        this.chart.on('click', (params)=> {
            console.log(params);

        });
        this.f_initchart = true
      }

    }
  }
}
</script>
