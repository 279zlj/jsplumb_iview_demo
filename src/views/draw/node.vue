<template>

    <div
            ref="node"
            :style="flowNodeContainer"
            @mouseenter="showDelete"
            @mouseleave="hideDelete"
            @mouseup="changeNodeSite"
    >
        <div class="flow-node-header" v-if='node.name == "数据过滤" || node.name == "数据对比"'>
            <!-- <img src="@/assets/node-img.png" class="flow-node-drag">-->
            <Icon :type="nodeClass" style="color:white;padding:.5em"></Icon><span style="color:white;font-size:1.2em;line-height:2.3em"><b>{{node.name}}</b></span>
            <div style="position: absolute;top: 0px;right: 0px;line-height: 25px" v-show="mouseEnter">
                <Button shape='circle' icon="md-alert" @click="Nodedetail" size='small' ghost style="margin:.3em"></Button>
                <Button shape='circle' icon="ios-create" @click="editNode" size='small' ghost style="margin:.3em"></Button>
                <Button shape='circle' icon="md-trash" @click="deleteNode" size="small" style="margin:.3em" ghost></Button>
            </div>
        </div>
        <div class="flow-node-drag flow-node-body" v-if='node.name == "数据过滤" || node.name == "数据对比"'>
            <p><b>状态：
                <Tag type='dot' color='success' v-show='node.status == "准备状态"' >{{node.status}}</Tag>
                <Icon type="ios-time" size=18 class="demo-spin-icon-load" v-show='node.status == "正在运行"' > {{node.status}}</Icon>
                </b></p>
            <p><b>耗时：19:23:35</b></p>
            <Row>
                <Col span="10"><b>CPU使用率：</b></Col><Col span="14"><Progress :percent="25" status="active" style="display:inline"/></Col>
            </Row>
            <Row>
                <Col span="10"><b>内存使用率：</b></Col><Col span="14"><Progress :percent="45" status="active" style="display:inline"/></Col>
            </Row>
        </div>
        <div v-if='node.name == "开始"' class="startbox" style="border:2px solid #2D8CF0 ;border-radius: .5em;">
            <Row>
                <Col span="16" style='background-color:white'>
                    <Icon :type="nodeClass" style="color:#2D8CF0;padding:1em;"></Icon><span style="font-size:1.2em;line-height:2.7em"><b>{{node.name}}</b></span>
                </Col>
                <Col span="8" style="background-color:#2D8CF0" class="flow-node-drag">
                    <Button shape='circle' icon="md-trash" @click="deleteNode" size="small" style="margin:.6em;background-color:#2D8CF0;" ghost></Button>
                </Col>
            </Row>
        </div>
        <div v-if='node.name == "结束"' class="startbox" style="border:2px solid #ed4014 ;border-radius: .5em;">
            <Row>
                <Col span="16" style='background-color:white'>
                    <Icon :type="nodeClass" style="color:#ed4014;padding:.5em;margin-left:1em"></Icon><span style="font-size:1.2em;line-height:2.7em"><b>{{node.name}}</b></span>
                </Col>
                <Col span="8" style="background-color:#ed4014" >
                    <Button shape='circle' icon="md-trash" @click="deleteNode" size="small" style="margin:.6em;background-color:#ed4014"  ghost></Button>
                </Col>
            </Row>
        </div>
    </div>

</template>

<script>
    export default {
        props: {
            node: Object
        },
        data() {
            return {
                // 控制节点操作显示
                mouseEnter: false,
                nowheader:'flow-node-header2',
                finishheader:'flow-node-header',
                nowbody:'flow-node-body2',
                finishbody:'flow-node-body'
            }
        },
        computed: {
            // 节点容器样式
            flowNodeContainer: {
                get() {
                    return {
                        position: 'absolute',
                        top: this.node.top,
                        left: this.node.left,
                        boxShadow: this.mouseEnter ? '#66a6e0 0px 0px 12px 0px' : '',
                        backgroundColor: 'transparent'
                    }
                }
            },
            nodeClass() {
                var nodeclass = {}
                // nodeclass[this.node.icon] = true
                // console.log(nodeclass)
                nodeclass= this.node.icon
                // nodeclass['flow-node-drag'] = true
                return nodeclass
            }
        },
        methods: {
            // 删除节点
            deleteNode() {
                this.$emit('deleteNode', this.node.name , this.node.id)
            },
            // 编辑节点
            editNode() {
                this.$emit('editNode', this.node.id)
            },
            Nodedetail(){
                this.$emit('detailNode', this.node.id,this.node.detail)
            },
            // 鼠标进入
            showDelete() {
                this.mouseEnter = true
            },
            // 鼠标离开
            hideDelete() {
                this.mouseEnter = false
            },
            // 鼠标移动后抬起
            changeNodeSite() {
                this.$emit('changeNodeSite', {
                    nodeId: this.node.id,
                    left: this.$refs.node.style.left,
                    top: this.$refs.node.style.top,
                })
            }
        }
    }
</script>

<style>

    .flow-node-header {
        background-color: #808695;
        width: 220px;
        height: 2.5em;
        cursor: pointer;
        border-top-left-radius: .5em;
        border-top-right-radius: .5em;
    }
    .flow-node-header2 {
        background-color: #19be6b;
        width: 220px;
        height: 2.5em;
        cursor: pointer;
        border-top-left-radius: .5em;
        border-top-right-radius: .5em;
    }
    .flow-node-header a {
        text-decoration: none;
        line-height: 25px;
        vertical-align: middle;
        color:white !important;
    }

    .flow-node-header a img {
        line-height: 25px;
        vertical-align: middle;
        margin-bottom: 5px;
    }

    .flow-node-body {
        /*background-color: beige;*/
        background-color: white;
        padding:0 1em 1em 1em;
        width: 220px;
        cursor: pointer;
        height: 10.5em;
        line-height: 2em;
        border-bottom-left-radius: .5em;
        border-bottom-right-radius: .5em;
        border:2px solid #808695;
    }
    .flow-node-body2 {
        /*background-color: beige;*/
        background-color: white;
        padding: 0 1em;
        width: 220px;
        cursor: pointer;
        height: 10em;
        line-height: 2em;
        border-bottom-left-radius: .5em;
        border-bottom-right-radius: .5em;
        border:2px solid #19be6b;
    }
    .startbox{
        width: 120px;
        
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        0% { transform: rotate(0deg);}
        25% { transform: rotate(90deg);}
        50%  { transform: rotate(180deg);}
        75% { transform: rotate(270deg);}
        100%   { transform: rotate(360deg);}
    }
</style>
