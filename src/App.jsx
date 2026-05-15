import "./App.css";
import {useState} from "react"
import TodoList from "./features/TodoList/TodoList.jsx";
import TodoForm from "./features/TodoForm.jsx";

function App() {
  const [todoList, setTodoList] = useState([]);

  function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false
    }

    setTodoList(previous => ([newTodo, ...previous]))

  }
   
  function completeTodo(id) {
    const newTodoList = todoList.map((todo) => {
  if (todo.id === id) 
  
    return {...todo, isCompleted: true} // after clicking checkbox-->
// click checkbox
//       ↓
// onCompleteTodo(todo.id)
//       ↓
// { ...todo, isCompleted: true }
//       ↓
// filter(!todo.isCompleted) → true becomes false
//       ↓
// hidden from list ✅

    return todo //return unchanged todo
})
  setTodoList(newTodoList)
  }
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo}/>
    </div>
  );
}

export default App;



// before click:
// isCompleted: false → !false = true  → shows in list ✅

// after click:
// isCompleted: true  → !true  = false → hidden from list ✅

// ! flips it:
// false → !false = true  → display
// true  → !true  = false → hide
// click makes it true, then ! flips it to false so filter removes it! 