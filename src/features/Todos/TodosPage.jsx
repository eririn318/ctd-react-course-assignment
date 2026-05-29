import { useState, useEffect, useCallback } from "react";
import TodoList from "../TodoList/TodoList.jsx";
import TodoForm from "./TodoForm.jsx";
import SortBy from "../../shared/SortBy.jsx";
import useDebounce from "../../utils/useDebounce.js";
import FilterInput from "../../shared/FilterInput.jsx";

export default function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [sortBy, setSortBy] = useState("creationDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterTerm, setFilterTerm] = useState("");
  const [dataVersion, setDataVersion] = useState(0);
  const [filterError, setFilterError] = useState("")

  const invalidateCache = useCallback(() => {
      setDataVersion((prev) => prev + 1);
      // console.log("Invalidating memo cache after todo mutation");
  }, []);

  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

  useEffect(() => {
    async function fetchTodos() {
      setIsTodoListLoading(true);

      try {
        const paramsObject = {
          sortBy,
          sortDirection,
        };


        if (debouncedFilterTerm) {
            paramsObject.find = debouncedFilterTerm  // ← sends search term to server
        }
        const params = new URLSearchParams(paramsObject)// → /api/tasks?sortBy=creationDate&sortDirection=desc&find=study


        // params become => example:sortBy=title&sortDirection=asc

        const response = await fetch(`/api/tasks?${params}`, {
          method: "GET",
          headers: { "X-CSRF-TOKEN": token }, //header set to the token prop
          credentials: "include", //send cookies with every request
        });

        const data = await response.json();
        if (response.ok) {
          setTodoList(data.tasks);
          setFilterError('') //to clear any previous filter errors when data loads successfully
        } //data.tasks is array
        else if (response.status === 401) {
          throw new Error("unauthorized"); // throw! catch will handle it
        } else {
          throw new Error("Can not find todos");
        }
      } catch (error) {
        if(debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc'){
            setFilterError(`Error filtering/sorting todos: ${error.message}`)
        }else{
            setError(`Error fetching todos: ${error.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    }
    if (token) {
      fetchTodos();
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]); //The useEffect hook runs when the component mounts and whenever the token changes. This ensures we fetch fresh data when a user logs in.
  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    setTodoList((previous) => [newTodo, ...previous]); // ← FIRST! optimistic(UI first)
    try {
      const response = await fetch("/api/tasks", {
        // ← SECOND! background (server second)
        method: "POST",
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
        credentials: "include",
      });
      const data = await response.json();
      //response.ok = got response and good news (server said yes)
      if (response.ok) {
        // replace temp todo with real todo from server
        setTodoList((previous) =>
          previous.map((todo) => (todo.id === newTodo.id ? data : todo)),
        );
        //!response.ok = got response but bad news (server said no) ✗
          invalidateCache();
      } else if (!response.ok) {
        // remove failed todo
        setTodoList((previous) =>
          previous.filter((todo) => todo.id !== newTodo.id),
        );
        setError("failed to ad todo");
      }
      // catch runs when the request never reaches the server
      //network problem! connection failed completely
    } catch (error) {
      // remove failed todo
      setTodoList((previous) =>
        previous.filter((todo) => todo.id !== newTodo.id),
      );
      setError(error.message);
    
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id); // original todo
    const updatedTodo = {
      ...originalTodo,
      isCompleted: !originalTodo.isCompleted,
    };

    setTodoList((previous) =>
      previous.map((todo) => (todo.id === id ? updatedTodo : todo)),
    );
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
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isCompleted: !originalTodo.isCompleted }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
      });


      if (!response.ok) {
        //if  server fails → rollback(back to original) with .map
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
        setTodoList((previous) =>
          previous.map((todo) => (todo.id === id ? originalTodo : todo)),
        );
        throw new Error("something went wrong");
      }else{
         invalidateCache();
      }
    } catch (error) {
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === id ? originalTodo : todo)),
      );
      setError(error.message);
     
    }
  }
  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id); //original todo
    const updatedTodo = {
      ...editedTodo,
      title: editedTodo.title,
      isCompleted: editedTodo.isCompleted,
    };
    setTodoList((previous) =>
      previous.map((todo) => (todo.id === editedTodo.id ? updatedTodo : todo)),
    ); // optimistic - apply edited todo immediately

    // const updatedTodos = todoList.map(todo => {
    //   if (todo.id === editedTodo.id) {
    //     return editedTodo // match → return new object with editedTodo
    //   }
    //     return todo //no match → return unchanged

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
      });

       

      if (!response.ok) {
        setTodoList((previous) =>
          previous.map((todo) =>
            todo.id === editedTodo.id ? originalTodo : todo,
          ),
        );
        setError("something went wrong");
      }else{
          invalidateCache();
      }
    } catch (error) {
      setTodoList((previous) =>
        previous.map((todo) =>
          todo.id === editedTodo.id ? originalTodo : todo,
        ),
      );
      setError(error.message);
   
    }
  }
  // setTodoList(updatedTodos) //update state(saved result of map)

  return (
    <>
      {error && (
        <div>
          <p>{error}</p>
          <button onClick={() => setError("")}>Clear error</button>
        </div>
      )}

    {filterError && (
        <div>
            <p>{filterError}</p>
            <button onClick= {()=>setFilterError('')}>Clear Filter Error</button>
            <button onClick={() => {
                setFilterTerm('') //Clears the filter term: 
                setSortBy('creationDate') //Resets sort by: 
                setSortDirection('desc') //Resets sort direction: 
                setFilterError('') //Clears the filter error: 
            }
            }>Reset Filters</button>
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
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />
    </>
  );
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
