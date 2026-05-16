export default function isValidTodoTitle(title) {
    if (title.trim() !== "") return true
    else if(title === "") return false

}