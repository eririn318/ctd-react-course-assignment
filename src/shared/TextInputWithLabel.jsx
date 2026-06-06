import {forwardRef} from "react"
// useRef     = creates ref (TodoForm)
// forwardRef = passes ref through component (TextInputWithLabel)

const TextInputWithLabel = forwardRef(function TextInputWithLabel({elementId, labelText, onChange, value}, ref) {

    return(
    <>
    <label htmlFor={elementId}>{labelText}</label>
    <input
    type="text"
    ref={ref}
    id={elementId}
    value={value}
    onChange={onChange}></input>
    </>
    )

})


export default TextInputWithLabel