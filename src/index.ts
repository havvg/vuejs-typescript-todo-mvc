import Vue from 'vue'
import Vuex from 'vuex';
import VueRx from 'vue-rx'
import { Observable } from 'rxjs/Observable'

import App from './App.vue'
import TodoStore from './TodoStore'

Vue.use(Vuex)
Vue.use(VueRx, {
    Observable
})

new Vue({
    el: '#app',
    store: TodoStore(),
    render: h => h(App),
})
