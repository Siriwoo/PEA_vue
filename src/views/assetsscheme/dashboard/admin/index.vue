<template>
  <div>
    <span>Hello world</span>
  </div>
</template>

<script>

</script>

<style lang="scss" >
@import url('https://fonts.googleapis.com/css?family=Kanit');

html, body {
  font-family: 'Kanit', sans-serif;
}
#app {
  font-family: 'Kanit', sans-serif !important;
}
body{

  background-color: #f0f2f5;
}
.box-img-banner img{
  width: 100%;
}
.box-img-banner{
  padding: 0 !important;
}
.user-avatar {
  width: 45px;
  height: 45px;
}
.text {
    font-size: 17px;
}
.big_font{
  font-size: 28px;
  font-weight: bold;
  padding-left: 20px;
}
.qrdia .el-dialog.is-fullscreen {
    width: 100%;
    margin-top: 0;
    margin-bottom: 0;
    height: 98%;
    //overflow: hidden;???
}
.topic1{
  font-size: 43px;
  float: right;
  font-weight: bold;
}
.topic{
  font-size: 24px;
  font-weight: bold;
}

.suptopic{
  font-size: 14px;
  padding-top: 4px;
  color: #949494;
}
.boxtopic{

}
.item {
  padding: 5px 0;
  transition: 0.6s;
  display: flex;
  align-items:center;
}
.item:hover{
  background-color: #eff0f1;
  transition: 0.6s;
}
.box-card {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.box-card-nav{
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #fff;
  overflow: hidden;
  color: #626b7d;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  padding: 6px;
  font-size: 13px;

}
.previewfull{
  margin-right: 7px;
  width: 40px;
}
.boxsel{
  padding-bottom: 5px;
}
.suitbox{
  margin: auto;
  padding-top: 0px;
  padding-right: 15px;
}
.selseh{
  font-size: 13px;
  margin-right: 5px;
  border: 1px solid orange;
  padding: 5px;
  border-radius: 3px;
  transition: all 0.6s;
  color: orange;
}
.selseh:hover{
  background-color: orange;
  color: white;
  transition: all 0.6s;
  cursor: pointer;
}

.selseh_f{
  font-size: 13px;
  background-color: orange;
  color: white;
  padding: 5px;
  border: 1px solid orange;
  border-radius: 3px;
  transition: all 0.6s;
}
.el-dialog{
  width: 700px !important;
}
.dashboard-editor-container {
  padding: 0px;
  background-color: rgb(240, 242, 245);
  position: relative;
  margin: auto;
  width: 720px;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
@media (max-width:768px) {
  .el-input-number.is-controls-right .el-input__inner .el-input-number--large .el-input {

    padding-left: 15px !important;
    padding-right: 50px!important;
    padding-bottom: 10px !important;
    padding-top: 5px !important;
  }
  .el-dialog__title{
    font-size: 16px;
  }
  .el-dialog{
    margin-top: 1vh !important;
    width: 97% !important;
  }
  .el-input{
    font-size: 38px !important;
  }
  .listtext{
    font-size: 14px;
  }
  .el-message-box {
    width:100% !important;
  }
  .el-input__inner {
    height: 64px;
  }
  .nofull .el-dialog{
    margin-top: 30vh !important;
  }
  .nofull .el-dialog__body {
    background-color: #f0f2f5 !important;
    padding: 0px 0px 2px !important;
    overflow: auto;
    height: auto !important;
  }
  .el-dialog__body{
    background-color: #f0f2f5 !important;
    padding: 0px 0px 2px !important;
    overflow: auto;
    height: 90vh;
  }
  .big_font{
    font-size: 24px;
    font-weight: bold;
    padding-left: 20px;
  }
  .text {
      font-size: 15px;
  }
  .previewfull{
    margin-right: 7px;
    width: 35px;
  }
  .topic1{
    font-size: 37px;
    float: right;
    font-weight: bold;
    padding-right: 6px;
  }
  .topic{
    font-size: 21px;
    font-weight: bold;
  }
  .topicdepart{
    font-size: 20px;
    font-weight: bold;
    color:#9c27b0
  }
  .dashboard-editor-container{
    padding: 3px;
    background-color: #f0f2f5;
    position: relative;
    width: 98%;
    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
  .suitbox{
    padding-top: 0px;
    padding-right: 0px;
  }
}

</style>
