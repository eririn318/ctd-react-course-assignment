import {useState} from "react"
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx"

export default function TodoListItem({todo, onCompleteTodo}){

    const [isEditing, setIsEditing ] = useState(false)// two modes based on isEditing state
// isEditing = false → shows checkbox + title
// isEditing = true  → shows text input for editing

      return (
        <li>
          <form>
          {isEditing 
          ? (<TextInputWithLabel value={todo.title} /> )// EDIT mode/ shows input with current title
// user can edit it
          : (
            <>
            {/* connects label to checkbox */}
          <label htmlFor={`checkbox${todo.id}`}> 
            {/* VIEW mode/checkbox + title */}
            <input 
              type="checkbox" 
              id={`checkbox${todo.id}`} // unique id
              checked={todo.isCompleted} // controls checkbox->
              // todo.isCompleted = false → checkbox is unchecked ☐
              // todo.isCompleted = true  → checkbox is checked   ☑
              onChange = {()=>onCompleteTodo(todo.id)}//complete THIS specific todo-->ex: completeTodo(2) → finds todo where todo.id === 2 → marks it complete
            >
            </input>
          </label>
         
        {/* click title → switches to edit mode */}
        <span onClick={() => setIsEditing(true)}>{todo.title}</span>
     
         </>
         )}
         </form>
         </li>
  )}



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
   