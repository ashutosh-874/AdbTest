import axios from 'axios';
import {useState, useEffect} from 'react'

import './App.css';
import {BASE_URL} from './utils'

export function App() {

	const [newTodoTitle, setNewTodoTitle] = useState('')
	const [todos, setTodos] = useState([])


	useEffect(() => {
		axios.get(`${BASE_URL}/todos`)
		.then(function (response) {
			// handle success
			setTodos(response.data)
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		})
	}, [])


	const addTodo = () => {
		
		axios.post(`${BASE_URL}/todos/`, {
			title: newTodoTitle
		})
		.then(function (response) {
			setNewTodoTitle('')
			setTodos(todos => [...todos, response.data])
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	const deleteTodo = (e) => {
		let pk = e.target.id
		axios.delete(`${BASE_URL}/todos/${pk}/`)
		.then(function (response) {
			// handle success
			console.log(response.data.detail);
			setTodos(todos => todos.filter(todo => todo.id !== pk))
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		})
	}
	

	return (
		<section className="container">
			<div className="heading">
				<img className="heading__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/756881/laptop.svg" />
				<h1 className="heading__title">To-Do List</h1>
			</div>
			<form class="form" onSubmit={addTodo}>
				<div>
					<label className="form__label" htmlFor="todo">~ Today I need to ~</label>
					<input className="form__input"
						type="text" 
						id="todo" 
						name="to-do"
						size="30"
						required 
						value={newTodoTitle}
						onChange={ e => setNewTodoTitle(e.target.value)} />
					<button disabled={newTodoTitle.length < 1} className="button"><span>Submit</span></button>
				</div>
			</form>
			<div>
				<ul className="toDoList">
					{
						todos.map(todo => <li key={todo.id} id={todo.id} onClick={e => deleteTodo(e)}>{todo.title}</li> )
					}           		
				</ul>
			</div>
		</section>
	);
}

export default App;
