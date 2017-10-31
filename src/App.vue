<template>
    <div id="app">
        <section class="todoapp">
            <header class="header">
                <h1>todos</h1>
                <input class="new-todo"
                autofocus autocomplete="off"
                placeholder="What needs to be done?"
                v-model="newTodo"
                @keyup.enter="addTodo">
            </header>

            <section class="main" v-show="todos.length" v-cloak>
                <input class="toggle-all" type="checkbox" v-model="allDone">
                <ul class="todo-list">
                    <li v-for="todo in filteredTodos"
                        class="todo"
                        :key="todo.id"
                        :class="{ completed: todo.completed, editing: todo == editedTodo }">

                        <div class="view">
                            <input class="toggle" type="checkbox" @change="toggleTodo(todo)" :checked="todo.completed">
                            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
                            <button class="destroy" @click="removeTodo(todo)"></button>
                        </div>

                        <input class="edit" type="text"
                        v-model="editedTitle"
                        v-todo-focus="todo == editedTodo"
                        @blur="doneEdit(todo)"
                        @keyup.enter="doneEdit(todo)"
                        @keyup.esc="resetEditor()">
                    </li>
                </ul>
            </section>

            <footer class="footer" v-show="todos.length" v-cloak>
                <span class="todo-count"><strong>{{ remaining }}</strong> {{ remaining | pluralize }} left</span>
                <ul class="filters">
                    <li><a href="#/all" :class="{ selected: visibility == 'all' }">All</a></li>
                    <li><a href="#/active" :class="{ selected: visibility == 'active' }">Active</a></li>
                    <li><a href="#/completed" :class="{ selected: visibility == 'completed' }">Completed</a></li>
                </ul>
                <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">Clear completed</button>
            </footer>
        </section>

        <footer class="info">
            <p>Double-click to edit a todo</p>
            <p>Written by <a href="http://evanyou.me">Evan You</a></p>
            <p>Converted by <a href="http://toni.uebernickel.info">Toni Uebernickel</a></p>
            <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/startWith'
import 'rxjs/add/operator/shareReplay'

import Todo from './Todo'

Vue.filter('pluralize', (n: number): string =>  {
    return n === 1 ? 'item' : 'items'
})

Vue.directive('todo-focus', (el, binding) => {
    if (binding.value) {
        el.focus()
    }
})

@Component({
    name: 'app',
    subscriptions: {
        hashChange: Observable.fromEvent(window, 'hashchange')
            .map(() => window.location.hash)
            .startWith(window.location.hash)
            .shareReplay(1)
        ,
    },
})
export default class App extends Vue {
    @Getter('all') todos
    @Getter remaining

    @Mutation('toggle') toggleTodo
    @Mutation('remove') removeTodo
    @Mutation removeCompleted

    private visibility: string = 'all'

    private newTodo: string = ''

    private editedTodo: Todo|null = null
    private editedTitle: string|null = null
    private beforeEditCache: string|null = null

    get filteredTodos(): Todo[] {
        return this.$store.getters[this.visibility]
    }

    get allDone(): boolean {
        return this.remaining === 0
    }

    set allDone(value: boolean) {
        this.$store.commit('toggleAll', value)
    }

    addTodo() {
        const title = this.newTodo.trim()
        if (!title) {
            return
        }

        this.$store.commit('add', title)

        this.newTodo = ''
    }

    editTodo(todo: Todo) {
        this.beforeEditCache = todo.title
        this.editedTodo = todo
        this.editedTitle = todo.title
    }

    doneEdit(todo: Todo) {
        if (!this.editedTodo) {
            return
        }

        const title = this.editedTitle.trim()

        if (title) {
            this.$store.commit('update', { todo, title })
        } else {
            this.removeTodo(todo)
        }

        this.resetEditor()
    }

    resetEditor() {
        this.beforeEditCache = null
        this.editedTodo = null
        this.editedTitle = null
    }

    created() {
        this.$observables.hashChange.subscribe((hash: string) => {
            const visibility = hash.replace(/#\/?/, '')

            if (this.$store.getters[visibility]) {
                this.visibility = visibility
            } else {
                window.location.hash = ''

                this.visibility = 'all'
            }
        })
    }
}
</script>

<style lang="scss">
@import url('https://unpkg.com/todomvc-app-css@2.0.6/index.css');

[v-cloak] { display: none; }
</style>
