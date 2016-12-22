 var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');



var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());


/*var todos = [{
	id: 1,
	description: 'Meet mom for lunch',
	completed: false
}, {
	id: 2,
	description: 'Go to market',
	completed: false
}, {
	id: 3,
	description: 'nothing important',
	completed: true
}];*/

app.get('/', function(req, res) {
	res.send('Todo API root');
});

//Get /todos
app.get('/todos', function(req, res) {

	//with db
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
			where.completed =  true
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
			where.completed = false
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
			where.description = {
				$like : '%'+query.q+'%'
			};
	}

	db.todo.findAll({
		where : where
	}).then(function(todos){
		res.json(todos);
	},function(e){
		res.status(500).send(); 
	});

	//without db
	/*var queryParams = req.query;
	var filteredTodos = todos;
	var body = req.body;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {
			completed: true
		});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {
			completed: false
		});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {

		filteredTodos = _.filter(filteredTodos, function(obj) {
			//console.log('description = '+obj.description);
			//console.log('queryParams = '+queryParams.q);

			if (obj.description.toLowerCase().indexOf(queryParams.q) > -1) {
				//	console.log('ysssss '+obj.description);
				return obj;
			}
		})
	}
	//filteredTodos = _.where(filteredTodos,{completed:false});

	res.json(filteredTodos);*/
});

//Get /todos/:id
app.get('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);

	//with db code

	/*
	db.todo.findById(todoId).then(function(todo){
		res.json(todo.toJSON());
	},function(e){
		res.status(400).json(e);
	});

	*/
	//with db but tutorial code

	db.todo.findById(todoId).then(function(todo){
		if(!!todo){
			res.json(todo.toJSON());
		}else{
			res.status(404).send();
		}
	},function(e){
		res.status(500).json(e)
	});

	/*
	//with underscore lib
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});

	//without underscore lib
	//var matchedTodo;
	//todos.forEach(function(todo){
	//	if(todoId === todo.id){
	//		matchedTodo = todo;
	//	}
	//});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}

	*/

});


//Post  /todo

app.post('/todos', function(req, res) {

	/*
	//tutorial code

	var body = req.body;
	body = _.pick(body, 'description', 'completed');

	
	db.todo.create(body).then(function(todo){

		res.json(todo.toJSON());
	},function(e){

		res.status(400).json(e);
	});

	*/


	//my attempt using actual DB(working)

	var body = req.body;
	body = _.pick(body, 'description', 'completed');

	console.log(body);

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	console.log('Inserting using DB \n '+body.description+' \n'+body.completed);
	
	db.todo.create({ 
		description : body.description.trim(),
		completed : body.completed
	}).then(function(todo){
		if(todo){
			res.status(200).json(todo);
		}else{
			res.status(400).json(e);
		}
	});

	//without using db

	/*

	var body = req.body;

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	//remove the unwanted data
	body = _.pick(body, 'description', 'completed');

	//trim the space from description
	body.description = body.description.trim();
	//var todo = {
	//	id : todoNextId,
	//	description : body.description,
	//	completed : body.completed
	//};



	body.id = todoNextId++;
	todos.push(body);

	//todoNextId++;

	console.log('description ' + body.description);

	res.json(body);

	*/
});

//Delete /todos/:id

app.delete('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);

	//tutorial code
	db.todo.destroy({
		where : {
			id :todoId
		}
	}).then(function(deletedRow){
		if(deletedRow === 0){
			res.send(404).json({
				error : 'record not found'
			});
		}else{
			res.status(204).send();
		}
	},function(){
		res.status(500).send();
	});	

	//my attempt, deletion working fine but not returning the deleted data and tutorial used some other function too
	/*db.todo.findById(todoId).then(function(todo){
		if(!!todo){
				db.todo.truncate({    	//fetch all items where completed = false
				where : {
					id: todoId
				}
			}).then(function(todo){
				res.status(200).json(todo);
			});

		}else{
			res.status(404).send();
		}
	},function(e){
		res.status(500).json(e)
	});*/



	//without db
	/*
	var todoId = parseInt(req.params.id, 10);

	//get the item by id using _ lib
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});

	todos = _.without(todos, matchedTodo);

	res.json(matchedTodo);
	*/

});


// Put /todos/:id

app.put('/todos/:id', function(req, res) {

	var body = req.body;

	body = _.pick(body, 'description', 'completed');

	var validAttributes = {};

	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		//console.log(body.description);
		res.status(400).send();
	}



	_.extend(matchedTodo, validAttributes);

	res.json(matchedTodo);

});

db.sequelize.sync().then(function(){
		app.listen(PORT, function() {
		console.log('express listening on port ' + PORT);
	});
});

