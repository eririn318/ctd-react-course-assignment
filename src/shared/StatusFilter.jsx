import {useSearchParams} from "react-router"

function StatusFilter() {
    // 1. You hook into the browser's URL address bar
    const [searchParams, setSearchParams] = useSearchParams()

// searchParams.get("status"): This looks at the browser bar. If the URL is mysite.com/todos?status=completed, this will return the string "completed".
// || "all": This is a fallback default safety net. If someone just visits mysite.com/todos (with no ?status= parameter visible in the address bar), get("status") returns null. This fallback ensures currentStatus defaults cleanly to "all".
   //StatusFilter changes the URL to something like ?status=completed. But it doesn't touch your array of todos. It just puts the data into the browser's address bar.
const currentStatus = searchParams.get("status") || "all"

     const handleStatusChange = (status) => {//This is an event handler function that runs whenever a user clicks a filter button (for example, clicking an "Active", "Completed", or "All" tab) and passes along the newly chosen category.
        if(status === "all"){
            //remove status param for 'all' to keep URL clean
            //If the user clicks the "All" filter, we don't want our URL looking clunky with ?status=all.
            // searchParams.delete("status") completely wipes the "status" parameter out of our tracking object to keep the web link pristine and short.
            searchParams.delete("status")
        } else{
// If the user clicked anything else (like "completed" or "active"), the code executes the else block.
// searchParams.set("status", status) adds or updates the parameter inside our tracking object (e.g., changing it to status=completed).
            searchParams.set("status", status)
        }
// Up until this line, all deletions and insertions were only happening inside a temporary memory sandbox.
// Calling setSearchParams(searchParams) tells React Router: "Okay, take our modified tracking object and officially push it live to the browser's address bar!"
// The URL updates instantly, React Router catches the change, re-renders the application, and filters your Todo list layout based on the brand new path configuration!
        setSearchParams(searchParams) //Use the browser's back/forward buttons to navigate through filter history

    }

    return(
    <div className="flex items-center gap-2">
            <label htmlFor="statusFilter">Show</label>
            <select
                id="statusFilter"
                value={currentStatus}
                onChange={(e)=> handleStatusChange(e.target.value)} //when clicked of value, choose value from <option value=""
                
             className="h-9 px-3 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
>
                    <option value="all">All Todos</option>
                    <option value="active">Active Todos</option>
                    <option value="completed">Completed Todos</option>
            </select>
        </div>
    )
}

export default StatusFilter