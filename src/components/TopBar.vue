<template>
      <Row id="bar">
        <Col :xs='3' :sm='3' :md='3' :lg='2' :xxl='2'>
          <router-link :to="{name: 'index'}"><img src="../assets/logo.png" class="image"></img></router-link>
        </Col>
        <Col :xs='{span:3, offset:18}' :sm='{span:3, offset:18}' :md='{span:2, offset:19}' :lg='{span:2, offset:19}' :xxl='{span:2, offset:19}' style="text-align:right">
            <Button icon='md-person' size='default' shape="circle"></Button>
            <!-- <span> -->
            <Dropdown>
                <a href="javascript:void(0)" class='user'>{{username}}<Icon type="ios-arrow-down"></Icon></a>
                <DropdownMenu slot="list">
                    <router-link :to="{name:'user'}" style="color:gray" v-if="perm == 'administrators'"><DropdownItem>用户管理</DropdownItem></router-link>
                    <router-link :to="{name:'person'}" style="color:gray"><DropdownItem>个人中心</DropdownItem></router-link>
                    <router-link :to="{name:'server'}" style="color:gray"><DropdownItem>服务器信息</DropdownItem></router-link>
                    <router-link :to="{name:'task'}" style="color:gray"><DropdownItem>任务历史</DropdownItem></router-link>  
                    <span @click="outlogin=true" style="color:gray"><DropdownItem>退出</DropdownItem></span>
                                      
                </DropdownMenu>
            </Dropdown>
            <!-- </span> -->
        </Col>
        <Modal v-model="outlogin" title="提示" @on-ok='out()' @on-cancel="outlogin = false">
            <p>退出登录？</p>
        </Modal>
      </Row>
</template>
<script>
export default {
    name:'TopBar',
    data(){
        return{
            username:sessionStorage.getItem('username'),
            outlogin:false,
            perm:localStorage.getItem('perm')
        }
    },
    mounted(){
    },
    methods:{
        out(){
            this.$router.push({path: '/'})
        }
    }
}
</script>
<style>
    #all{
        background-color: #2F3336;
    }
    #bar{
        width:100%;
    }
    .user{
        color:white ;
        font-size:1.3em;
        margin: .2em .4em;
        line-height: 2em;
    }
    .image{
        margin:.8em 10px;
    }
</style>

