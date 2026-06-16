import validateFilterInput from "../utils/filterValidation.js";
import {useState} from "react"
export default function FilterInput({ filterTerm, onFilterChange }) {
   const [error, setError] = useState("")
  function handleChange(e) {
    const inputValue = e.target.value;
    const { isValid, value, errors } = validateFilterInput(inputValue);
   

    if (!isValid) {//if NOT valid/errors exist → stop update (onFilterChange(value) does not happen)
    setError(errors[0])
    return
  }
  setError("")
  onFilterChange(value); //update state / filter "all", "active", "completed" happens in parent
}

  return (
    <div>
      <label htmlFor="filterInput">Search todos: </label>
      <input
        id="filterInput"
        type="text"
        value={filterTerm} //filterTerm prop passed in from the parent component/displays whatever filterTerm is. ← what the user SEES in the input box
        onChange={handleChange}
        maxLength={20}
        placeholder="Search by title..." // inside input when it is empty
        className="flex-1 h-9 w-full sm:w-96 px-4 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
