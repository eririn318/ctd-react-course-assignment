import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import isValidTodoTitle from "../../utils/todoValidation.js";
import { sanitizeInput } from "../../utils/sanitize.js";

export default function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false); // two modes based on isEditing state
  // isEditing = false → shows checkbox + title
  // isEditing = true  → shows text input for editing
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  function handleCancel() {
    setWorkingTitle(todo.title); //reset to original title
    setIsEditing(false); //back to view mode (hide input)
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    if (!isEditing) return;
    event.preventDefault();
    const trimmedTitle = workingTitle.trim();
    if (!isValidTodoTitle(trimmedTitle)) return;

    const cleanTitle = sanitizeInput(trimmedTitle); //sanitize user input
    onUpdateTodo({ ...todo, title: cleanTitle }); //copy todo and override title with trimmedTitle
    // ex:todo = { id:1, title:"Buy milk", isCompleted:false }
    // workingTitle = "Buy bread"

    // { ...todo, title: workingTitle }
    // = {
    //     id: 1,              // ✅ copied from todo
    //     title: "Buy bread", // ✅ overridden with workingTitle
    //     isCompleted: false  // ✅ copied from todo
    //   }

    setIsEditing(false);
  }
  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            {/* // EDIT mode/ shows input with current title
              // user can edit it */}
               <div className="flex items-center gap-1">
            <TextInputWithLabel
              maxLength={20}
              value={workingTitle} // displays state (connects to state)
              // value without onChange = frozen input ❌ /value={todo.tile} is connect to app.jsx not changeable, workingTitle -> onChange={handleEdit} changeable to user input
              // value + onChange       = working input ✅
              onChange={handleEdit} // updates state
               className="w-24 sm:w-auto"
            />

            <button
              className="h-9 px-2 sm:px-3 text-xs font-bold ml-5 text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-colors cursor-pointer"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="h-9 px-2 sm:px-3 text-xs font-bold ml-1 text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 rounded-xl shadow-sm transition-colors cursor-pointer"
              type="button"
              onClick={handleUpdate}
              disabled={!isValidTodoTitle(workingTitle)}
            >
              Update
            </button>
            {/* Pass workingTitle to isValidTodoTitle to disable Save button when input is empty!  */}
            {/* workingTitle = "Buy milk" → isValid = true  → !true = false  → enabled ✅
                workingTitle = ""         → isValid = false → !false = true  → disabled ✅
                workingTitle = "  "       → isValid = false → !false = true  → disabled ✅ */}
                </div>
          </>
        ) : (
          <>
            {/* connects label to checkbox */}
            <label htmlFor={`checkbox${todo.id}`}> </label>
            {/* VIEW mode/checkbox + title */}
            <input
              type="checkbox"
              id={`checkbox${todo.id}`} // unique id
              checked={todo.isCompleted} // controls checkbox->
              // todo.isCompleted = false → checkbox is unchecked ☐
              // todo.isCompleted = true  → checkbox is checked   ☑
              onChange={() => onCompleteTodo(todo.id)} //complete THIS specific todo-->ex: completeTodo(2) → finds todo where todo.id === 2 → marks it complete
            />

            {/* click title → switches to edit mode */}
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}

{
  /* <input type="checkbox" checked={todo.isCompleted} />  // ✅ checkbox
<input type="text"     value={workingTodoTitle} />     // ✅ text input */
}

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
