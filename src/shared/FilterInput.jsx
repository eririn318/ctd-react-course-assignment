export default function FilterInput({filterTerm, onFilterChange}) {

    return(
        <div>
        <label htmlFor='filterInput'>Search todos:</label>
        <input
        id='filterInput'
        type='text'
        value={filterTerm}//filterTerm prop passed in from the parent component/displays whatever filterTerm is. ← what the user SEES in the input box
        onChange={(e)=> onFilterChange(e.target.value)}
        placeholder='Search by title...'// inside input when it is empty
        ></input>
        </div>
    )
}