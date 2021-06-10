const todosUl = document.querySelector('.todos')
const input = document.querySelector('#add')
const saveBtn = document.querySelector('#save')

let db

const connectIDB = () => {

    const request = window.indexedDB.open('todos_db', 1)

    request.addEventListener('error', e => {
		console.log(e.target.errorCode)
    })
    request.addEventListener('success', () => {
        db = request.result
        getTodos()
    })
    request.addEventListener('upgradeneeded', e => {
        db = e.target.result

        const objectStore = db.createObjectStore('todos_data', { keyPath: 'id', autoIncrement: true })
        objectStore.createIndex('content', 'content', { unique: false })
    })
}

const addTodos = e => {

    e.preventDefault()

    const transaction = db.transaction(['todos_data'], 'readwrite')
    const objectStore = transaction.objectStore('todos_data')
    const newRecord = {content: input.value}
    const request = objectStore.add(newRecord)

    request.addEventListener('success', () => {
        input.value = ''
    })
    transaction.addEventListener('complete', () => {
        getTodos()
    })
    transaction.addEventListener('error', () => {
        return;
    })
}

const getTodos = () => {

    while(todosUl.firstChild){
        todosUl.removeChild(todosUl.firstChild)
    }
    const objectStore = db.transaction('todos_data').objectStore('todos_data');

    objectStore.openCursor().addEventListener('success', e => {
        const cursor = e.target.result

        if(cursor){
            const list = document.createElement('li')
            list.setAttribute('todo-id', cursor.value.id)
            list.textContent = cursor.value.content
            todosUl.appendChild(list)

            list.ondblclick = deleteTodos

            cursor.continue()
        }
    })
}

const deleteTodos = e => {

    const transaction = db.transaction(['todos_data'], 'readwrite')
    const objectStore = transaction.objectStore('todos_data')
    const todoId = Number(e.target.getAttribute('todo-id'))
    objectStore.delete(todoId)

    transaction.addEventListener('complete', () => {
        if(!todosUl.firstChild){
            const message = document.createElement('li')
            message.textContent = 'No todo exist'
            todosUl.appendChild(message)
        }
        e.target.parentNode.removeChild(e.target)
    })
}

//main listeners
saveBtn.addEventListener('click', addTodos)
window.addEventListener('load', connectIDB)
