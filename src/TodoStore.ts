import Vuex from 'vuex';

import StoragePlugin from './StoragePlugin'
import Todo from './Todo'
import TodoStorage from './TodoStorage'

export default function TodoStore() {
    return new Vuex.Store({
        plugins: [StoragePlugin()],

        state: {
            uid: 1,
            todos: []
        },

        mutations: {
            add(state, title: string) {
                state.todos.push({
                    id: state.uid++,
                    title: title,
                    completed: false
                })
            },

            remove(state, todo: Todo) {
                state.todos.splice(state.todos.indexOf(todo), 1)
            },

            replace(state, todos: Todo[]) {
                state.todos = todos;
                state.uid = state.todos.length
            },

            update(state, todo: Todo) {
                // Objects are references, so this is noop.
                // However it will trigger any plugin attached.
            },

            toggle(state, todo: Todo) {
                todo.completed = !todo.completed
            },

            toggleAll(state, value: boolean) {
                state.todos.forEach((todo: Todo) => {
                    todo.completed = value
                })
            },

            removeCompleted(state) {
                state.todos = this.getters.active
            }
        },

        getters: {
            all(state): Todo[] {
                return state.todos;
            },

            active(state): Todo[] {
                return state.todos.filter(todo => !todo.completed)
            },

            completed(state): Todo[] {
                return state.todos.filter(todo => todo.completed)
            }
        }
    })
}
