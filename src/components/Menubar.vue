<template>
      <Row id='meunbar' ref="MenuBar">
        <Col>
          <Menu theme="dark" :open-names="defalut" style='position:fixed;height:100%'>
                <Submenu :name="menu.type+index" v-for="(menu,index) in menuList" :key="menu.type+index">
                    <template slot="title">
                        <Icon :type="menu.icon" />
                          <span>{{menu.name}}</span>
                    </template>
                    <draggable @end='addNode' v-for="(son,i) in menu.children" :key="son.type+i">
                      <MenuItem :name="son.type+i" :type='son.type'  style="cursor:move"><Icon :type='son.icon' ></Icon>{{son.name}}</MenuItem>
                    </draggable>
                </Submenu>
                <Submenu :name="tem.type+index" v-for="(tem,index) in temList" :key="tem.type+index">
                    <template slot="title">
                        <Icon :type="tem.icon" />
                          <span>{{tem.name}}</span>
                    </template>
                    <draggable @end='addNode' v-for="(son,i) in tem.children" :key="son.type+i">
                      <MenuItem :name="son.type+i" :type='son.type'  style="cursor:pointer">
                        <div @click="selecttem(son.name)"><Icon :type='son.icon' style="margin-right:1em" >
                          </Icon>{{son.name}}
                          <Tooltip content="删除" placement="bottom"  style="float:right"><Icon type="ios-trash" @click="deltem(son.name)" style="font-size:1.5em"></Icon></Tooltip>
                        </div>
                      </MenuItem>
                    </draggable>
                </Submenu>
            </Menu>
        </Col>
      </Row>
</template>
<script>
import $ from 'jquery'
import draggable from 'vuedraggable'
export default {
    name:'Menubars',
    components:{draggable},
    props:['addtem'],
    data(){
      return{
        defalut:['tasknode0'],
        menuList:[
          {
            type:'tasknode',
            name:'任务节点',
            icon:'md-list-box',
            children:[
              {
                type:'start',
                name:'开始',
                icon:'md-play'
              },
              {
                type:'filter',
                name:'数据过滤',
                icon:'md-git-pull-request'
              },
              {
                type:'compare',
                name:'数据对比',
                icon:'md-git-pull-request'
              },
              {
                type:'end',
                name:'结束',
                icon:'md-pause'
              }
            ]
          },
          
        ],
        temList:[
          {
            type:'taskmuban',
            name:'任务模板',
            icon:'md-albums',
            children:[
              
            ]
          }
        ],
        addstatus:true
      }
    },
    watch:{
        addtem(val){
            this.gettemp()
        }
    },
    mounted(){
      this.gettemp()
    },
    methods:{
      gettemp(){
          var datatem = JSON.parse(localStorage.getItem('temdata'))
          var child = []
          if(datatem != null){
            if(datatem.length != undefined){
              for(let i = 0;i<datatem.length;i++){
                var aa = {}
                aa.type = 'temp',
                aa.name = datatem[i].name
                aa.icon = 'ios-paper'
                child.push(aa)
              }
              this.temList[0].children = child
            }
            else{
              var aa = {}
              aa.type = 'temp',
              aa.name = datatem.name
              aa.icon = 'ios-paper'
              child.push(aa)
              this.temList[0].children = child
            }
          }
          this.$emit('addok', this.addstatus)
      },
      getMenu(type) {
          for (var i = 0; i < this.menuList.length; i++) {
              let children = this.menuList[i].children;
              for (var j = 0; j < children.length; j++) {
                  let son = children[j]
                  if (son.type === type) {
                      return son
                  }
              }
          }
      },
      // 添加节点
      addNode(evt, e) {
          let nodeMenu = this.getMenu(evt.originalEvent.srcElement.type)
          this.$emit('addNode', evt, nodeMenu)
      },
      selecttem(name){
          this.$emit('changetem',name)
      },
      deltem(name){
          this.$Modal.confirm({
            title:'删除模板',
            content: '<p>删除模板：'+name+'?</p>',
            onOk:()=>{
              var nowdata = JSON.parse(localStorage.getItem('temdata'))
              var index = ''
              for(let i = 0;i<nowdata.length;i++){
                if(name == nowdata[i].name){
                  index = i
                }
              }
              nowdata.splice(index,1)
              this.$store.commit('savetemp',{temdata:nowdata})
              this.$emit('temdel',name)
              this.gettemp()
            },
            onCancel:()=>{
              this.$Message.info('取消')
            }
          })
          
      }
}
}
</script>
<style>
#meunbar{
  height: 100%;
  bottom:0;
  left: 0;
  width:120%;
  background-color: #404548;
  z-index: 999;
}
.btn{
  text-align: center;
  border:1px solid white; 
  border-radius:.5em;
  padding:1em 0;
  margin:1em 1.5em;
  color:white;
  cursor: pointer;
}
</style>

