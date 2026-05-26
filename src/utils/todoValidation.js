
export default function isValidTodoTitle(title) {
    if (title.trim() !== "") return true
        // else if(title === "") return false =>this will return undefined if " "/title === "" → also false (because " " is not exactly "")
    return false 
        //if (valid) return true
        // else if (exact empty string) return false
        // But logically, you actually want:
        // “Anything not valid should be false”
}