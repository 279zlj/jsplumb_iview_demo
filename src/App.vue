<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
body,html,#app{
  margin:0;
  padding:0;
  height:100%;
  width:100%;
}
a{
  text-decoration: none;
}
.ivu-modal-footer{
    border-top: 0px !important;
}
.usertop{
    width: 100%;
}
.content{
    background-color: white;
    width: 100%;
    padding: 1em 0; 
    /* border-bottom:1px solid gray; */
    box-shadow: 0px 5px 10px -4px gray;
    margin:0 0 3em 0 !important; 
}
.index{
    background-color: white;
    width: 100%;
    padding: 1em 0; 
    /* border-bottom:1px solid gray; */
    box-shadow: 0px 5px 10px -4px gray;
    margin:0 0 1em 0 !important; 
}
h2{
    padding-left:1em !important;
}
.layout{
        width:100%;
        height:100%;
        bottom:0;
        left: 0;
    }
    .card_content{
      margin:0 1.5em 1em 1.5em !important;
    }
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
    width: 4px;
    height: 0px;
    background-color: #F5F5F5;
}
 
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 3px gray;
    background-color: #D6D6D6;
}
 
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
    -webkit-box-shadow: inset 0 0 6px gray;
    background-color: #3390ED;
}
</style>
