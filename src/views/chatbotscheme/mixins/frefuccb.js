export const frefuccb = {
  data (){
    return{

    }
  },
  methods: {
    trimdata_before_save (x) {
      for (var i = 0; i < x.length; i++) {
        if(x[i].type=='Image'||x[i].type=='image'){
          var t = x[i].content.midiapic
          x[i].content = {}
          x[i].content.midiapic = t
        }

      }
      return x
    }
  }
}
