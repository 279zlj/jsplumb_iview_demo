<template>
  <Row style="height:100%">
      <Col ref="MenuBar">
        <MenuBar @addNode='addNode' @changetem='changetem' @temdel='temdel' :addtem='addtem' @addok='addok'></MenuBar>
      </Col>
      <Col style="margin-left:240px;" id='bor'>
      <Row :gutter="10" class="index" style="margin-bottom:1.5em;position:relative">
        <Col
          :xs="{span:4, offset:4}"
          :sm="{span:4, offset:4}"
          :md="{span:3, offset:9}"
          :lg="{span:2, offset:14}"
          :xxl="{span:2, offset:14}"
        >
          <Button type="primary" @click="clearflow">清除画布</Button>
        </Col>
        <Col :xs="4" :sm="4" :md="3" :lg="2" :xxl="2">
          <Button type="primary" @click="upload">上传文件</Button>
        </Col>
        <Col :xs="4" :sm="4" :md="3" :lg="2" :xxl="2">
          <Button type="primary" @click="setting">全局设置</Button>
        </Col>
        <Col :xs="4" :sm="4" :md="3" :lg="2" :xxl="2">
          <Button type="primary" @click="save">保存模板</Button>
        </Col>
        <Col :xs="4" :sm="4" :md="3" :lg="2" :xxl="2">
          <Button type="primary" @click="start">启动程序</Button>
        </Col>
      </Row>
      <Row id="test" style="height:100%">
        <Collapse v-model="value1" id="colla">
          <Panel name="1">
            <span style="color:#2b85e4">
              <b>服务器信息</b>
            </span>
            <div slot="content">
              <p>
                <span>CPU使用率：</span>
                <Progress :percent="45" status="active" />
              </p>
              <p>
                <span>内存使用率：</span>
                <Progress :percent="25" status="active" />
              </p>
            </div>
          </Panel>
        </Collapse>
        <div style="width:100%;overflow:scroll;height:100%" id="container" v-if="easyFlowVisible">
        <div id='flowContainer' class="container" ref='flowContainer' @mousedown="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)" >
          <template v-for="node in data.nodeList" >
              <flowNode
                      v-show="node.show"
                      :id="node.id"
                      :node="node"
                      @deleteNode="deleteNode"
                      @changeNodeSite="changeNodeSite"
                      @nodeRightMenu="nodeRightMenu"
                      @editNode="editNode"
                      @detailNode="detailNode"  
                      
              >
              </flowNode>
          </template>
        </div>
        </div>
      </Row>
      <Modal v-model="uploadfile" title="上传文件" @on-ok="uploadserver" @on-cancel="uploadfile = false">
        <div>
          <Upload
            multiple
            ref="upload"
            type="drag"
            :before-upload="handleUpload"
            action="//jsonplaceholder.typicode.com/posts/"
          >
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #2b85e4"></Icon>
            </div>
          </Upload>
          <div>
            <ul class="file-list" v-for="(list,index) in file" :key="index">
              <li>
                文件名:{{ list.name }}
                <Icon type="ios-close" style="float:right;" size="20" @click="delFileList(index)"></Icon>
              </li>
            </ul>
          </div>
        </div>
      </Modal>
      <Modal v-model="globalsetting" title="全局设置" width="40%">
        <Form :model="gdata" ref="gdata" :rules="grules" label-position="left" :label-width="100">
          <FormItem label="任务名称" prop="flowname">
            <Input v-model="gdata.flowname" type="text" placeholder="请输入任务名称"></Input>
          </FormItem>
          <FormItem label="物种" prop="species">
            <Select v-model="gdata.species" placeholder="请选择物种">
              <Option value="hg" key="hg">人类</Option>
            </Select>
          </FormItem>
          <FormItem label="单双端选择" prop="changesel">
            <Select v-model="gdata.changesel">
              <Option value="0" key="0">单端</Option>
              <Option value="1" key="1">双端</Option>
            </Select>
          </FormItem>
          <FormItem label="下机数据" prop="machine" v-if='gdata.changesel == "0"'>
            <Transfer :data="userfile" :target-keys="targetdata" :render-format="render1" @on-change="handleChange"></Transfer>
          </FormItem>
          <FormItem label="左侧下机数据" prop="leftdata" v-if='gdata.changesel == "1"'>
            <Transfer :data="userfile" :target-keys="targetdata" :render-format="render1" @on-change="handleChange"></Transfer>
            <span style="color:red">（注：自动匹配右侧下机数据）</span>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="gsubmit('gdata')">提交</Button>
            <Button @click="greset('gdata')" style="margin-left:1em">重置</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      <Modal v-model="temvisiable" title="编辑" >
        <Form :model="temp" ref="temp" :rules="temrule" label-position="left" :label-width="100">
          <FormItem label="模板名称" prop="temname">
            <Input v-model="temp.temname" type="text" placeholder="请输入模板名称"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="savetem('temp')">提交</Button>
            <Button @click="greset('temp')" style="margin-left:1em">重置</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      </Col>
      <flow-info v-if="flowInfoVisible" ref="flowInfo" :data="data"></flow-info>
      <flow-node-form v-if="nodeFormVisible" ref="nodeForm"></flow-node-form>
  </Row>
</template>
<script>
import { truncate, mkdir } from "fs";
import draggable from 'vuedraggable'
import {jsPlumb} from 'jsplumb'
import MenuBar from '../../components/Menubar'
import $ from 'jquery';  //必须引入jquery
import 'jsplumb'
import flowNode from './node'
import FlowInfo from './info'
import FlowNodeForm from './node_form'
import lodash from 'lodash'
import {getDataA} from './data_A'
export default {
  name: "draw",
  components:{MenuBar,flowNode,FlowInfo,FlowNodeForm},
  data() {
    const checkname = (rule, val, callback) => {
      if (!val) {
        callback(new Error("请输入任务名称"));
      } else callback();
    };
    const checkleft = (rule, val, callback) => {
      if (val.length == 0) {
        callback(new Error("请选择左侧下机数据"));
      } 
      else callback();
    };
    const checksel = (rule, val, callback) => {
      if (!val) {
        callback(new Error("请选择单端或双端测试"));
      }
      else callback();
    };
    const checkspcies = (rule, val, callback) => {
      if(!val) {
        callback(new Error("请选择物种"))
      }else callback();
    }
    const checkntemame = (rule, val, callback) => {
      if(!val) {
        callback(new Error('请输入模板名称'))
      }
      else
        callback()
    }
    const checksingle = (rule,val,callback) =>{
      if(val.length == 0){
        callback(new Error('选择单端下机数据'))
      }
      else
        callback()
    }
    return {
        uploadfile: false,
        temvisiable: false,
        globalsetting: false,
        flowInfoVisible:false,
        nodeFormVisible:false,
        addtem:'',
        jsPlumb: null,// jsPlumb 实例
        easyFlowVisible: true,
        userfile:[
          { "key": "1", "label": "Content 1", "disabled": false  },
          { "key": "2", "label": "Content 2", "disabled": false  },
          { "key": "3", "label": "Content 3" , "disabled": false }
        ],
        targetdata:[],
        zoomNum:1,
        moveDataelse: {
        x: null,
        y: null
        },
        index: 1,
        finishdata: [],
        jsplumbSetting: {
            // 动态锚点、位置自适应
            Anchors: ['Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter', 'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'],
            Container: 'flowContainer',
            // 连线的样式 StateMachine、Flowchart
            Connector: 'Flowchart',
            // 鼠标不能拖动删除线
            ConnectionsDetachable: false,
            // 删除线的时候节点不删除
            DeleteEndpointsOnDetach: false,
            // 连线的端点
            // Endpoint: ["Dot", {radius: 5}],
            Endpoint: ["Dot", {height: 5, width: 5}],
            // 线端点的样式
            EndpointStyle: {fill: '#E44076', outlineWidth: 1},
            // 连线的端点
            // Endpoint: ["Dot", {radius: 5}],
            // Endpoint: ["Rectangle", {height: 10, width: 10}],
            // 线端点的样式
            // EndpointStyle: {fill: 'rgba(255,255,255,0)', outlineWidth: 1},
            LogEnabled: true,//是否打开jsPlumb的内部日志记录
            // 绘制线
            PaintStyle: {stroke: '#3D89E9', strokeWidth: 3},
            // 绘制箭头
            Overlays: [['PlainArrow', {width: 12, length: 12, location: 1}]],
            RenderMode: "svg"
        },
        //拖动时的演示
        DragOptions: {
          cursor: 'pointer',
          zIndex: 2000
        },
        // jsplumb连接参数
        jsplumbConnectOptions: {
            isSource: true,
            isTarget: true,
            // 动态锚点、提供了4个方向 Continuous、AutoDefault
            anchor: "Continuous"
        },
        jsplumbSourceOptions: {
            filter: ".flow-node-drag",/*"span"表示标签，".className"表示类，"#id"表示元素id*/
            filterExclude: false,
            anchor: "Continuous",
            allowLoopback: false
        },
        jsplumbTargetOptions: {
            filter: ".flow-node-drag",/*"span"表示标签，".className"表示类，"#id"表示元素id*/
            filterExclude: false,
            anchor: "Continuous",
            allowLoopback: false
        },
        // 是否加载完毕
        loadEasyFlowFinish: false,
        work_id: "work_id",
        offsetX:'',
        offsetY:'',
        file: [
           
        ],
        data:{
          name: localStorage.getItem('loginname'),
          nodeList: [],
          lineList: []
        },
        flowdata:[],
        value1: "1",
        gdata: {
            flowname: "",
            leftdata: [],
            species:'',
            changesel:'',
            machine:[]
        },
        grules: {
            flowname: [{ validator: checkname, trigger: "blur" }],
            leftdata: [{ validator: checkleft, trigger: "blur" }],
            changesel:[{validator:checksel,trigger:'blur'}],
            species:[{validator: checkspcies, trigger: 'blur'}],
            machine:[{validator:checksingle,trigger:'blur'}]
        },
        temp: {
          temname:''
        },
        temrule: {
          temname: [
            { validator:checkntemame , trigger: 'blur'}
          ]
        },
        
    }
  },
  computed:{
    globaldata(){
      return this.$store.state.globalset
    },
    upfile(){
      return this.$store.state.filename
    },
    savetemp(){
      return this.$store.state.temdata
    },
    
  },
  methods: {
    jsPlumbInit() {
      
      const _this = this
      this.jsPlumb.ready(function () {

          // 导入默认配置
          _this.jsPlumb.importDefaults(_this.jsplumbSetting)
          // 会使整个jsPlumb立即重绘。
          _this.jsPlumb.setSuspendDrawing(false,true)
          // 初始化节点
          _this.loadEasyFlow()
          // 单点击了连接线,
          _this.jsPlumb.bind('click', function (conn, originalEvent) {

              _this.$Modal.confirm({
                title:'提示',
                content:'确定删除所点击的线吗?',
                closable:false,
                onOk:()=>{
                  _this.jsPlumb.deleteConnection(conn)
                },
                onCancel:()=>{

                }
              })
          })
          // 连线
          _this.jsPlumb.bind("connection", function (evt) {
              let from = evt.source.id
              let to = evt.target.id
              if (_this.loadEasyFlowFinish) {
                  _this.data.lineList.push({
                      from: from,
                      to: to
                  })
              }
          })

          // 删除连线
          _this.jsPlumb.bind("connectionDetached", function (evt) {
              _this.deleteLine(evt.sourceId, evt.targetId)
          })

          // 改变线的连接节点
          _this.jsPlumb.bind("connectionMoved", function (evt) {
              _this.changeLine(evt.originalSourceId, evt.originalTargetId)
          })

          // 单击endpoint
          // jsPlumb.bind("endpointClick", function (evt) {
          //   console.log('endpointClick', evt)
          // })
          //
          // // 双击endpoint
          // jsPlumb.bind("endpointDblClick", function (evt) {
          //   console.log('endpointDblClick', evt)
          // })

          // contextmenu
          _this.jsPlumb.bind("contextmenu", function (evt) {
              console.log('contextmenu', evt)
          })


          // beforeDrop
          _this.jsPlumb.bind("beforeDrop", function (evt) {
              let from = evt.sourceId
              let to = evt.targetId
              for(let i=0;i<_this.data.nodeList.length;i++){
                if(_this.data.nodeList[i].id == from){
                  if(to.indexOf('数据对比') != -1)
                    _this.data.nodeList[i].child.push(to.replace('数据对比','Data_comparison'))
                  if(to.indexOf('数据过滤') != -1)
                    _this.data.nodeList[i].child.push(to.replace('数据过滤','Data_filtering'))
                  if(to.indexOf('开始') != -1)
                    _this.data.nodeList[i].child.push(to.replace('数据过滤','state'))
                }
              }
              if (to.indexOf('开始') != -1) {
                _this.$Notice.error({
                    title: "不能连到开始",
                    desc: ""
                  })
                  return false
              }
              if (from === to) {
                  _this.$Notice.error({
                    title: "不能连接自己",
                    desc: ""
                  })
                  return false
              }
              if (_this.hasLine(from, to)) {
                  // this.$message.error('不能重复连线');
                  _this.$Notice.error({
                    title: "不能重复连线",
                    desc: ""
                  })
                  return false
              }
              if (_this.hashOppositeLine(from, to)) {
                  // this.$message.error('不能回环哦');
                  _this.$Notice.error({
                    title: "不能回环哦",
                    desc: ""
                  })
                  return false
              }
              return true
          })

          // beforeDetach
          _this.jsPlumb.bind("beforeDetach", function (evt) {
              console.log('beforeDetach', evt)
          })
      })
  },
  loadEasyFlow() {
        // 初始化节点
        for (var i = 0; i < this.data.nodeList.length; i++) {
            let node = this.data.nodeList[i]
            // 设置源点，可以拖出线连接其他节点
            this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions)
            // // 设置目标点，其他源点拖出的线可以连接该节点
            this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
            // jsPlumb.addEndpoint(node.id)
            // 设置可拖拽，如果没有注释，切换时会发生节点能够拖动但是线不会随动的状况
            // jsPlumb.draggable(node.id, {
            //     containment: 'parent',
            //     grid: [10, 10]
            // })

            this.jsPlumb.draggable(node.id, {
                containment: 'parent'
            })

            // jsPlumb.draggable(node.id)
        }
        // 初始化连线
        for (var i = 0; i < this.data.lineList.length; i++) {
            let line = this.data.lineList[i]
            this.jsPlumb.connect({
                source: line.from,
                target: line.to,
            }, this.jsplumbConnectOptions)
        }
        this.$nextTick(function () {
            this.loadEasyFlowFinish = true
        })
    },
    handleUpload(file) {
      this.file.push(file)
      return false
    },
    delFileList(index) {
      let that = this
      that.file.splice(index, 1)
    },
    upload() {
      this.file = [];
      this.uploadfile = true;
    },
    uploadserver() {
      this.$store.commit('uploadfile',{filename:this.file})
    },
    setting() {
      this.$refs["gdata"].resetFields();
      this.globalsetting = true;
      var name = JSON.parse(localStorage.getItem('loginname'))
      // this.$axios.get(this.host+'/sxairresource/see',{params:{username:name}}).then(res=>{
      //   this.userfile = res.data.Result
      // }).catch(error=>{
      //   console.log(error)
      // })
    },
    gsubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("ok");
          this.$store.commit('globaldata',{globalset:this.gdata})
          this.globalsetting = false
        } else {
          this.$Message.error("fail");
        }
        
      });
      
    },
    greset(name) {
      this.$refs[name].resetFields();
    },
    save() {
      if(this.data.lineList.length !=0 ){
        this.temvisiable = true
      }
      else{
        this.$Notice.error({
          title: "没有完整的流程图",
          desc: ""
        });
      }
    },
    savetem(name) {
      this.$refs[name].validate((valid)=>{
        if(valid){
          this.data.name = this.temp.temname
          if(localStorage.getItem('temdata') != undefined ){
            
            var olddata = JSON.parse(localStorage.getItem('temdata'))
            var newdata = []
            
            if(olddata.length >= 1 && olddata[0].name ){
              for(let  i =0 ;i<olddata.length;i++){
                
                if(this.data.name == olddata[i].name)
                {
                  this.$Notice.warning({
                    title:'模板名称重复'
                  })
                  continue
                }
                else
                  newdata.push(olddata[i])
              }
              
            }
            else{
              newdata=olddata
              this.$store.commit('savetemp',{temdata:newdata})
              this.addtem = 'addnew'
            }
            newdata.push(this.data)
            this.$store.commit('savetemp',{temdata:newdata})
            this.addtem = 'addnew'
          }
          else{
            this.$store.commit('savetemp',{temdata:this.data})
            this.addtem = 'addnew'
          }
          this.temvisiable = false
          
        }
      })
    },
    addok(name) {
      if(name)
        this.addtem = ''
    },
    start() {
      this.finishdata = []
      if(this.$store.state.globalset.length!=0 ){
        if( this.data.lineList.length !=0){
            var arr = JSON.stringify(this.$store.state.globalset)
            // arr.push(...sessionStorage.getItem('username'))
            // console.log(arr)
            var a = {}
            a.username = sessionStorage.getItem('username')
            a.flowname = JSON.parse(arr).flowname
            a.leftdata = JSON.parse(arr).leftdata
            a.rightdata = JSON.parse(arr).rightdata
            a.species = JSON.parse(arr).species
            this.finishdata.push(a)
            var e = {}
            for(let b = 0;b<this.data.nodeList.length;b++){
              if(this.data.nodeList[b].show){
              var c = {}
              c.left = this.data.nodeList[b].left
              c.top = this.data.nodeList[b].top
              if(this.data.nodeList[b].name.indexOf('开始') != -1)
                c._type = 'type_start'
              else if(this.data.nodeList[b].name.indexOf('数据') != -1 )
                c._type = 'type_flow'
              else if(this.data.nodeList[b].name.indexOf('结束') != -1 )
                c._type = 'type_end'
              c.list_data = []
              if(this.data.nodeList[b].name.indexOf('数据过滤') != -1){
                let d = {}
                d.l = this.data.nodeList[b].len
                d.la = this.data.nodeList[b].leftnum
                d.ra = this.data.nodeList[b].rightnum
                d.c = this.data.nodeList[b].num
                d.a = this.data.nodeList[b].thread
                c.list_data.push(d)
              }
              if(this.data.nodeList[b].name.indexOf('数据对比') != -1){
                let d = {}
                d.a = this.data.nodeList[b].thread
                d.t = this.data.nodeList[b].gene
                c.list_data.push(d)
              }
              c.child = this.data.nodeList[b].child
              if(this.data.nodeList[b].name.indexOf('开始') != -1){
                e.state1 = c
              }
              else if(this.data.nodeList[b].name.indexOf('数据过滤') != -1){
                let k1 = 'Data_filtering'+b
                e[k1] = c
              }
              else if(this.data.nodeList[b].name.indexOf('数据对比') != -1){
                let k2 = 'Data_comparison'+b
                e[k2] = c
              }

            }
            
            a.data = e
            }
            // console.log(this.finishdata)
            this.$axios.post(this.host+'/procedure/startflow',{data:this.finishdata}).then(res => {
            if (res.data.status) {
              this.$Notice.success({
                title: "操作成功",
                desc: ""
              })
            } else {
              this.$Notice.error({
                title: "操作失败",
                desc: ""
              })
            }
          })
            
        }
        else{
          this.$Notice.error({
            title: "流程不完整",
            desc: ""
          })
        }
      }
      else{
        this.$Notice.error({
            title: "请先设置全局参数",
            desc: ""
          })
      }
      
    },
    
  mouseDownHandleelse (event) {
    // console.log('mouseDownHandleelse')
      this.moveDataelse.x = event.pageX - this.$refs.flowContainer.offsetLeft
      this.moveDataelse.y = event.pageY - this.$refs.flowContainer.offsetTop
      event.currentTarget.style.cursor = 'move'
      window.onmousemove = this.mouseMoveHandleelse
    },
    mouseMoveHandleelse (event) {
      // console.log('mouseMoveHandleelse')
      let moveLeft = event.pageX - this.moveDataelse.x + 'px'
      let moveTop = event.pageY - this.moveDataelse.y + 'px'
      this.$refs.flowContainer.style.left = moveLeft
      this.$refs.flowContainer.style.top = moveTop
    },
    mouseUpHandleelse (event) {
      // console.log('mouseUpHandleelse')
      window.onmousemove = null
      event.currentTarget.style.cursor = 'move'
    },

  changezoom(e) {
    var _this = this;
    var canvasDom = document.getElementById('flowContainer');
    var mainDom = document.getElementById('container');
    var p = [ "webkit", "moz", "ms", "o" ];
// window.addEventListener("mousewheel DOMMouseScroll", function (e) { 
   var delta = (e.wheelDelta && (e.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie &其它  
               (e.detail && (e.detail > 0 ? -1 : 1));// firefox
    
    if (delta > 0) {
        // 向上滚  
		for (var i = 0; i < p.length; i++) {
			canvasDom.style[p[i] + "zoom"] =  this.zoomNum ;
		 }

	    canvasDom.style["zoom"] =  this.zoomNum ;
		this.zoomNum += 0.01;				      
    } else if (delta < 0) {  
        // 向下滚    
        if(this.zoomNum > 0.1) {
			this.zoomNum -= 0.01;
			for (var i = 0; i < p.length; i++) {
				canvasDom.style[p[i] + "zoom"] =  this.zoomNum ;
			 }
			
			canvasDom.style["zoom"] =  this.zoomNum ;
		}
    }  
    return false
// });  
  },
  
    getNodes() {
        console.log(jsPlumb)
        console.log(jsPlumb.Defaults)
    },
    getLines() {
        console.log('线', jsPlumb.getConnections())
    },
    // 删除线
    deleteLine(from, to) {
        for(let i = 0; i<this.data.nodeList.length;i++){
          if(this.data.nodeList[i].id == from){
            let array = this.data.nodeList[i].child
            let index = this.contains(array,to)
            array.splice(index,1)
          }
        }
        this.data.lineList = this.data.lineList.filter(function (line) {
            return line.from !== from && line.to !== to
        })
    },
    // 改变连线
      changeLine(oldFrom, oldTo) {
          this.deleteLine(oldFrom, oldTo)
      },
      // 改变节点的位置
      changeNodeSite(data) {
          for (var i = 0; i < this.data.nodeList.length; i++) {
              let node = this.data.nodeList[i]
              if (node.id === data.nodeId) {
                  node.left = data.left
                  node.top = data.top
              }
          }
      },
      // 添加新的节点
      addNode(evt, nodeMenu) {
          let width = this.$refs.MenuBar.$el.clientWidth
          const index = this.index++
          let nodeId = nodeMenu.name + (index - 1) 
          this.data.nodeList.push({
              id: nodeMenu.name + (index -1),
              name: nodeMenu.name,
              left: evt.originalEvent.layerX - 240 * this.zoomNum  + 'px',
              top: evt.originalEvent.clientY - 130 * this.zoomNum + 'px',
              icon: nodeMenu.icon,
              show: true,
              status:'准备状态',
              detail:'这个流程是通过数据对比，得到的数据',
              child:[]
          })
          this.$nextTick(function () {

              this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)

              this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)

              this.jsPlumb.draggable(nodeId, {
                  containment: 'parent'
              })

          })
      },
      changetem(name) {
        // this.reloaddata()
        var tdata = JSON.parse(localStorage.getItem('temdata'))
        var tindex = ''
        for(let i = 0;i<tdata.length;i++){
          if(name == tdata[i].name){
            tindex = i
          }
        }
        // console.log(tdata[tindex])
        this.dataReload(tdata[tindex])
        this.data = tdata[tindex]
      },
      temdel() {
        this.dataReload(this.data)
        // this.reloaddata()
      },
      clearflow() {
        this.dataReload(this.data)
        // this.reloaddata()
      },
      reloaddata () {             //重新加载
          this.reload = false
          this.$nextTick(() => (this.reload = true))
        },
      dataReload(data) {
        this.easyFlowVisible = false
        this.data.nodeList = []
        this.data.lineList = []
        this.$nextTick(() => {
            // 这里模拟后台获取数据、然后加载
            data = lodash.cloneDeep(data)
            this.easyFlowVisible = true
            this.data = data
            this.$nextTick(() => {
                this.jsPlumb = jsPlumb.getInstance()
                this.$nextTick(() => {
                    this.jsPlumbInit()
                })
            })
        })
    },
      // 是否具有该线
      hasLine(from, to) {
          for (var i = 0; i < this.data.lineList.length; i++) {
              var line = this.data.lineList[i]
              if (line.from === from && line.to === to) {
                  return true
              }
          }
          return false
      },
      // 是否含有相反的线
      hashOppositeLine(from, to) {
          return this.hasLine(to, from)
      },
      nodeRightMenu(nodeId, evt) {
          this.menu.show = true
          this.menu.curNodeId = nodeId
          this.menu.left = evt.x + 'px'
          this.menu.top = evt.y + 'px'
      },
      deleteNode(nodename,nodeId) {
        this.$Modal.confirm({
          title:'提示',
          content:'确定要删除——'+nodename+'？',
          closable:false,
          onOk:()=>{
            this.data.nodeList =  this.data.nodeList.filter(function (node) {
            // return node.id !== nodeId
              if (node.id === nodeId){
                  node.show = false
              }
              
            return true
            })
            // for (let i = 0;i<this.data.nodeList.length;i++){
            //     if(nodeId == this.data.nodeList[i].id){
            //       this.data.nodeList.splice(i,1)
            //     }
            //   }
            this.$nextTick(function () {
                this.jsPlumb.removeAllEndpoints(nodeId);
            })
            // this.delNode(nodeId)
          },
          onCancel:()=>{
            return true
          }
        })
        
        return true
        
    },
    delNode(nodeId) {
      for (let i = 0; i < this.data.nodeList.length; i++) {
        if(nodeId == this.data.nodeList[i].id){
          this.data.nodeList.splice(i,1)
        }
      }
      for(let a = 0; a < this.data.lineList.length; a++) {
        
        if(this.data.lineList[a].to == nodeId || this.data.lineList[a].from == nodeId){
          this.data.lineList.splice(a,1)
        }
      }
      console.log(this.data)
    },
    detailNode(nodeId,content) {
      this.$Modal.confirm({
        title:'流程描述',
        content:content,
        closable:false,
        onOk:()=>{
          return true;
        }
      })
    },
    editNode(nodeId) {
        this.nodeFormVisible = true
        this.$nextTick(function () {
            this.$refs.nodeForm.init(this.data,nodeId)
        })
    },
    // 流程数据信息
    dataInfo() {
        this.flowInfoVisible = true
        this.$nextTick(function () {
            this.$refs.flowInfo.init()
        })
    },

// 数据重新载入
    dataReloadA() {
      // var temdata = JSON.parse(localStorage.getItem('temdata'))
      this.dataReload(this.data)
        
    },
    changeLabel() {
        var lines = this.jsPlumb.getConnections({
            source: 'nodeA',
            target: 'nodeB'
        })
        lines[0].setLabel({
            label: '   ',
            cssClass: 'labelClass'
        })
    },
    render1 (item) {
        return item.label;
    },
    handleChange (newTargetKeys, direction, moveKeys) {
        this.targetdata = newTargetKeys;
        console.log(this.targetdata,newTargetKeys, direction, moveKeys)
    },
    FrameHeight() {
        var ifm= document.getElementById("bor"); 
        ifm.style.height=(document.documentElement.clientHeight - 134 )+'px';
        // ifm.contentWindow.location.reload(true);
    },
    changeFrameHeight() {
        var ifm= document.getElementById("container"); 
        ifm.height=document.documentElement.clientHeight+'px';
        var bor= document.getElementById("bor"); 
        bor.style.height=(document.documentElement.clientHeight - 134 )+'px';
    }
  },
  mounted() {
    this.jsPlumb = jsPlumb.getInstance()
    this.$nextTick(() => {
        this.dataReloadA()
    })
    this.FrameHeight()
    // window.οnresize = function() {  
    //     this.changeFrameHeight();  
    // }
    window.addEventListener('resize',() => this.changeFrameHeight(), false)
  },
}
</script>
<style >

#flowContainer {
    background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%), linear-gradient(rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%);
    background-size: 10px 10px;
    height: 200%;
    width: 150%;
    background-color: rgb(251, 251, 251);
    /*background-color: #42b983;*/
    position: relative;
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
.btn-controler{
    cursor: move;
}
#colla {
  width: 15% !important;
  float: right !important;
  margin-right:1em;
  border: 2px solid #2d8cf0;
  position: absolute;
  right:0;
  z-index: 100;
}

/* @media screen and (max-width: 1440px) {
   
}
@media screen and (max-width: 2560px){
    
} */
</style>

