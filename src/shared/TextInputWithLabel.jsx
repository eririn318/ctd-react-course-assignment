import { forwardRef } from "react";
// useRef     = creates ref (TodoForm)
// forwardRef = passes ref through component (TextInputWithLabel)

// Reusable labeled text input with forwardRef support for focus management
const TextInputWithLabel = forwardRef(function TextInputWithLabel(
  { elementId, labelText, onChange, value, maxLength, placeholder },
  ref,
) {
  return (
    <>
      <label className="pt-2" htmlFor={elementId}>
        {labelText}
      </label>
      <input
        type="text"
        ref={ref}
        id={elementId}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        className="flex-1 h-9 px-4 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
      />
    </>
  );
});

export default TextInputWithLabel;

//=========== maxLength in UI ===========
// UI layer (frontend component)
//
// Purpose:
// - controls typing behavior
// - improves UX
//
// Behavior:
// - stops user from typing more than limit
// - does NOT validate
// - does NOT show errors

//=========== todoValidation.js ===========
// Validation layer (frontend logic)
//
// Purpose:
// - checks final value before saving/submitting
//
// Example rules:
// - not empty
// - max length allowed
//
// Important:
// - runs even if UI maxLength works correctly
// - runs even if UI is bypassed (paste, JS, API)
