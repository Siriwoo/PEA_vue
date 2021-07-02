// eslint-disable-next-line
/* eslint-disable */
import {
    getUserData,
    setUserclick,
    getUserclick,
    setQrcodescheme,
    getQrcodescheme
} from '@/utils/auth'
export const frefucqr = {
    data() {
        return {

        }
    },
    computed: {

    },
    created() {
        //do something after creating vue instance
        //console.log('hello i am fetchpic mixins');
        //console.log(this.tokenStr)
    },
    methods: {
        exporttocsv(v, name) {
            //console.log(v);
            var JSONData = v
            var ShowLabel = true
            var ReportTitle = name
                //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData
                //console.log(arrData);
            var CSV = '\uFEFF';
            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {

                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }

                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '\r\n';
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {
                alert("Invalid data");
                return;
            }

            //Generate a file name
            var fileName = "MyReport_";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g, "_");

            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + CSV;

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension

            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        dosql() {
            //WHEN 78 THEN 999
            //WHEN 77 THEN 88
            var s = '',
                wtmp = ''
            var w = ''
            var wa = ''
            var wm = ''
            var n = ''
            var sql = {}
            for (var i = 0; i < this.toolfromqr.length; i++) {
                n += `'${this.toolfromqr[i].toolid}'`
                w += `when '${this.toolfromqr[i].toolid}' then ${this.toolfromqr[i].nownum-this.toolfromqr[i].tonum}`
                wa += `when '${this.toolfromqr[i].toolid}' then ${this.toolfromqr[i].nownum+this.toolfromqr[i].tonum}`
                if (this.schemedo.name == "ย้าย") {
                    wm += `when '${this.toolfromqr[i].toolid}' then ${this.toolfromqr[i].tonum+this.toolfromqrdest[i].nownum}`
                }
                if (i < this.toolfromqr.length - 1) {
                    n += ','
                    w += `
          `
                    wa += `
          `
                    wm += `
          `
                }
            }

            if (this.schemedo.name == 'ย้าย') {
                wtmp = w
                sql.dest = `UPDATE qr_tools_in_warehouse
            SET nownum = (CASE toolid
            ${wm}
            ELSE nownum END) WHERE toolid IN(${n})
            and warehouseid='${this.destwarehouse.codename}'`
            } else if (this.schemedo.name == 'ลด') {
                wtmp = w
            } else if (this.schemedo.name == 'เพิ่ม') {
                wtmp = wa
            }
            sql.ori = `UPDATE qr_tools_in_warehouse
           SET nownum = (CASE toolid
           ${wtmp}
           ELSE nownum END) WHERE toolid IN(${n})
           and warehouseid='${this.focuswarehouse.codename}'`
            console.log(sql);
            return sql

        },
        isadmin() {
            var t = JSON.parse(getUserclick()).viewscheme.typeview
            if (t == 'Admin') {
                return true
            } else {
                return false
            }
        },
        async sumalltool(x) {
            var r = {
                data: [{
                    master_warehouse: x
                }]
            }
            var y = await this.func_load_all_warehouse_under_master(r, 'all')
            return y
        },
        convert_profile_for_query() {

        },
        async func_load_all_tool_in_all_give_warehouse(r2, tmp, soa) {
            //console.log('จุดบรรจบ');
            console.log('++function func_load_all_tool_in_all_give_warehouse++');
            var tmp2 = {}
            var cr = this.convert_profile_for_query()
            tmp2.info = 'load_all_tool_in_all_give_warehouse'
            var strparam2 = ''
            for (var i = 0; i < r2.data.length; i++) {
                strparam2 += `warehouseid = '${r2.data[i].codename}' `
                if (i < r2.data.length - 1) {
                    strparam2 += 'or '
                }
            }
            //console.log(strparam2);
            tmp2.param1 = tmp.param2
            tmp2.param2 = strparam2
            tmp2.param3 = soa
            var r3 = await this.$store.dispatch('info/loadinfo', tmp2)
            console.log(r3);
            //console.log(r2.data[0].profile);
            console.log(this.focuswarehouse.name1);
            if (soa == 'all' && this.focuswarehouse.name1 !== 'รวม') {
                r3.data = this.only_in_car(JSON.parse(r2.data[0].profile), r3.data)
            } else {
                console.log('r2 is here');
                console.log(r2);
            }
            this.splitequiptandtool(r3.data)
            this.allware = 0
            this.step3 = true
            for (var i = 0; i < r3.data.length; i++) {
                this.allware += r3.data[i].nownum
            }
            console.log('++function func_load_all_tool_in_all_give_warehouse++');
            return r3

        },
        only_in_car(r2, r3) {
            console.log('+++function ly_in_car+++');
            console.log(r2);
            console.log(r3);

            let rn = []
            for (var i = 0; i < r3.length; i++) {
                for (var j = 0; j < r2.length; j++) {
                    if (r3[i].code == r2[j].code) {
                        rn.push(r3[i])
                    }
                }

            }
            console.log(rn);
            console.log('+++function only_in_car+++');
            return rn
        },
        splitequiptandtool(r) {
            console.log('++function splitequiptandtool++');
            console.log(r);
            var split_equipt = []
            var split_tool = []
            for (var i = 0; i < r.length; i++) {
                if (r[i].toolid.includes("T")) {
                    split_tool.push(r[i])
                } else {
                    split_equipt.push(r[i])
                }
            }
            this.all_tool = this.regroupallequipt(split_tool)
            this.all_equipt = this.regroupallequipt(split_equipt)
            console.log('++function splitequiptandtool++');
        },
        regroupallequipt(r) {
            var allequiptscheme = []
            for (var i = 0; i < r.length; i++) {
                var s = allequiptscheme.findIndex(e => {
                    return e.category == r[i].category
                })
                if (s == -1) {
                    var t = {}
                    t.category = r[i].category
                    t.elements = []
                    t.elements.push(r[i])
                    allequiptscheme.push(t)
                } else {
                    //console.log(allequiptscheme);
                    allequiptscheme[s].elements.push(r[i])
                }
            }
            return allequiptscheme;
        },
        async func_load_all_warehouse_under_master(r, soa) {
            var tmp = {}
            tmp.info = 'load_all_warehouse_under_master'
            tmp.param1 = r.data[0].master_warehouse
            tmp.param2 = r.data[0].toolid

            this.unit = r.data[0].unit
            var r2 = await this.$store.dispatch('info/loadinfo', tmp)
                //console.log(r2.data);
            var r3 = await this.func_load_all_tool_in_all_give_warehouse(r2, tmp, soa)

            this.istool = 'รายการ :'
            this.nametool = r.data[0].name
            this.name2tool = r.data[0].category
            this.maxequipt = r.data[0].nownum
            this.number = r.data[0].nownum
            this.isimage = true
            return r3
        },
        forallware(d) {
            console.log(d);
            var tmp = {}
            tmp.info = 'loadtoolfromqr'
            tmp.param1 = d.split('=')[1]
            this.toolid = d.split('=')[1]
            tmp.param2 = this.warehouseid
            tmp.param3 = {
                schemename: this.schemedo.name,
                destwarehouse: this.destwarehouse.codename
            }
            this.$store.dispatch('info/loadinfo', tmp)
                .then((r) => {
                    console.log('loadtoolfromqr');
                    //console.log(r);
                    this.toolscheme = r.data
                    if (r.data.length > 0) {
                        //console.log('here');
                        this.ispushtoqr(r.data)
                        this.func_load_all_warehouse_under_master(r, 'single') //ทำไม
                    } else {
                        this.isimage = false
                        this.istool = 'ไม่พบอุปกรณ์ที่ scan ในคลังนี้'
                    }
                })
        },
        ispushtoqr(d) {
            var x = this.toolfromqr.findIndex(e => {
                return e.toolid == d[0].toolid
            })
            if (x == -1) {
                //console.log('ispushtoqr');
                //console.log(d);
                d[0].tonum = 0

                // 0 or 1 is ori or dest
                if (this.schemedo.name == 'ย้าย') {
                    if (d.length != 1) {
                        d[1].tonum = 0
                        if (d[0].codename == this.focuswarehouse.codename) {
                            this.toolfromqr.unshift(d[0]);
                            this.toolfromqrdest.unshift(d[1]);
                        } else {
                            this.toolfromqr.unshift(d[1]);
                            this.toolfromqrdest.unshift(d[0]);
                        }
                    } else {
                        this.notierror('ปลายทางไม่มี ' + d[0].name)
                    }

                } else {
                    this.toolfromqr.unshift(d[0]);
                }


                //fecth มา 2 หรือเปล่าต้อง check ก่อน


                //this.toolfromqr = this.toolfromqr.concat(d)
            } else {
                this.focustool(x)
            }

            //console.log(this.toolfromqrdest);
        }
    }
}