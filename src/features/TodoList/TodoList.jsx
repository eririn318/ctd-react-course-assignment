
import TodoListItem from "./TodoListItem"
import { useMemo } from "react"
// After API → todos stay visible with ✅ checkbox, server stores state
function TodoList({ todoList , onCompleteTodo, onUpdateTodo, dataVersion, statusFilter = 'active'}) {
  const filteredTodoList = useMemo(() => {//Optimize TodoList with useMemo
    // console.log (`Recalculating filtered todos (v${dataVersion}) Status: ${statusFilter}`)
    // console.log("todoList:", todoList) 
    // console.log("filtered:", todoList.filter(todo => !todo.isCompleted)) 

    let filteredTodos;
    switch (statusFilter) {//1. "Look at the value inside this box..."
      case "completed": //2. "Does it equal 'completed'?"
        filteredTodos = todoList.filter((todo)=> todo.isCompleted)//todoList is state that get data from API
        // Run this code if YES
        break; //3. "Stop here and exit the switch!"
      case "active"://4. "Does it equal 'active'?"
    // Run this code if YES
        filteredTodos = todoList.filter((todo)=> !todo.isCompleted)//if isCompleted = false, it is active / task not done
        break;
      case "all":
      default: //5. "If it didn't match any of the above, do all todoList array"
    // Run fallback code
        filteredTodos = todoList //means you are assigning the entire, original array of todos that came from your backend API straight to filteredTodos, without filtering out a single thing.
        break;
    }

    return {
      version:dataVersion,
        // todos:todoList.filter(todo => !todo.isCompleted) //isCompleted=true/checked list will hidden = not checked box list is displayed.
      todos: filteredTodos //whatever filtered from switch case above
      }
  },[todoList, dataVersion, statusFilter])//when these things change, recalculate filteredTodoList/todoList->new todo, dataversion->dataVersion changes from 0 to 1, setFilter->"all", "active", or "completed"
// mutation happens (add/complete/update)
//         ↓
// invalidateCache() → dataVersion goes up (v1 → v2)
//         ↓
// useMemo sees dependency changed
//         ↓
// recalculates filteredTodoList
//         ↓
// UI updates with fresh data ✅

// useMemo saves the result so it doesn't recalculate every time:
// first time   → calculates filter → saves result on sticky note
// second time  → just reads sticky note → no recalculating! ⚡
//When data mutates, the sticky note is outdated → needs to recalculate:
// sticky note says: ["study", "workout"]   ← saved result
// you add new todo "cook dinner"           ← mutation!
// sticky note is now WRONG ❌
// invalidateCache() → throw away old note → recalculate ✅
// sticky note now says: ["study", "workout", "cook dinner"] ✅

const getEmptyMessage = () => { //use if filteredTodoList.todos.length === 0 //ex:You clicked the "Completed" tab, but you haven't checked off any checkboxes yet. Your filtered box is totally empty.
  switch(statusFilter){
    case "completed": 
      return 'No completed todos yet. Complete some tasks to see them here.';
    case "active":
      return 'No active todos. Add a todo above to get started.';
    case "all": 
    default:
      return 'Add todo above to get started.';
  }
}

  return (
    <>
    {/* {filteredTodoList.length === 0 && <p>Add todo above to get started</p>}   */}

    {/* &&  → shows message OR nothing, but ul always there,even empty ul ❌
     ? : → shows message OR ul, never both, never empty ul ✅ */}
  {filteredTodoList.todos.length === 0 ? (
  <p >{getEmptyMessage()}</p>) : (
  
  
    <ul >{filteredTodoList.todos.map((todo) => (//map around not checked box list
            <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/>       
      ))}
    
    </ul>
    )
    }
    </>
  );
}

export default TodoList;
//!! Before API → filter made sense, completed todos hidden
// function TodoList({ todoList , onCompleteTodo, onUpdateTodo}) {
//  const filteredTodoList = todoList.filter(todo => !todo.isCompleted)//isCompleted=true/checked list will hidden = not checked box list is displayed.

//   return (
//     <>
//     {/* {filteredTodoList.length === 0 && <p>Add todo above to get started</p>}   */}

//     {/* &&  → shows message OR nothing, but ul always there,even empty ul ❌
//      ? : → shows message OR ul, never both, never empty ul ✅ */}
//   {  filteredTodoList.length === 0 ? <p>Add todo above to get started</p> : 
  
  
//     <ul>{filteredTodoList.map((todo) => (//map around not checked box list
//             <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/>       
//       ))}
    
//     </ul>}
//     </>
//   );
// }




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