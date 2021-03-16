import { getUserData } from '@/utils/auth'
export const frefucequipt = {
  data (){
    return{

    }
  },
  methods: {
    infoequipt_adapter(o) {
      //console.log(o);
      var no = {}
      var mrk = Object.keys(JSON.parse(o.infodetail))
      var ni = JSON.parse(o.infodetail)
      var t = JSON.parse(getUserData())
      var tt = [t.depart]
      no['adminstr'] = JSON.stringify(tt)
      no['empcode'] = t.empcode
      no['อุปกรณ์'] = o['อุปกรณ์']
      no['สถานที่'] = o['สถานที่']
      no['ยี่ห้อ'] = o['ยี่ห้อ']
      no['ExcelID'] = o['ExcelID']
      no['adminstr'] = o['adminstr']
      no['equiptypeID'] = o['equiptypeID']
      no['locationID'] = o['locationID']
      no['รหัสทรัพย์สิน'] = o['รหัสทรัพย์สิน']
      no['รุ่น'] = o['รุ่น']
      no['ลำดับ'] = o['ลำดับ']
      no['masterTypeID'] = o['masterTypeID']
      no['edgeTypeID'] = o['edgeTypeID']
      no['extradetail'] = o['extradetail']
      no.keyelse = mrk
      no.equiptfillter = o['อุปกรณ์']
      for (var i = 0; i < mrk.length; i++) {
        no[mrk[i]] = ni[mrk[i]]
      }
      return no
    }
  }
}
