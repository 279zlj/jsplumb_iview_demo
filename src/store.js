import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let obj = []
let globalset = []
let filename = []
let loginname = ''
let temdata = []
let parms = {}

try {
    if (localStorage.obj)
        obj = JSON.parse(localStorage.obj)
    if (localStorage.globalset)
        globalset = JSON.parse(localStorage.globalset)
    if (localStorage.loginname)
        loginname = JSON.parse(localStorage.loginname)
    if (localStorage.temdata)
        temdata = JSON.parse(localStorage.temdata)
    if (localStorage.parms)
        parms = JSON.parse(localStorage.parms)
} catch (e) {

}
export default new Vuex.Store({
    state: {
        obj: obj,
        globalset: globalset,
        loginname: loginname,
        temdata: temdata,
        parms: parms
    },
    mutations: {
        detail(state, msg) {
            state.obj = msg.obj
            localStorage.obj = JSON.stringify(msg.obj)
        },
        globaldata(state, msg) {
            state.globalset = msg.globalset
            localStorage.globalset = JSON.stringify(msg.globalset)
        },
        login(state, msg) {
            state.loginname = msg.loginname
            localStorage.loginname = JSON.stringify(msg.loginname)
        },
        savetemp(state, msg) {
            state.temdata = msg.temdata
            localStorage.temdata = JSON.stringify(msg.temdata)
        },
        saveparm(state, msg) {
            state.parms = msg.parms
            localStorage.parms = JSON.stringify(msg.parms)
        }
    },
    actions: {

    }
})