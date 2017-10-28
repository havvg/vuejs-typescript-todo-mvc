import Todo from './Todo'

const STORAGE_KEY = 'todos-vuejs-2.0'

export default class TodoStorage {
    private uid: number = 1

    nextUid(): number {
        return this.uid++;
    }

    fetch(): Todo[] {
        const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

        todos.forEach((todo, index) => {
          todo.id = index
        })

        this.uid = todos.length

        return todos
    }

    save(todos: Todo[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}
