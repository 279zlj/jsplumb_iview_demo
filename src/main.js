import Vue from 'vue'
import iView from 'iview'
import App from './App.vue'
import Vuex from 'vuex'
import router from './router'
import store from './store'
import axios from 'axios'

import 'iview/dist/styles/iview.css'


Vue.use(iView)
Vue.use(Vuex)
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.prototype.host = 'http://192.168.5.185:8000'
Vue.prototype.contains = function(array, obj) { 
    var i = array.length; 
    for (let a = 0; a < i; a++) {
        if (array[a] == obj) {
            return a;
        }
    }
}

new Vue({
    router,
    store,
    axios,
    render: h => h(App)
}).$mount('#app')