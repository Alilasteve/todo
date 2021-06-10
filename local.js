const todosUl = document.querySelector('.todos')
const input = document.querySelector('#add')
const saveBtn = document.querySelector('#save')

const getTodos = () => {
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    return todos;
}

const saveTodos = inputData => {
    const todos = getTodos()
    todos.push(inputData)
    localStorage.setItem('todos', JSON.stringify(todos))
}

const addTodos = e => {
    e.preventDefault();

    let li = document.createElement('li');
    li.textContent =  input.value;
    saveTodos(input.value)
    todosUl.appendChild(li);
    input.value = '';
}

const deleteTodos = (todos, e) => {
    const targetLi = todos.indexOf(e.target.textContent)
    todos.splice(targetLi, 1)
    localStorage.setItem('todos', JSON.stringify(todos))
}

saveBtn.addEventListener('click', addTodos)

window.addEventListener('DOMContentLoaded', () => {
    const todos = getTodos()
        //show todos
    todos.forEach( todo => {
        let li = document.createElement('li');
        li.textContent =  todo;
        todosUl.appendChild(li)
        //delete todos
        li.addEventListener('dblclick', e => {
            deleteTodos(todos, e)
            todosUl.removeChild(li)
        })
    })
})