// import {useRef, useState} from "react"
import { useState, useRef } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import isValidTodoTitle from "../../utils/todoValidation.js";
import { sanitizeInput } from "../../utils/sanitize.js";

function TodoForm({ onAddTodo }) {
  const inputRef = useRef();
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const [error, setError] = useState("");

  function handleAddTodo(event) {
    event.preventDefault();

    const trimmedTitle = workingTodoTitle.trim();
    if (!isValidTodoTitle(trimmedTitle)) {
      // 1.validation check
      setError("Please enter a valid title.");
      return;
    }
    setError(""); //clear previous error

    const cleanTitle = sanitizeInput(trimmedTitle); //2.sanitize after validation (security clean)

    onAddTodo(cleanTitle); //3.save
    //   event.target.reset(); // clears input
    setWorkingTodoTitle(""); //reset UI
    inputRef.current.focus(); // focuses input
    // .current is where React stores the DOM element after you connect it with ref={inputRef}
  }

  return (
    <form
      onSubmit={handleAddTodo}
      className="w-full flex flex-col flex-row gap-3"
    >
      <TextInputWithLabel
        ref={inputRef}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        elementId="todoTitle"
        labelText="Todo: "
        maxLength={20} //for UI limit length
        placeholder="Todo text"
      />

      {/* Error message for validation only
              - validation (isValidTodoTitle)
                → required, empty check, length rule
              - UI rules (maxLength)
                → handled by input, not error message
              - trim()
                → used before validation */}
      {/* It does NOT show:
              maxLength issues (UI already blocks it)
              sanitize issues (silent security cleanup) */}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="h-9 px-5 font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 dynamic-touch-target"
        disabled={!isValidTodoTitle(workingTodoTitle)}
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
