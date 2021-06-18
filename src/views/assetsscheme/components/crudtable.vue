<template>
  <div class="app-container-lise">
    <v-data-table
   :headers="headers"
   :items="desserts"
   sort-by="calories"
   class="elevation-1"
 >
   <template v-slot:top>
     <v-toolbar flat color="white">
       {{namecar.title}}
      <v-btn color="primary" fab small dark @click="dopickprofile('allcar')">
        <i class="el-icon-folder-opened"></i>
      </v-btn>
       <v-divider
         class="mx-4"
         inset
         vertical
       ></v-divider>

       <v-toolbar-title>{{predesserts.title}}
        <v-btn color="primary" fab small dark @click="dopickprofile('profile')">
          <i class="el-icon-folder-opened"></i>
        </v-btn>
       </v-toolbar-title>
       <v-spacer></v-spacer>
       <v-btn color="primary" small dark @click="dosavecarprofile()">
          บันทึก
       </v-btn>
       <v-dialog v-model="dialog" max-width="500px">
         <!--template v-slot:activator="{ on, attrs }">
           <v-btn
             color="primary"
             dark
             class="mb-2"
             v-bind="attrs"
             v-on="on"
           >New Item</v-btn>
         </template-->
         <v-card>
           <v-card-title>
             <span class="headline">{{ formTitle }}</span>
           </v-card-title>

           <v-card-text>
             <v-container>
               <v-row>
                 <v-col cols="11" sm="5" md="3">
                   <v-text-field v-model="editedItem.code" label="CODE"></v-text-field>
                 </v-col>
                 <v-col cols="12" sm="6" md="6">
                   <v-text-field v-model="editedItem.name" label="ชื่อ" disabled></v-text-field>
                 </v-col>
                 <v-col cols="12" sm="6" md="4">
                   <v-text-field v-model="editedItem.alert" label="Alert"></v-text-field>
                 </v-col>
                 <v-col cols="12" sm="6" md="4">
                   <v-text-field v-model="editedItem.max" label="Max"></v-text-field>
                 </v-col>
               </v-row>
             </v-container>
           </v-card-text>

           <v-card-actions>
             <v-spacer></v-spacer>
             <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
             <v-btn color="blue darken-1" text @click="save">Save</v-btn>
           </v-card-actions>
         </v-card>
       </v-dialog>
     </v-toolbar>
   </template>
   <template v-slot:item.actions="{ item }">
     <div class="c_inline">
       <div class="" @click="editItem(item)">
         <i class="el-icon-edit"></i>
       </div>
       <div class="" @click="deleteItem(item)">
         <i class="el-icon-delete"></i>
       </div>
     </div>


   </template>
   <!--template v-slot:no-data>
     <v-btn color="primary" >Reset</v-btn>
   </template-->
 </v-data-table>
 <el-dialog
   :title="nameTitle_PickProfileTable"
   :visible.sync="dialogPickProfileTable"
   width="95%">
   <PickProfileTable
   :key="componentKey_PickProfileTable"
   @clickPickProfileTable="clickPickProfileTable"
   :typepickprofile="typepickprofile"
   />
 </el-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import { toggleClass } from '@/utils'
import avatar from "@/assets/toppup/avatar.png"
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import { getUserData, setUserclick, getUserclick } from '@/utils/auth'
import {frefucqr} from '@/views/qrcodescheme/mixins/frefucqr'
import PickProfileTable from '@/views/qrcodescheme/components/pick_profile_table'



export default {
  name: 'Theme',
  mixins: [frefucqr],
  components: {
    PickProfileTable
  },
  props:[],
  data() {
    return {
      namecar: {
        title:'เลือกรถ'
      },
      dialog: false,
      predesserts: {title:'เลือก profile'},
      codecar: '',
      headers: [
        { text: 'CODE', value: 'code' },
        { text: 'Name', value: 'calories' },
        { text: 'Alert', value: 'alert' },
        { text: 'Max', value: 'max' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      typepickprofile: '',
      dialogPickProfileTable: false,
      nameTitle_PickProfileTable: '',
      componentKey_PickProfileTable: 0,
    }
  },
  created() {
  },
  computed:{
    formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      }
  },
  watch: {
    dialog (val) {
        val || this.close()
    }
  },
  methods: {
    queryfirstvalue(){
      //get all name of qr_warehouse_profile

    },
    dopickprofile(d){
      this.typepickprofile = d
      if(d=='profile'){
        this.nameTitle_PickProfileTable = 'เลือก Profile รถที่ต้องการแก้ไข'
      }else if(d=='allcar'){
        this.nameTitle_PickProfileTable = 'เลือกรถที่ต้องการใช้ profile นี้'
      }
      this.dialogPickProfileTable = true
      this.componentKey_PickProfileTable += 1;
    },
    dosavecarprofile(){
      var tmp = {}
      tmp.info = 'updatecarprofile'
      tmp.param1 = {
        codeprofile:this.predesserts.id,
        codecar:this.namecar.codecar,
        alltools:this.predesserts.details
      }
      console.log(tmp);
      this.$store.dispatch('info/fetchandupdate', tmp)
      .then(r=>{
        try {

        } catch (e) {

        } finally {

        }
        console.log(r);

      })
    },
    clickPickProfileTable(i){
      //this.predesserts = i
      //this.dialogPickProfileTable = false
      if(this.typepickprofile=='profile'){
        this.predesserts = i
        this.desserts = this.predesserts.details
        this.componentKey_Crudtable++
      }else if (this.typepickprofile=='allcar') {
        this.namecar = i
      }
      this.dialogPickProfileTable = false
      console.log(i);
    },

    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.desserts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },

  },
  mounted() {
    //do something after mounting vue instance
    console.log('Hi from mounted');

  }
}
</script>

<style scoped>
.field-label{
  vertical-align: middle;
}
.c_inline{
  display: flex;
}
.c_inline>*{
  padding: 10px;
}
</style>
