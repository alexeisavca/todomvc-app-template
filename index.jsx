require('todomvc-common/base.css');
require('todomvc-app-css/index.css');
import React from "react";
import run from "elmy";
import {fromJS, OrderedMap} from "immutable";
import cn from "classnames";

const ENTER_KEY = 13;

let boundInput = (accessor, props={}) =>
		<input type="text" value={accessor()} onChange={e => accessor(e.target.value)} {...props}/>;

let boundCheckbox = (accessor, props={}) =>
		<input type="checkbox" checked={accessor()} onChange={e => accessor(e.target.checked)} {...props}/>;

let Todo = {
	model: fromJS({
		completed: false,
		editing: false,
		text: ""
	}),

	/* These are here just to show the structure of the list items */
	/* List items should get the class `editing` when editing and `completed` when marked as completed */
	view: ({text, completed, editing}, _, send) => <li className={cn({completed: completed(), editing: editing()})}>
	<div className="view">
		{boundCheckbox(completed, {className: "toggle"})}
		<label>{text()}</label>
		<button className="destroy" onClick={send.bind(null, "delete")}/>
	</div>
	{boundInput(text, {className: 'edit'})}
</li>
};

let mkFilter = accessor => name => <li>
		<a className={cn({selected: accessor() == name})} href="javascript:void(0);" onClick={accessor.bind(null, name)}>
			{name}
		</a>
</li>;

const FILTERS = {
	All: () => true,
	Active: todo => !todo.get('completed'),
	Completed: todo => todo.get('completed')
};

run(document.getElementById('todo-container'), {
	model: fromJS({
		newTodo: "",
		todos: OrderedMap({}),
		filter: "All"
	}),

	adopt: {
		todos: Todo
	},

	update: {
		add: model =>
				model.update('todos', todos => todos.set(
						new Date().getTime(), Todo.model.set('text', model.get('newTodo'))
				)).set('newTodo', ""),
		todos: (model, nextState, index, action) => "delete" == action ? model.deleteIn(['todos', index]) : nextState()
	},

	view: ({newTodo, todos, filter}, {Todos}, send) => <section className="todoapp">
		<header className="header">
			<h1>todos</h1>
			{boundInput(newTodo, {className: "new-todo", placeholder:"What needs to be done?", autofocus: true,
				onKeyUp: e => ENTER_KEY == e.which ? send('add') : null})}
		</header>
		{!todos().isEmpty() &&
		<section className="main">
			<input className="toggle-all" type="checkbox"/>
			<label htmlFor="toggle-all">Mark all as complete</label>
			<ul className="todo-list">
				{Todos(todos().filter(FILTERS[filter()]))}
			</ul>
		</section>}
		{!todos().isEmpty() &&
		<footer className="footer">
			<span className="todo-count">
				<strong>{todos().count()}</strong> {todos().count() == 1 ? "item" : "items"} left
			</span>
			{/* Remove this if you don't implement routing */}
			<ul className="filters">
				{Object.keys(FILTERS).map(mkFilter(filter))}
			</ul>
			{/* Hidden if no completed items are left ↓ */}
			<button className="clear-completed">Clear completed</button>
		</footer>}
	</section>
})



