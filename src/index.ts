import Vue from 'vue'
import Vuex from 'vuex';

import App from './App.vue'
import TodoStore from './TodoStore'

Vue.use(Vuex)

new Vue({
  el: '#app',
  store: TodoStore(),
  render: h => h(App)
})
