function TodoForm() {
    return(
        <form>
            <label htmlFor="todoTitle">Todo</label>
            <input type="text" id="todoTitle" />
            <button type="submit" disabled>
                Submit
            </button>
        </form>
    )
}

export default TodoForm;