
import TodoListItem from "./TodoListItem"

function TodoList({ todoList , onCompleteTodo, onUpdateTodo}) {
 const filteredTodoList = todoList.filter(todo => !todo.isCompleted)//isCompleted=true/checked list will hidden = not checked box list is displayed.

  return (
    <>
    {/* {filteredTodoList.length === 0 && <p>Add todo above to get started</p>}   */}

    {/* &&  → shows message OR nothing, but ul always there,even empty ul ❌
     ? : → shows message OR ul, never both, never empty ul ✅ */}
  {  filteredTodoList.length === 0 ? <p>Add todo above to get started</p> : 
  
  
    <ul>{filteredTodoList.map((todo) => (//map around not checked box list
            <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/>       
      ))}
    
    </ul>}
    </>
  );
}

export default TodoList;


// Step 1: NAME IT
// onComplete={completeTodo}    
// // "I'm sending completeTodo, calling it onComplete"

// Step 2: UNPACK IT
// { onComplete }               
// // "I received a function called onComplete"

// Step 3: PASS IT AGAIN
// onComplete2={onComplete}           
// // "I'm sending onComplete, calling it onComplete2"

// Step 4: UNPACK IT AGAIN
// { onComplete2 }                    
// // "I received a function called onComplete2"

// Step 5: CALL IT
// onComplete2()                      
// // finally runs the original completeTodo!


// ======= needs todo → to display/use its data =======
// <TodoListItem todo={todo} />  // ✅ TodoListItem needs title, id, isCompleted/to pass,when 
// .map((todo) => ...)  // each item gets named "todo"
//        ↓
// todo={todo}          // passed to TodoListItem
//        ↓
// function TodoListItem({ todo })  // received here
//        ↓
// todo.title, todo.id, todo.isCompleted  // used here




// // doesn't need todo → no data needed
// <TodoForm />      // ✅ no todo data needed
// <h1>Todo List</h1> // ✅ just text

// ========== list(.map) → needs key ✅ ===========
// todoList.map((todo) => (
//   <TodoListItem key={todo.id} />  // ✅ key required
// ))

// // single component → no key needed
{/* <TodoListItem />  // ✅ no key needed */}