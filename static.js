const todosUl = document.querySelector('.todos')
const input = document.querySelector('#add')
const saveBtn = document.querySelector('#save')

const todos = ['play piano', 'write some code', 'swim']

window.addEventListener('DOMContentLoaded', () =>{
        //show todos
    todos.forEach( todo => {
        let li = document.createElement('li');
        li.textContent =  todo;
        todosUl.appendChild(li)
        //delete todos
        li.addEventListener('dblclick', () => {
            todosUl.removeChild(li)
        })
    })

    const addTodos = e => {
    e.preventDefault();

    let li = document.createElement('li');
    li.textContent =  input.value;
    todos.push(input.value)
    todosUl.appendChild(li);
    input.value = '';
}
saveBtn.addEventListener('click', addTodos)
})