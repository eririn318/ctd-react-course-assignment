// import {useRef, useState} from "react"
import {useState} from "react"
function TodoForm({onAddTodo}) {
    // const inputRef = useRef();
    const [workingTodoTitle, setWorkingTodoTitle] = useState("")


    function handleAddTodo(event) {
     
        event.preventDefault();

    // const todoTitle = event.target.todoTitle.value.trim()

    if(workingTodoTitle){
      onAddTodo(workingTodoTitle)  
    //   event.target.reset(); // clears input
      setWorkingTodoTitle("")
    //   inputRef.current.focus(); // focuses input
    }
}
    return(
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input 
            // ref={inputRef} 
            type="text" 
            name ="todoTitle" 
            id="todoTitle" 
            placeholder={"Todo text"} 
            value={workingTodoTitle} //// controlled — React controls what shows--displays state in input/value ties the input box to React state — whatever is in state is what shows in the input box. This is called a controlled component. 
            onChange={(event) => setWorkingTodoTitle(event.target.value)} //updates state on user's input type
            required/>
            <button  
            type="submit" 
            disabled={!workingTodoTitle.trim()}
            >
                Add Todo
            </button>
        </form>
    )
}

export default TodoForm;