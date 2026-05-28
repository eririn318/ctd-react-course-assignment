export default function SortBy({
    sortBy, 
    sortDirection, 
    onSortByChange, 
    onSortDirectionChange})
     {
    return(
        <>
        <label htmlFor="sortBy">Sort By</label>
        <select 
        id="sortBy"
        value={sortBy} 
            //if sortBy="creationDate", go to option value="creationDate"
            // ✔ value={sortBy}. sortBy = "creationDate"
            // ✔ <option value="creationDate">Creation Date</option>
            // ✔ React matches values "creationDate"→ shows label text "Creation Date"

            // They are connected through this rule:
            // 👉 <select value={sortBy}>
            // compares with
            // 👉 <option value="creationDate"></option>

            // select.value  ===  option.value
            // If they match → that option is selected.

        onChange= {(e)=>{onSortByChange(e.target.value)}} 
            // onSortByChange={setSortBy} in TodosPage.jsx
            // <option value="title">
            //         ↓
            // user selects it
            //         ↓
            // e.target.value = "title"
            //         ↓
            // onSortByChange("title")
            //         ↓
            // setSortBy("title")
            //         ↓
            // state setSortBy updates
        >
            <option value="creationDate">Creation Date</option>
            <option value="title">Title</option>
        </select>
        <label htmlFor="sortDirection">Order</label>
        <select 
        id="sortDirection"
        value={sortDirection}
        onChange={(e)=> onSortDirectionChange(e.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
        </select>
        </>
    )
}