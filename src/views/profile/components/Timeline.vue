<template>
  <div class="block">
      <div class="" v-for="e in timeline">
        <div class="tp_topic">
          {{e.timestamp}}
        </div>
        <div class="tp_title">
          {{e.title}}
        </div>
        <div class="tp_content">
          <div class="" v-for="x in e.content">
            + {{x}}
          </div>
        </div>
      <hr>
      </div>

  </div>
</template>
<style>
.tp_topic{
  font-size: 15px;

}
.block{
  padding: 10px;
}
.tp_title{
  font-weight: bold;
  margin-top: 3px;
  margin-bottom: 4px;
}
.tp_content{
  color: grey;
  font-size: 13px;
  line-height: 1.4;
}
</style>
<script>
import { getUserData,getUserActivity } from '@/utils/auth'
export default {
  mounted() {
    //do something after mounting vue instance
    var q = JSON.parse(getUserData())
    console.log(q);
    var v = JSON.parse(getUserActivity())
    console.log(v);
    this.scheme = v.scheme
    if(v.scheme=='stockecar'){
      this.timeline = this.timeline_stock
    }else{
      this.timeline = this.timeline_equipt
    }
  },
  data() {
    return {
      timeline:[],
      timeline_stock:[
        {
          timestamp: '3 มีนาคม 2563',
          title: 'เริ่มต้น Timeline Version QR Project',
          content: ['เริ่มต้นการบันทึก Timeline ของ Version QR CODE Project',
          'Update 17 รายการที่ประชุมล่าสุด']
        }
      ],
      timeline_equipt: [
        {
          timestamp: '6 เมษายน 2563',
          title: 'สร้างประวัติใน googlesheet + แก้บั๊คบางอย่าง',
          content: ['https://docs.google.com/spreadsheets/d/1QsmjWqPF0Au4qu5jTB7kfkPzYqOean81HvV4CHJ5JdQ/edit#gid=291369247',
          'แก้ไขให้ตารางสามารถเรียงได้',
          'แก้บัค Double transaction เวลากด save แล้วมันเพิ่ม reccord ใหม่แทนที่จะแก้ไขอันเดิม','กรณีกรอกผิดสถานที่ จะย้ายข้อมูลที่กรอกทั้งก้อนไปอีก location หนึ่ง ทำหลังบ้านดูใน googlesheet']
        },
        {
          timestamp: '3 มีนาคม 2563',
          title: 'เริ่มต้น Timeline Version Equipt manage Project',
          content: ['เริ่มต้นการบันทึก Timeline ของ Version Equipt manage Project',
          'แก้บัควันที่ตอนโชว์กับวันที่ตอนบันทึกไม่ตรงกัน']
        }
      ],
      scheme: ''
    }
  }
}
</script>
