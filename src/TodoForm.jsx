import {useRef} from "react"

function TodoForm({onAddTodo}) {
    const inputRef = useRef();

    function handleAddTodo(event) {
     
        event.preventDefault();


    // console.log("Event object:", event);
    // console.log("Event target:", event.target);
    // console.log("Input value:", event.target.todoTitle.value);

    const todoTitle = event.target.todoTitle.value.trim()

    if(todoTitle){
      onAddTodo(todoTitle)  
      event.target.reset(); // clears input
      inputRef.current.focus(); // focuses input
    }
}

    return(
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input ref={inputRef} type="text" name ="todoTitle" id="todoTitle" placeholder={"todo text"} required/>
            <button  type="submit" >
                Add Todo
            </button>
        </form>
    )
}

export default TodoForm;