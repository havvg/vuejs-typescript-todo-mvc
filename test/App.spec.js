import Vue from 'vue'
import Vuex from 'vuex';
import VueRx from 'vue-rx'
import { Observable } from 'rxjs/Observable'

import { shallowMount } from '@vue/test-utils'

import App from '../src/App'
import TodoStore from '../src/TodoStore'

Vue.use(Vuex)
Vue.use(VueRx, {
    Observable
})

describe('ToDo App', () => {
    let cmp, store, vm

    beforeEach(() => {
        store = TodoStore()

        cmp = shallowMount(App, {
            store: store,
        })

        vm = cmp.vm
    })

    it('starts without any todo', () => {
        expect(vm.todos).toEqual([])

        expect(cmp.find('.todo-list').exists()).toBe(true)
        expect(cmp.find('.todo-list').isEmpty()).toBe(true)
    })
})
