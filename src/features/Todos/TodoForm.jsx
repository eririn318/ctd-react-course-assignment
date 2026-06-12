// import {useRef, useState} from "react"
import {useState, useRef} from "react"
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx"
import isValidTodoTitle from "../../utils/todoValidation.js"

function TodoForm({onAddTodo}) {

    const inputRef = useRef();
    const [workingTodoTitle, setWorkingTodoTitle] = useState("")



    function handleAddTodo(event) {
     
        event.preventDefault();

    // const todoTitle = event.target.todoTitle.value.trim()

    if(workingTodoTitle){
      onAddTodo(workingTodoTitle)  
    //   event.target.reset(); // clears input
      setWorkingTodoTitle("")
      inputRef.current.focus(); // focuses input
    // .current is where React stores the DOM element after you connect it with ref={inputRef}
    }
}

    return(
        <form onSubmit={handleAddTodo} className="w-full flex flex-col sm:flex-row gap-3">
            <TextInputWithLabel   ref={inputRef} value={workingTodoTitle}  onChange={(event) => setWorkingTodoTitle(event.target.value)} elementId="todoTitle" labelText="Todo"  />
            
            {/* <label htmlFor="todoTitle">Todo</label>
            <input 
            // ref={inputRef} 
            type="text" 
            name ="todoTitle" 
            id="todoTitle" 
            placeholder={"Todo text"} 
            value={workingTodoTitle} //// controlled — React controls what shows--displays state in input/value ties the input box to React state — whatever is in state is what shows in the input box. This is called a controlled component. 
            onChange={(event) => setWorkingTodoTitle(event.target.value)} //updates state on user's input type
            required/> */}
            <button  
            type="submit" 
            className="h-9 px-5 font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 dynamic-touch-target"
            disabled={!isValidTodoTitle(workingTodoTitle)}
            >
                Add Todo
            </button>
        </form>
    )
}

export default TodoForm;