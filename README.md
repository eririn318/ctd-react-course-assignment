# Todo List
## A simple Todo List app built with React and Vite that displays a list of tasks and helps practice basic React and Git workflow.

# Installation instructions
✅ Step 1 — Create repo on GitHub 
Name: todo-list  
Public  
❌ No README / .gitignore / license 
 
✅ Step 2 — Clone it 
cd todo-list 
git clone https://github.com/eririn318/ctd-lesson1-todo-list.git 
 
✅ Step 3 — Create Vite React app 
npx create-vite@latest --template react . 
npm install 
👉 The . is VERY important (puts files in your repo) 

✅ Step 4 — Run project 
npm run dev 
Open: 
http://localhost:5173 

✅ Step 5 — First commit (main branch) 
git add . 
git commit -m "initial vite react setup" 
git push 

✅ Step 6 — Create new branch 
git checkout -b lesson-01-setup 

✅ Step 6 —  Publish branch to GitHub 
git push -u origin lesson-01-setup 

✅ Step 7 — Clean up files 
App.css 
delete everything inside  
index.css 
delete everything inside  

App.jsx → change to below: 

import './App.css' 
 
function App() { 
  return ( 
    <div> 
      <h1>Todo List</h1> 
    </div> 
  ) 
} 
 
export default App 

✅ Step 8 — Add todos (requirement) 
Update it : 

import './App.css'

function App() {
const todoList = [
  {  id:1, title: "review resources"},
  {  id:2, title: "take notes"},
  {  id:3, title: "code out app"},
]

  return (
    <>
      <h1>My Todos</h1>
      <ul>{todoList.map(todo=><li key={todo.id}>{todo.title}</li>)}</ul>
    </>
  )
}

export default App


✅ Step 9 — Commit again 
git add . 
git commit -m "setup todo list UI" 
git push 

# Pull Request instructions

✅ Step 1 — Make sure your branch is pushed 

How to know if you pushed the branch 
Run this: 
git branch 
You should see: 
* lesson-01-setup 
main 

If you see it, In your terminal: 
git push 

(If it’s the first time pushing the branch: 
git push -u origin lesson-01-setup) 

✅ Step 2 — Go to GitHub 
Open your repo in browser: 
👉 https://github.com/eririn318/ctd-lesson1-todo-list 

✅ Step 3 — You will see a banner 
You’ll usually see something like: 
“Compare & pull request” 
👉 Click that button 

✅ Step 4 — Set branches correctly 
Make sure: 
base branch: main  
compare branch: lesson-01-setup  

✅ Step 5 — Add title & description 
Title: 
Todo List App - Lesson 01 Setup 

Description: 
- Built Todo List UI 
- Cleaned up Vite template 
- Added basic list items 

✅ Step 6 — Create PR 
Click: 
👉 Create pull request 

✅ Step 7 — Copy link 
Now you will see a URL in browser URL bar: 
https://github.com/eririn318/ctd-lesson1-todo-list/pull/1 

🧠 Simple explanation 
Branch = your work  
PR = request to merge your work into main 


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
