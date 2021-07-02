// eslint-disable-next-line
/* eslint-disable */
import { getUserData } from '@/utils/auth'
export const frefucequipt = {
    data() {
        return {

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
        },
        infoasset_adapter(ob) {
            // console.log(ob);
            var no = {}
            var date = new Date(ob['CAP_DATE']).getFullYear() + "-" + (new Date(ob['CAP_DATE']).getMonth() + 1) + "-" + new Date(ob['CAP_DATE']).getDate();
            // console.log(date);
            var t = JSON.parse(getUserData())
            var tt = [t.depart]
            no['id'] = ob['id']
            no['สินทรัพย์'] = ob['สินทรัพย์']
            no['สถานที่'] = ob['สถานที่']
            no['S_NO'] = ob['S_NO']
            no['เลขที่สินค้าคงคลัง'] = ob['เลขที่สินค้าคงคลัง']
            no['อุปกรณ์'] = ob['อุปกรณ์']
            no['SERIAL_NO'] = ob['SERIAL_NO']
            no['วันที่ได้รับอุปกรณ์'] = date
            no['สถานที่'] = ob['สถานที่']
            no['มูลค่าการได้มา'] = ob['มูลค่าการได้มา']
            no['ค่าเสื่อมสะสม'] = ob['ค่าเสื่อมสะสม']
            no['มูลค่าตามบัญชี'] = ob['มูลค่าตามบัญชี']
            no['BUS_ID'] = ob['BUS_ID']
            no['พื้นที่สำนักงาน'] = ob['พื้นที่สำนักงาน']
            no['COST_CENTER_ID'] = ob['COST_CENTER_ID']
            no['ศูนย์ต้นทุน'] = ob['ศูนย์ต้นทุน']
            no['ลำดับปี'] = ob['ลำดับปี']
            no['YEARS'] = ob['YEARS']

            return no
        }
    }
}