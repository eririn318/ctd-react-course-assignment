export const TODO_ACTIONS = {
  // Async operations:
  FETCH_START: "FETCH_START",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",

  // Todo mutations:
  ADD_TODO_START: "ADD_TODO_START",
  ADD_TODO_SUCCESS: "ADD_TODO_SUCCESS",
  ADD_TODO_ERROR: "ADD_TODO_ERROR",

  COMPLETE_TODO_START: "COMPLETE_TODO_START",
  COMPLETE_TODO_SUCCESS: "COMPLETE_TODO_SUCCESS",
  COMPLETE_TODO_ERROR: "COMPLETE_TODO_ERROR",

  UPDATE_TODO_START: "UPDATE_TODO_START",
  UPDATE_TODO_SUCCESS: "UPDATE_TODO_SUCCESS",
  UPDATE_TODO_ERROR: "UPDATE_TODO_ERROR",

  SET_SORT: "SET_SORT",
  SET_FILTER: "SET_FILTER",
  CLEAR_ERROR: "CLEAR_ERROR",
  RESET_FILTERS: "RESET_FILTERS",
};

export const initialTodoState = {
  todoList: [],
  error: "",
  isTodoListLoading: false,
  sortBy: "creationDate",
  sortDirection: "desc",
  filterTerm: "",
  dataVersion: 0,
  filterError: "",
};


// state  = React passes current state automatically ✅
// action = React passes your dispatch object automatically ✅
export function todoReducer(state, action) {

  switch (action.type) {
    // rule: setIsTodoListLoading(true) -> isTodoListLoading: true
    case TODO_ACTIONS.FETCH_START: //action.type===TODO_ACTIONS.FETCH_START?
      return {
        ...state,
        isTodoListLoading: true,
        error: "",
        filterError: "",
      };

// ...state means:
// javascript// current state has ALL these:
// state = {
//     todoList: [...],        // ← keep! don't change
//     isTodoListLoading: false, // ← will be overwritten
//     error: "old error",     // ← will be overwritten
//     filterError: "old",     // ← will be overwritten
//     sortBy: "creationDate", // ← keep! don't change
//     sortDirection: "desc",  // ← keep! don't change
//     filterTerm: "",         // ← keep! don't change
//     dataVersion: 0,         // ← keep! don't change
// }

// // ...state spreads ALL of them
// // then only OVERWRITE the ones you specify!
// return {
//     ...state,                 // ← copy everything
//     isTodoListLoading: true,  // ← overwrite this one
//     error: "",                // ← overwrite this one
//     filterError: "",          // ← overwrite this one
// }

// Think of it like:
// ...state = copy everything from old state 📋
// then override only what changed:

// isTodoListLoading: true  ← changed! ✅
// error: ""                ← changed! ✅
// filterError: ""          ← changed! ✅
// todoList: [...]          ← same! kept from ...state ✅
// sortBy: "creationDate"   ← same! kept from ...state ✅





    //FETCH
    // rule:
    // setTodoList(data.tasks) → todoList: action.payload
    // setFilterError('')      → filterError: ''
    case TODO_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        todoList: action.payload.todos, // payload = data.tasks
        filterError: "",
        isTodoListLoading: false,
      };

    // setFilterError(`Error filtering/sorting todos: ${error.message}`),
    // setError(`Error fetching todos: ${error.message}`),
    // setIsTodoListLoading(false);
    case TODO_ACTIONS.FETCH_ERROR:
      return {
        ...state,
        filterError: action.payload.isFilterError ? action.payload.message : "", //payload = filter error message/isFilterError: true→ filtering went wrong → show filterError/false → filterError stays empty
        error: action.payload.isFilterError ? action.payload.message : "", // payload = error message/isFilterError: false→ fetching went wrong  → show error/true → error stays empty
        isTodoListLoading: false ,
      };
    //ADD TO DO
    //  setTodoList((previous) => [newTodo, ...previous])
    case TODO_ACTIONS.ADD_TODO_START:
      return {
        ...state,
        todoList: [action.payload, ...state.todoList] // payload = newTodo
      };
    // setTodoList((previous) => previous.map((todo) => (todo.id === newTodo.id ? data : todo)),);
    case TODO_ACTIONS.ADD_TODO_SUCCESS: //tempId is temporary id is  id: Date.now(),-->server did not create id yet, so fake item I create immediately in UI.
      return {
        ...state,
        todoList: state.todoList.map((todo)=> (todo.id===action.payload.tempId 
          ? action.payload.savedTodo // ← replace with real(data->(server response)= in dispatch savedTodo)/← replace with real
          : todo)),
      };
    // setTodoList((previous) => previous.filter((todo) => todo.id !== newTodo.id),);
    // setError(error.message);
    case TODO_ACTIONS.ADD_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.filter((todo)=> (todo.id !== action.payload.tempId)),
        error: action.payload.error
      };
    //COMPLETE
    //   setTodoList((previous) => previous.map((todo) => (todo.id === id ? updatedTodo : todo)),);
    case TODO_ACTIONS.COMPLETE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map((todo)=> (todo.id === action.payload.id ? action.payload.updatedTodo: todo))
      };
    // setTodoList((previous) => previous.map((todo) => (todo.id === id ? originalTodo : todo)),);
    //  invalidateCache();
        // invalidateCache is defined up here:
          // const invalidateCache = useCallback(() => {
          //     setDataVersion((prev) => prev + 1)  // ← dataVersion is HERE!
          // }, [])
    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
      return {
        ...state,
           dataVersion: state.dataVersion + 1 // ADD 1 to current value
      };
    // setTodoList((previous) => previous.map((todo) => (todo.id === id ? originalTodo : todo)),);
    // setError(error.message);
    case TODO_ACTIONS.COMPLETE_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.map((todo)=> (todo.id === action.payload.id 
          ? action.payload.originalTodo //rollback → go BACK to original! isCompleted: false again
          : todo)),
        error: action.payload.error
      };

    //UPDATE
    // setTodoList((previous) => previous.map((todo) => (todo.id === editedTodo.id ? updatedTodo : todo)),
    case TODO_ACTIONS.UPDATE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map((todo)=> (todo.id === action.payload.id ? action.payload.updatedTodo : todo))
      };

    // setTodoList((previous) => previous.map((todo) => todo.id === editedTodo.id ? originalTodo : todo,),);
    // setError("something went wrong");
    //  invalidateCache();
          // invalidateCache is defined up here:
          // const invalidateCache = useCallback(() => {
          //     setDataVersion((prev) => prev + 1)  // ← dataVersion is HERE!
          // }, [])
    case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
      return {
        ...state,
        // error: action.payload.error,
        dataVersion: state.dataVersion + 1 // ADD 1 to current value
      };
    // setTodoList((previous) => previous.map((todo) => todo.id === editedTodo.id ? originalTodo : todo,),);
    // setError(error.message);
    case TODO_ACTIONS.UPDATE_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.map((todo)=> (todo.id === action.payload.id ? action.payload.originalTodo : todo)),
        error: action.payload.error
      };
    //UI---
    //SET SORT
    // setSortBy('creationDate')
    case TODO_ACTIONS.SET_SORT: //payload is { sortBy, sortDirection }
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.sortDirection
      };

    //SET FILTER
    // setFilterTerm('')
    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
            filterTerm: action.payload // "" user types different things each time → action.payload //action.payload = value(whatever user types)

      };

    //CLEAR ERROR
      // setFilterError('')
      // <button onClick={() => setError("")}>Clear error</button>
    case TODO_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        filterError: "" , // "always clears to empty, never changes -> → hardcode it"
        error: "" 

      };
    //RESET FILTERS
    
      // setFilterTerm('') //Clears the filter term:
      // setSortBy('creationDate') //Resets sort by: 
      // setSortDirection('desc') //Resets sort direction: 
      // setFilterError('') //Clears the filter error: 
    case TODO_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filterTerm: '',
        sortBy: 'creationDate',
        sortDirection: 'desc',
        filterError: ''
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}


// action.payload — when you need data from outside:
// javascript// needs data from TodosPage!
// todoList: action.payload  // ← needs data.tasks from fetch
// filterTerm: action.payload // ← needs what user typed
// error: action.payload      // ← needs error message


// state.dataVersion + 1 — calculates from existing state:
// javascript// doesn't need outside data!
// // just uses what's already in state!
// dataVersion: state.dataVersion + 1
// //                ↑
// //           already know this!
// //           it's in state!

// action.payload = needs information from OUTSIDE 📨
//                  "tell me what value to use"

// state.xxx + 1  = uses information from INSIDE 🏠
//                  "I already have what I need!"

// Simple rule:
// need value from TodosPage? → action.payload
// can calculate from state?  → use state directly

// Examples:
// javascripttodoList: action.payload        // ← need data from server ✅
// error: action.payload           // ← need error message ✅
// dataVersion: state.dataVersion + 1  // ← just add 1 to itself ✅
// isTodoListLoading: false        // ← always false, hardcoded ✅
// filterError: ''                 // ← always empty, hardcoded ✅

// action.payload = single value:
// javascript// payload is a single string
// dispatch({
//     payload: "study"
// })
// // action.payload = "study"
// // action.payload.anything = ❌ can't do this!

// action.payload.filterError = object with properties:
// javascript// payload is an object
// dispatch({
//     payload: {
//         filterError: "Error filtering...",
//         error: ""
//     }
// })
// // action.payload = { filterError: "...", error: "" }
// // action.payload.filterError = "Error filtering..." ✅
// // action.payload.error = "" ✅



// Pattern is same for COMPLETE and UPDATE:-> 
        // START already updated todoList ✅
        // SUCCESS just needs dataVersion + 1 ✅
        // no need to touch todoList in SUCCESS!===> no need to update
// START   → todoList changes ✅
// SUCCESS → only dataVersion + 1 ✅
// ERROR   → rollback + error message ✅

// Key difference is ADD_TODO:
// START   → FAKE todo ✅
// SUCCESS → replace FAKE with REAL (setTodoList)===>need to update + dataVersion + 1 ✅
// ERROR   → remove FAKE todo + error message ✅