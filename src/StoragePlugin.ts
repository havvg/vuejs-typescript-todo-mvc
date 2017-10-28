import TodoStorage from './TodoStorage'

export default function StoragePlugin (storage?: TodoStorage) {
    if (!storage) {
        storage = new TodoStorage()
    }

    return store => {
        store.commit('replace', storage.fetch())

        store.subscribe((mutation: { type: string, payload: any }, state) => {
            storage.save(state.todos)
        })
    }
}
