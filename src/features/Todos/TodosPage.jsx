  
  import {useState, useEffect} from "react"
  import TodoList from "../TodoList/TodoList.jsx"
  import TodoForm from "./TodoForm.jsx"

  export default function TodosPage({token}){
    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState(""); 
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);


    useEffect(() => {
        async function fetchTodos(){
            setIsTodoListLoading(true)
            try{
                const response = await fetch("/api/tasks",{
                    method: "GET",
                    headers: {"X-CSRF-TOKEN" : token}, //header set to the token prop
                    credentials: 'include', //send cookies with every request
                })
                const data = await response.json()
                if (response.ok) {
                    setTodoList(data.tasks)} //data.tasks is array
                else if (response.status ===401){
                        throw new Error("unauthorized") // throw! catch will handle it
                    }
                else {
                    throw new Error("something went wrong")
                }
              
            }catch(error){
                setError(error.message)
            }finally{
                setIsTodoListLoading(false)
            }
        } if(token) {
            fetchTodos()
        }
    },[token])//The useEffect hook runs when the component mounts and whenever the token changes. This ensures we fetch fresh data when a user logs in.
  async function addTodo(todoTitle) {
      const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false
    }

    setTodoList(previous => ([newTodo, ...previous]))  // ← FIRST! optimistic(UI first)
    try{
    const response = await fetch("/api/tasks", { // ← SECOND! background (server second)
        method: "POST",
        body: JSON.stringify({title: todoTitle, isCompleted: false }),
        headers: {"Content-Type": "application/json", "X-CSRF-TOKEN":token},
        credentials: 'include'
    })
    const data = await response.json()
    //response.ok = got response and good news (server said yes)
    if(response.ok){
    // replace temp todo with real todo from server
    setTodoList(previous => previous.map(todo=>
        todo.id === newTodo.id ? data : todo)
    )
    //!response.ok = got response but bad news (server said no) ✗
    }else if (!response.ok) {
        // remove failed todo
        setTodoList(previous => previous.filter(todo => 
        todo.id !== newTodo.id))
        setError("failed to ad todo")
    }
    // catch runs when the request never reaches the server
    //network problem! connection failed completely
    }catch(error){
        // remove failed todo
        setTodoList(previous => previous.filter(todo => 
        todo.id !== newTodo.id))
        setError(error.message)
  }
}
   
  async function completeTodo(id) {
    const originalTodo = todoList.find(todo=> todo.id === id)// original todo
     setTodoList(previous => previous.map(todo=>todo.id === id ? {...todo, isCompleted: true} : todo))
    //if todo.id===id,display matched id and change isCompleted to true
    //else return unchanged todo

// after clicking checkbox-->
// click checkbox
//       ↓
// onCompleteTodo(todo.id)
//       ↓
// { ...todo, isCompleted: true }
//       ↓
// filter(!todo.isCompleted) → true becomes false
//       ↓
// hidden from list ✅
try{
const response = await fetch(`/api/tasks/${id}`, {
    method: "PATCH", 
    body: JSON.stringify({isCompleted: true}),
    headers: {"Content-Type": "application/json", "X-CSRF-TOKEN":token},
    credentials:'include'
    })
   if(!response.ok){//if  server fails → rollback(back to original) with .map
    //map each of the todos, if todo.id(1)===id(1), replace todo(1) with originalTodo, else, keep todo
    //todo.id(1) === id(1) → replace with originalTodo ✓
    // todo.id(2) === id(1) → keep same ✓
    //example--
        // 1. original
        // { id: 1, isCompleted: false }
        // // 2. optimistic update
        // { id: 1, isCompleted: true }  // immediately shows checked
        // // 3. server fails!
        // // 4. rollback!
        // { id: 1, isCompleted: false }  // back to original!
    setTodoList(previous => previous.map(todo=>todo.id ===id ? originalTodo: todo))
    throw new Error("something went wrong")
   }
}catch(error){
    setTodoList(previous=>previous.map(todo=>todo.id === id ? originalTodo : todo))
    setError(error.message)

}
  
  }
  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(todo=>todo.id === editedTodo.id) //original todo
    setTodoList(previous => previous.map(todo => todo.id === editedTodo.id ? editedTodo : todo))  // optimistic - apply edited todo immediately

    // const updatedTodos = todoList.map(todo => {
    //   if (todo.id === editedTodo.id) {
    //     return editedTodo // match → return new object with editedTodo
    //   }
    //     return todo //no match → return unchanged

    try{ const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: "PATCH",
        body: JSON.stringify({title: editedTodo.title, isCompleted: editedTodo.isCompleted}),
        headers: {"Content-Type": "application/json", "X-CSRF-TOKEN" :token},
        credentials: 'include'
    })
    if(!response.ok) {
        setTodoList(previous => previous.map(todo => todo.id === editedTodo.id ? originalTodo:todo))
        setError("something went wrong")
    }
    }catch(error){
        setTodoList(previous=>previous.map(todo=>todo.id === editedTodo.id ? originalTodo : todo))
        setError(error.message)
    }
    }
        // setTodoList(updatedTodos) //update state(saved result of map)


        return(
            <>
            {error && (
                <div>
                <p>{error}</p>
                <button onClick={()=> setError("")}>Clear error</button>
                </div>
                )}
                {isTodoListLoading && <p>Loading</p>}
                    {/* // default
                    isTodoListLoading = false
                    {false && <p>Loading...</p>}  // → nothing displays

                    when it clicks default false becomes true

                    // fetchTodos starts
                    setIsTodoListLoading(true)
                    {true && <p>Loading...</p>}   // → "Loading..." displays! ✓ */}
            <TodoForm onAddTodo={addTodo} />
            <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
            </>
        )
    }


// Optimistic = UI first, server second 🚀
// Pessimistic = server first, UI second 🐢


// Optimistic (fast):
// click Add
// → todo appears instantly! 🚀
// → server confirms in background

// Pessimistic (slow):
// click Add
// → waiting for server... ⏳
// → server responds (1-2 seconds)
// → todo appears on screen