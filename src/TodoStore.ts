import Vuex from 'vuex';

import StoragePlugin from './StoragePlugin'
import Todo from './Todo'
import TodoStorage from './TodoStorage'

const createQuery = (todos: Todo[]) => todos.map(todo => Object.freeze(Object.assign({}, todo)))
const findById = (todos: Todo[], id: number) => todos.find(todo => todo.id === id)

export default function TodoStore() {
    return new Vuex.Store({
        plugins: [StoragePlugin()],

        state: {
            uid: 1,
            todos: <Todo[]>[],
            query: <Todo[]>[],
        },

        mutations: {
            add(state, title: string) {
                state.todos.push({
                    id: state.uid++,
                    title: title,
                    completed: false,
                })

                state.query = createQuery(state.todos)
            },

            remove(state, todo: Todo) {
                state.todos.splice(state.todos.indexOf(todo), 1)

                state.query = createQuery(state.todos)
            },

            replace(state, todos: Todo[]) {
                state.todos = todos
                state.uid = state.todos.length

                state.query = createQuery(state.todos)
            },

            update(state, payload: { todo: Todo, title: string }) {
                const entry = findById(state.todos, payload.todo.id)

                entry.title = payload.title

                state.query = createQuery(state.todos)
            },

            toggle(state, todo: Todo) {
                const entry = findById(state.todos, todo.id)

                entry.completed = !todo.completed

                state.query = createQuery(state.todos)
            },

            toggleAll(state, value: boolean) {
                state.todos.forEach(todo => todo.completed = value)

                state.query = createQuery(state.todos)
            },

            removeCompleted(state) {
                state.todos = state.todos.filter(todo => !todo.completed)

                state.query = createQuery(state.todos)
            }
        },

        getters: {
            all(state): Todo[] {
                return state.query
            },

            active(state, getters): Todo[] {
                return getters.all.filter(todo => !todo.completed)
            },

            completed(state, getters): Todo[] {
                return getters.all.filter(todo => todo.completed)
            },

            remaining(state, getters): number {
                return getters.active.length
            }
        }
    })
}
