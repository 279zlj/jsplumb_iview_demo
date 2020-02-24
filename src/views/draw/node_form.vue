<template>
    <Modal
            title="参数编辑"
            :mask-closable="false"
            v-model="visible"
    >
        <Form :model="node" ref="node" :rules="noderules" label-position="left" :label-width="100">
            <FormItem label="名称" >
                {{node.name}}
            </FormItem>
            <FormItem label="长度" prop="len" v-if="mtarget.indexOf('数据对比') == -1">
                <Input v-model="node.len" type="number" :value="node.len"></Input>
            </FormItem>
            <FormItem label="左端序列" prop="leftnum" v-if='mtarget.indexOf("数据对比") == -1'>
                <Input v-model="node.leftnum" ></Input>
            </FormItem>
            <FormItem label="右端序列" prop="rightnum" v-if='mtarget.indexOf("数据对比") == -1'>
                <Input v-model="node.rightnum" ></Input>
            </FormItem>
            <FormItem label="最小重叠数" prop="num"  v-if='mtarget.indexOf("数据对比") == -1'>
                <Input v-model="node.num" ></Input>
            </FormItem>
            <FormItem label="基因链" prop="gene" v-if="mtarget.indexOf('数据对比') != -1">
                <Input v-model="node.gene" ></Input>
            </FormItem>
            <FormItem label="线程数" prop="thread">
                <Input v-model="node.thread" ></Input>
            </FormItem>
        </Form>
        <span slot="footer" class="dialog-footer">
            <Button @click="nreset('node')" >重置</Button>
            <Button type="primary" @click="nodedata('node')">确定</Button>
        </span>
    </Modal>
</template>

<script>
    export default {
        data() {
            const checklength=(rule,val,callback)=>{
                if(!val){
                    callback(new Error('请输入长度'))
                }
                else
                    callback()
            }
            const checkleft=(rule,val,callback)=>{
                let reg = /^[A,T,G,C]/
                if(!val){
                    callback(new Error('请输入左端序列号'))
                }
                if(!reg.test(val)){
                    callback(new Error('开头必须为A,T,G,C'))
                }
                else
                    callback()
            }
            const checkright=(rule,val,callback)=>{
                let reg = /^[A,T,G,C]/
                if(!val){
                    callback(new Error('请输入右端序列号'))
                }
                if(!reg.test(val)){
                    callback(new Error('开头必须为A,T,G,C'))
                }
                else
                    callback()
            }
            const checknum=(rule,val,callback)=>{
                if(!val){
                    callback(new Error('请输入最小重叠数'))
                }
                else
                    callback()
            }
            const checkthread=(rule,val,callback)=>{
                if(!val){
                    callback(new Error('请输入线程数'))
                }
                else
                    callback()
            }
            const checkgene=(rule,val,callback)=>{
                if(!val){
                    callback(new Error('请输入基因链'))
                }
                else
                    callback()
            }
            return {
                visible: false,
                mtarget : '',
                nodeid:'',
                node: {
                    len:'',
                    leftnum:'',
                    rightnum:'',
                    num:'',
                    thread:'',
                    gene:''
                },
                noderules:{
                    len:[
                        {validator: checklength, trigger: 'blur'}
                    ],
                    leftnum:[
                        {validator: checkleft, trigger: 'blur'}
                    ],
                    rightnum:[
                        {validator: checkright, trigger: 'blur'}
                    ],
                    num:[
                        {validator: checknum, trigger: 'blur'}
                    ],
                    thread:[
                        {validator: checkthread, trigger: 'blur'}
                    ],
                    gene:[
                        {validator: checkgene, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            init(data, id) {
                this.mtarget = id
                this.visible = true
                data.nodeList.filter((node) => {
                    if (node.id === id) {
                        this.node = node
                        this.node.len = 100
                        this.node.leftnum = 'AGATCGGAAGAGC'
                        this.node.rightnum = 'AGATCGGAAGAGC'
                        this.node.num = 5
                        this.node.thread = 4
                        this.node.gene = 'RF'
                    }
                })
                this.nodeid = id
            },
            nodedata(name){
                this.$refs[name].validate((valid=>{
                    if(valid){
                        this.visible = false
                        this.$Notice.success({
                            title:'设置成功'
                        })
                    }
                }))
            },
            nreset(name){
                this.$refs[name].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
