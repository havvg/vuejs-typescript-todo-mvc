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
                            <input class="toggle" type="checkbox" v-model="todo.completed">
                            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
                            <button class="destroy" @click="removeTodo(todo)"></button>
                        </div>

                        <input class="edit" type="text"
                        v-model="todo.title"
                        v-todo-focus="todo == editedTodo"
                        @blur="doneEdit(todo)"
                        @keyup.enter="doneEdit(todo)"
                        @keyup.esc="cancelEdit(todo)">
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

import Todo from './Todo'
import TodoStorage from './TodoStorage'

Vue.filter('pluralize', (n: number): string =>  {
  return n === 1 ? 'item' : 'items'
})

Vue.directive('todo-focus', (el, binding) => {
  if (binding.value) {
      el.focus()
  }
})

const filters = {
    all(todos: Todo[]): Todo[] {
        return todos
    },

    active(todos: Todo[]): Todo[] {
        return todos.filter((todo: Todo) => {
            return !todo.completed
        })
    },

    completed(todos: Todo[]): Todo[] {
        return todos.filter((todo: Todo) => {
            return todo.completed
        })
    }
}

@Component({
    name: 'app'
})
export default class App extends Vue {
    private storage: TodoStorage = new TodoStorage()

    private todos: Todo[] = this.storage.fetch()
    private visibility: string = 'all'

    private newTodo: string = ''
    private editedTodo: Todo|null = null
    private beforeEditCache: string|null = null

    constructor() {
        super()

        window.addEventListener('hashchange', this.onHashChange)
    }

    get filteredTodos(): Todo[] {
        return filters[this.visibility](this.todos)
    }

    get remaining(): number {
        return filters.active(this.todos).length
    }

    get allDone(): boolean {
        return this.remaining === 0
    }

    set allDone(value: boolean) {
        this.todos.forEach((todo: Todo) => {
            todo.completed = value
        })
    }

    addTodo() {
        const title = this.newTodo && this.newTodo.trim()
        if (!title) {
            return
        }

        this.todos.push({
            id: this.storage.nextUid(),
            title: title,
            completed: false
        })

        this.newTodo = ''
    }

    removeTodo(todo) {
        this.todos.splice(this.todos.indexOf(todo), 1)
    }

    editTodo(todo: Todo) {
        this.beforeEditCache = todo.title
        this.editedTodo = todo
    }

    doneEdit(todo) {
        if (!this.editedTodo) {
            return
        }

        this.editedTodo = null

        todo.title = todo.title.trim()
        if (!todo.title) {
            this.removeTodo(todo)
        }
    }

    cancelEdit(todo) {
        this.editedTodo = null
        todo.title = this.beforeEditCache
    }

    removeCompleted() {
        this.todos = filters.active(this.todos)
    }

    @Watch('todos', { deep: true})
    onTodosChange() {
        this.storage.save(this.todos)
    }

    onHashChange() {
        const visibility = window.location.hash.replace(/#\/?/, '')

        if (filters[visibility]) {
            this.visibility = visibility
        } else {
            window.location.hash = ''

            this.visibility = 'all'
        }
    }
}
</script>

<style lang="scss">
@import url('https://unpkg.com/todomvc-app-css@2.0.6/index.css');

[v-cloak] { display: none; }
</style>
