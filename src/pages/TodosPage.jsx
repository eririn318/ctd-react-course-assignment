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
import { useSearchParams } from "react-router";
import StatusFilter from "../shared/StatusFilter.jsx";

export default function TodosPage() {
  const [searchParams] = useSearchParams();
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
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const searchTerm = debouncedFilterTerm.trim();
  const statusFilter = searchParams.get("status") || "all"; //Reads choice from URL /You need it in StatusFilter so the dropdown menu knows which option to highlight. You need it in TodosPage so your JavaScript code knows whether to show all items, hide completed items, or show active items!

  useEffect(() => {
    async function fetchTodos() {
      dispatch({ type: TODO_ACTIONS.FETCH_START });

      try {
        const params = new URLSearchParams({ limit: "1000" });
        const response = await fetch(`/api/tasks?${params}`, {
          method: "GET",
          headers: { "X-CSRF-TOKEN": token }, //header set to the token prop
          credentials: "include", //send cookies with every request
        });

        const data = await response.json();
        if (response.ok) {
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
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: `Error fetching todos: ${error.message}`,
            isFilterError: false,
          },
        });
      }
    }
    if (token) {
      fetchTodos();
    }
  }, [token]); //The useEffect hook runs when the component mounts and whenever the token changes. This ensures we fetch fresh data when a user logs in.
  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    //FIRST! optimistic(UI first)
    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: newTodo,
    });
    try {
      const response = await fetch("/api/tasks", {
        // SECOND! background (server second)
        method: "POST",
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
        credentials: "include",
      });
      const data = await response.json();
      //response.ok = got response and good news (server said yes)
      if (response.ok) {
        dispatch({
          type: TODO_ACTIONS.ADD_TODO_SUCCESS,
          payload: {
            tempId: newTodo.id, // ← find temp todo
            savedTodo: data, // ← replace with real
          },
        });

        //!response.ok = got response but bad news (server said no) ✗
      } else if (!response.ok) {
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
    //COMPLETE_TODO_START
    // setTodoList((previous) =>
    //   previous.map((todo) => (todo.id === id ? updatedTodo : todo)),
    // );

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

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: {
        id: id,
        updatedTodo: updatedTodo,
      },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          isCompleted: !originalTodo.isCompleted,
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
        dispatch({
          type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
        });
      }
      // }
    } catch (error) {
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

    // optimistic - apply edited todo immediately
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: {
        id: editedTodo.id,
        updatedTodo: updatedTodo,
      },
    });

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
        dispatch({
          type: TODO_ACTIONS.UPDATE_TODO_ERROR,
          payload: {
            id: editedTodo.id,
            originalTodo,
            error: "something went wrong",
          },
        });
      } else {
        dispatch({
          type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
        });
      }
    } catch (error) {
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

  return (
    <>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm animate-fade-in">
          <p className="text-sm font-semibold text-red-800">{error}</p>
          <button
            className="inline-flex items-center justify-center bg-white text-red-700 border border-red-300 h-11 px-4 rounded-md font-medium text-sm shadow-sm hover:bg-red-100 active:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            onClick={() =>
              dispatch({
                type: TODO_ACTIONS.CLEAR_ERROR,
              })
            }
          >
            Clear error
          </button>{" "}
        </div>
      )}

      {filterError && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6 flex flex-col gap-3 shadow-sm">
          <p className="text-sm font-semibold text-amber-900">{filterError}</p>
          <div className="flex flex-wrap gap-2.5">
            <button
              className="inline-flex items-center justify-center bg-white text-amber-800 border border-amber-300 h-9 px-3 rounded-md font-medium text-xs shadow-sm hover:bg-amber-100"
              onClick={() =>
                dispatch({
                  type: TODO_ACTIONS.CLEAR_ERROR,
                })
              }
            >
              Clear Filter Error
            </button>
            <button
              className="inline-flex items-center justify-center bg-amber-600 text-white h-9 px-3 rounded-md font-medium text-xs shadow-sm hover:bg-amber-700"
              onClick={() => {
                dispatch({
                  type: TODO_ACTIONS.RESET_FILTERS,
                });
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="w-full sm:w-auto">
            <StatusFilter />
          </div>
          <div className="w-full sm:w-auto">
            <SortBy
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortByChange={(
                newSortBy, //newSortBy is whatever the user selects in the Sort By dropdown
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
                newSortByDirection, //newSortDirection is whatever the user selects in the Order dropdown
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
          </div>
        </div>

        {/* ****FilterInput now uses dispatch directly:
        ✅ dispatch directly in JSX */}
        <div>
          <FilterInput
            filterTerm={filterTerm}
            onFilterChange={(value) =>
              dispatch({
                type: TODO_ACTIONS.SET_FILTER,
                payload: value,
              })
            }
          />{" "}
        </div>
        <TodoForm onAddTodo={addTodo} />

        {isTodoListLoading ? (
          <div className="text-center py-10 text-slate-400 font-medium text-sm animate-pulse">
            <span className="block text-3xl mb-2">⏳</span>
            <p className="text-sm font-medium">Loading</p>
          </div>
        ) : (
          // default
          // isTodoListLoading = false
          // {false && <p>Loading...</p>}  // → nothing displays

          // when it clicks default false becomes true

          // fetchTodos starts
          // setIsTodoListLoading(true)
          // {true && <p>Loading...</p>}   // → "Loading..." displays! ✓
          <TodoList
            todoList={todoList}
            onCompleteTodo={completeTodo}
            onUpdateTodo={updateTodo}
            dataVersion={dataVersion}
            statusFilter={statusFilter}
            sortBy={sortBy}
            sortDirection={sortDirection}
            searchTerm={searchTerm}
          />
        )}
      </div>
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
