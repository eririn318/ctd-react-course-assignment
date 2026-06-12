import {forwardRef} from "react"
// useRef     = creates ref (TodoForm)
// forwardRef = passes ref through component (TextInputWithLabel)

const TextInputWithLabel = forwardRef(function TextInputWithLabel({elementId, labelText, onChange, value}, ref) {

    return(
    <>
    <label  className="pt-2" htmlFor={elementId}>{labelText}</label>
    <input
    type="text"
    ref={ref}
    id={elementId}
    value={value}
    onChange={onChange}
    className="flex-1 h-9 px-4 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
    ></input>
    
    </>
    )

})


export default TextInputWithLabel