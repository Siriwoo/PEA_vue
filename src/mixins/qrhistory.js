export const qrhistory = {
    // eslint-disable-next-line
    /* eslint-disable */
    data() {
        return {

        }
    },
    methods: {
        whathisedit(v) {
            //load focus history
            console.log(v);
            var tmp = {}
            tmp.info = 'load_focus_story_qr'
            tmp.param1 = v.id
            console.log(tmp);
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$store.dispatch('info/loadinfo', tmp)
                .then((r) => {
                    console.log(r);
                    v = r.data[0]
                    var f = JSON.parse(v.activitydetail.slice(1, -1))
                    var l = v.typeactivity
                    var h = {
                        name: v.typeactivity,
                        type: 'edit'
                    }

                    this.moredetal_qrac = f
                    this.moredetal_qrac.idupdate = v.id
                    this.moredetal_qrac.timestamp = v.timestamp
                    this.moredetal_qrac.picprofile = v.picprofile
                    this.moredetal_qrac.statusjob = v.statusjob
                    this.moredetal_qrac.historydo = v.historydo
                    this.moredetal_qrac.username = v.username
                    this.moredetal_qrac.position = v.position
                    this.moredetal_qrac.full_name_short = v.adminstr
                    this.moredetal_qrac.tel = v.tel
                    this.moredetal_qrac.email = v.email
                    this.moredetal_qrac.prename = v.prename
                    this.moredetal_qrac.nameuser = v.name
                    this.moredetal_qrac.lastname = v.lastname
                    this.moredetal_qrac.activitydetail = v.activitydetail
                    this.moredetal_qrac.ownscheme = {
                        crop: this.cropdepart(v.adminstr, 'for_query'),
                        typeoffice: this.typeoffice
                    }
                    console.log(this.moredetal_qrac);
                    this.focuswarehouse = JSON.parse(v.focuswarehouse.slice(1, -1))
                    this.clickMainmenu(h)
                    this.componentKey_Mainmenuqr += 1;
                    loading.close();
                })


            //do something edit
            //this.dialogstorylist = false

        },
        clickMainmenu(v) {
            var f = {}
            f = this.actualname(this.focuswarehouse)
            this.typeshow_activity = v.type
            this.schemedo.name = v.name
                //this.dialogMainmenuQr = false
            var pnt = ''
            console.log('clickMainmenu');
            //console.log();
            if (this.np.nowpage == 'history') {
                pnt = this.np.history + f.name1
            } else if (this.np.nowpage == 'mainqr') {
                let n = ''
                console.log(v.name);
                if (v.name == 'เพิ่ม') {
                    n = 'เพิ่มอุปกรณ์จากใบเบิก..'
                } else if (v.name == 'ลด') {
                    n = 'ตรวจสอบอุปกรณ์..'
                } else if (v.name == 'เชคยานพาหนะ') {
                    n = 'ตรวจสอบยานพาหนะ.'
                } else if (v.name == 'เชคเครื่องมือ') {
                    n = 'ตรวจสอบเครื่องมือ'
                } else if (v.name == 'ย้าย') {
                    n = 'เบิกของขึ้นรถ'
                } else if (v.name == 'สรุป') {
                    n = 'สรุปรายการอุปกรณ์คงเหลือ'
                } else if (v.name == 'รายงานการตรวจสภาพรถ') {
                    n = 'รายงานการตรวจสภาพรถ'
                    var d = {}
                    d.scope = 'report_checkcar'
                    this.doexcelserver(d)
                }
                pnt = this.np.nowtext + n
                    //console.log(pnt);
            }
            if (v.name == 'สรุป') {
                this.componentKey_Listallequipt += 1
                this.nameTitle_dialogListallequipt = pnt
                this.dialogListallequipt = true
            }
            if (v.name == 'ย้าย' || v.name == 'เพิ่ม') {
                this.componentKey_Qractivity += 1

                this.nameTitle_dialogactivity = pnt
                this.dialogactivity = true
            }
            if (v.name == 'ลด' || v.name == 'เชคยานพาหนะ' || v.name == 'เชคเครื่องมือ') {
                this.componentKey_Checklists += 1
                this.nameTitle_dialogChecklists = pnt
                console.log(pnt);
                this.dialogChecklists = true
            }
        }
    }
}