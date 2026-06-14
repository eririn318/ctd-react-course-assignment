export function isTodoCompleted(todo) {
  return todo.isCompleted === true || todo.isCompleted === "true" || todo.isCompleted === 1;
}
