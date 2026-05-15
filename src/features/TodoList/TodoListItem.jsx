export default function TodoListItem({todo, onCompleteTodo}){
      return (
        <li>
          <input 
          type="checkbox" 
          checked={todo.isCompleted} // controls checkbox->
          // todo.isCompleted = false → checkbox is unchecked ☐
          // todo.isCompleted = true  → checkbox is checked   ☑
          onChange = {()=>onCompleteTodo(todo.id)}//complete THIS specific todo-->ex: completeTodo(2) → finds todo where todo.id === 2 → marks it complete
          >
          </input>
         {todo.title}
        </li>
  );
}



{/* <input type="checkbox" checked={todo.isCompleted} />  // ✅ checkbox
<input type="text"     value={workingTodoTitle} />     // ✅ text input */}

// type="text"     → value={...}    
// type="checkbox" → checked={...}  
// type="radio"    → checked={...}


// value={workingTodoTitle}   // controls text input ✅
// checked={todo.isCompleted} // controls checkbox ✅

// // text input
// value={workingTodoTitle}                         // displays state
// onChange={(e) => setWorkingTodoTitle(e.target.value)} // updates state

// // checkbox
// checked={todo.isCompleted}                       // displays state
// onChange={() => onCompleteTodo(todo.id)}         // updates state