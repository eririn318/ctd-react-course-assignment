import { useEffect, useReducer } from "react";
import TodoList from "../features/TodoList/TodoList.jsx";
import TodoForm from "../features/Todos/TodoForm.jsx";
import SortBy from "../shared/SortBy.jsx";
import useDebounce from "../utils/useDebounce.js";
import FilterInput from "../shared/FilterInput.jsx";
import {
  TODO_ACTIONS,
  initialTodoState,
  todoReducer,
} from "../reducers/todoReducer.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import {useSearchParams} from "react-router"
import StatusFilter from "../shared/StatusFilter.jsx"

export default function TodosPage() {
  // const [todoList, setTodoList] = useState([]);
  // const [error, setError] = useState("");
  // const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  // const [sortBy, setSortBy] = useState("creationDate");
  // const [sortDirection, setSortDirection] = useState("desc");
  // const [filterTerm, setFilterTerm] = useState("");
  // const [dataVersion, setDataVersion] = useState(0);
  // const [filterError, setFilterError] = useState("")
  const [searchParams] = useSearchParams()
  const [state, dispatch] = useReducer(todoReducer, initialTodoState); // (function 1st, initial state 2nd)
  const {
    todoList,
    error,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
    filterError,
  } = state;
  const { token } = useAuth();
  // ****dispatch already handles it in each SUCCESS case:  dataVersion: state.dataVersion + 1  // ← already done!
  // const invalidateCache = useCallback(() => {
  //     setDataVersion((prev) => prev + 1);
  //     console.log("Invalidating memo cache after todo mutation");
  // }, []);

  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const statusFilter = searchParams.get('status') ||"all" //Reads choice from URL /You need it in StatusFilter so the dropdown menu knows which option to highlight. You need it in TodosPage so your JavaScript code knows whether to show all items, hide completed items, or show active items!


  // ****FilterInput now uses dispatch directly:
  // ✅ dispatch directly in JSX
  {
    /* <FilterInput
          filterTerm={filterTerm}
          onFilterChange={(value) => dispatch({
              type: TODO_ACTIONS.SET_FILTER,
              payload: value
          })}
      /> */
  }
  //  const handleFilterChange = (newTerm) => {
  //   setFilterTerm(newTerm);
  // };

  useEffect(() => {
    async function fetchTodos() {
      // setIsTodoListLoading(true);//FETCH_START
      dispatch({ type: TODO_ACTIONS.FETCH_START });

      try {
        const paramsObject = {
          sortBy,
          sortDirection,
        };
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm; // ← sends search term to server
        }
        const params = new URLSearchParams(paramsObject); // → /api/tasks?sortBy=creationDate&sortDirection=desc&find=study
        // params become => example:sortBy=title&sortDirection=asc

        const response = await fetch(`/api/tasks?${params}`, {
          method: "GET",
          headers: { "X-CSRF-TOKEN": token }, //header set to the token prop
          credentials: "include", //send cookies with every request
        });

        const data = await response.json();
        if (response.ok) {
          //FETCH_SUCCESS
          // setTodoList(data.tasks);
          // setFilterError('') //to clear any previous filter errors when data loads successfully
          dispatch({
            type: TODO_ACTIONS.FETCH_SUCCESS,
            payload: { todos: data.tasks },
          });
        } //data.tasks is array
        else if (response.status === 401) {
          throw new Error("unauthorized"); // throw! catch will handle it
        } else {
          throw new Error("Can not find todos");
        }
      } catch (error) {
        //FETCH_ERROR //payload= { message, isFilterError }
        if (
          debouncedFilterTerm ||
          sortBy !== "creationDate" ||
          sortDirection !== "desc"
        ) {
          // setFilterError(`Error filtering/sorting todos: ${error.message}`)
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              message: `Error filtering/sorting todos: ${error.message}`,
              isFilterError: true,
            },
          });
        } else {
          // setError(`Error fetching todos: ${error.message}`);
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              message: `Error fetching todos: ${error.message}`,
              isFilterError: false,
            },
          });
        }
        // } finally {
        //   setIsTodoListLoading(false);//FETCH_SUCCESS & FETCH_ERROR
        // }
        // isTodoListLoading: false is already handled in
        // FETCH_SUCCESS and FETCH_ERROR cases!
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

    // setTodoList((previous) => [newTodo, ...previous]); // ← FIRST! optimistic(UI first) //ADD_TODO_START
    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: newTodo,
    });
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
        //ADD_TODO_SUCCESS
        // replace temp todo with real todo from server
        // setTodoList((previous) =>
        //   previous.map((todo) => (todo.id === newTodo.id ? data : todo)),
        // );
        dispatch({
          type: TODO_ACTIONS.ADD_TODO_SUCCESS,
          payload: {
            tempId: newTodo.id, // ← find temp todo
            savedTodo: data, // ← replace with real
          },
        });

        // invalidateCache() is deleted now! Because ADD_TODO_SUCCESS already handles dataVersion + 1 in the reducer:
        // invalidateCache();

        //!response.ok = got response but bad news (server said no) ✗
      } else if (!response.ok) {
        // remove failed todo
        // setTodoList((previous) =>
        //   previous.filter((todo) => todo.id !== newTodo.id),
        // );
        // setError("failed to ad todo");
        dispatch({
          type: TODO_ACTIONS.ADD_TODO_ERROR,
          payload: {
            tempId: newTodo.id,
            error: "failed to add todo",
          },
        });
      }

      //catch runs when the request never reaches the server
      //network problem! connection failed completely
    } catch (error) {
      //ADD_TODO_ERROR
      //   // remove failed todo
      //   setTodoList((previous) =>
      //     previous.filter((todo) => todo.id !== newTodo.id),
      //   );
      //   setError(error.message);
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          tempId: newTodo.id,
          error: error.message,
        },
      });
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id); // original todo

    const updatedTodo = {
      ...originalTodo,
      isCompleted: !originalTodo.isCompleted,
    };

    // setTodoList((previous) =>
    //   previous.map((todo) => (todo.id === id ? updatedTodo : todo)),//COMPLETE_TODO_START
    // );

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: {
        id: id,
        updatedTodo: updatedTodo,
      },
    });

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
        body: JSON.stringify({
          isCompleted: !originalTodo.isCompleted,
          // createdAt: originalTodo.createdAt
        }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
      });

      if (!response.ok) {
        //COMPLETE_TODO_ERROR
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
        dispatch({
          type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
          payload: {
            id,
            originalTodo,
            error: "something went wrong",
          },
        });
      } else {
        // setTodoList((previous) =>
        //   previous.map((todo) => (todo.id === id ? originalTodo : todo)),//COMPLETE_TODO_SUCCESS
        // );
        dispatch({
          type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
        });
      }
      // }
    } catch (error) {
      //COMPLETE_TODO_ERROR
      // setTodoList((previous) =>
      //   previous.map((todo) => (todo.id === id ? originalTodo : todo)),
      // );
      // setError(error.message);
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          id: id,
          originalTodo: originalTodo,
          error: error.message,
        },
      });
    }
  }
  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id); //original todo
    const updatedTodo = {
      ...editedTodo,
      title: editedTodo.title,
      isCompleted: editedTodo.isCompleted,
    };
    // setTodoList((previous) =>//UPDATE_TODO_START
    //   previous.map((todo) => (todo.id === editedTodo.id ? updatedTodo : todo)),
    // );

    // optimistic - apply edited todo immediately
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: {
        id: editedTodo.id,
        updatedTodo: updatedTodo,
      },
    });
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
          // createdAt: editedTodo.createdAt
        }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
      });

      if (!response.ok) {
        //UPDATE_TODO_ERROR
        dispatch({
          type: TODO_ACTIONS.UPDATE_TODO_ERROR,
          payload: {
            id: editedTodo.id,
            originalTodo,
            error: "something went wrong",
          },
        });
      } else {
        //UPDATE_TODO_SUCCESS
        // setTodoList((previous) =>
        //   previous.map((todo) =>
        //     todo.id === editedTodo.id ? originalTodo : todo,
        //   ),
        // );
        // setError("something went wrong");
        dispatch({
          type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
          // payload: {
          //   error: "something went wrong"
          // }
        });
      }
      // else{
      //     invalidateCache();
      // }
    } catch (error) {
      //UPDATE_TODO_ERROR
      // setTodoList((previous) =>
      //   previous.map((todo) =>
      //     todo.id === editedTodo.id ? originalTodo : todo,
      //   ),
      // );
      // setError(error.message);
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          id: editedTodo.id,
          originalTodo: originalTodo,
          error: error.message,
        },
      });
    }
  }
  // setTodoList(updatedTodos) //update state(saved result of map)

  return (
    <>
      {error && (
        <div>
          <p>{error}</p>
          <button
            onClick={() =>
              // setError("")
              dispatch({
                type: TODO_ACTIONS.CLEAR_ERROR,
              })
            }
          >
            Clear error
          </button>{" "}
          {/* CLEAR_ERROR */}
        </div>
      )}

      {filterError && (
        <div>
          <p>{filterError}</p>

          <button
            onClick={() =>
              //CLEAR_ERROR
              // setFilterError('')
              dispatch({
                type: TODO_ACTIONS.CLEAR_ERROR,
                // filterError: ""
              })
            }
          >
            Clear Filter Error
          </button>
          <button
            onClick={() => {
              //RESET_FILTERS
              // setFilterTerm('') //Clears the filter term:
              // setSortBy('creationDate') //Resets sort by:
              // setSortDirection('desc') //Resets sort direction:
              // setFilterError('') //Clears the filter error:
              // setError('')
              dispatch({
                type: TODO_ACTIONS.RESET_FILTERS,
              });
            }}
          >
            Reset Filters
          </button>
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
        onSortByChange={(
          newSortBy, //SET_SORT //newSortBy is whatever the user selects in the Sort By dropdown
        ) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy: newSortBy, // ← new value
              sortDirection, // ← keep current value
            },
          })
        }
        onSortDirectionChange={(
          newSortByDirection, //SET_SORT //newSortDirection is whatever the user selects in the Order dropdown
        ) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy, //← keep current value
              sortDirection: newSortByDirection, // ← new value
            },
          })
        }
      />

      <StatusFilter />

      {/* <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} /> */}
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={(
          value, //SET_FILTER
        ) =>
          dispatch({
            type: TODO_ACTIONS.SET_FILTER,
            payload: value, //(new value===whatever user types)
          })
        }
      />

      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
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
