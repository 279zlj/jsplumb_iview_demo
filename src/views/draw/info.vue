<template>
    <Modal 
            title="流程数据信息"
            v-model="dialogVisible"
            width="70%"
    >
        <codemirror
                :value="flowData"
                :options="options"
                class="code"
        ></codemirror>

        <span slot="footer" >
  </span>
    </Modal>
</template>

<script>
    import {codemirror} from 'vue-codemirror'

    require("codemirror/mode/javascript/javascript.js")

    export default {
        props: {
            data: Object,
        },
        data() {
            return {
                dialogVisible: false,
                options: {
                    mode: {name: "javascript", json: true},
                    lineNumbers: true
                }
            }
        },
        components: {
            codemirror
        },
        computed: {
            flowData() {
                return JSON.stringify(this.data, null, 4).toString()
            }
        },
        methods: {
            init() {
                this.dialogVisible = true
            }
        }
    }
</script>

<style scoped>

</style>
