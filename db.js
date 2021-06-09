const todosDiv = document.querySelector('.todos')
const contentInput = document.querySelector('#add')
const saveBtn = document.querySelector('#save')

let db

const connectIDB = () => {

    const request = window.indexedDB.open('todos_db', 1)

    request.addEventListener('error', () => {
        alert('Db cannot be opened')
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
    const newRecord = {content: contentInput.value}
    const request = objectStore.add(newRecord)

    request.addEventListener('success', () => {
        contentInput.value = ''
    })
    transaction.addEventListener('complete', () => {
        getTodos()
    })
    transaction.addEventListener('error', () => {
        return;
    })
}

const getTodos = () => {

    while(todosDiv.firstChild){
        todosDiv.removeChild(todosDiv.firstChild)
    }
    const objectStore = db.transaction('todos_data').objectStore('todos_data');

    objectStore.openCursor().addEventListener('success', e => {
        const cursor = e.target.result

        if(cursor){
            const list = document.createElement('li')
            list.setAttribute('todo-id', cursor.value.id)
            list.textContent = cursor.value.content
            todosDiv.appendChild(list)

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
        if(!todosDiv.firstChild){
            const message = document.createElement('li')
            message.textContent = 'No todo exist'
            todosDiv.appendChild(message)
        }
        e.target.parentNode.removeChild(e.target)
    })
}

//main listeners
saveBtn.addEventListener('click', addTodos)
window.addEventListener('load', connectIDB)
