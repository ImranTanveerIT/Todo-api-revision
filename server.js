var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');


var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());


var todos = [{
	id : 1,
	description: 'Meet mom for lunch',
	completed: false
},{
	id:2,
	description : 'Go to market',
	completed: false
},{
	id:3,
	description: 'nothing important',
	completed: true
}];

app.get('/',function(req,res){
	res.send('Todo API root');	
});

//Get /todos
app.get('/todos',function(req,res){
	res.json(todos);
});

//Get /todos/:id
app.get('/todos/:id',function(req,res){

	var todoId = parseInt(req.params.id,10);

	//with underscore lib
	var matchedTodo = _.findWhere(todos,{id:todoId});

	//without underscore lib
	/*var matchedTodo;
	todos.forEach(function(todo){
		if(todoId === todo.id){
			matchedTodo = todo;
		}
	});*/

	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}
	
});


//Post  /todo

app.post('/todos',function(req,res){

	var body = req.body;

	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}

	//remove the unwanted data
	body = _.pick(body,'description','completed');

	//trim the space from description
	body.description = body.description.trim();
	/*var todo = {
		id : todoNextId,
		description : body.description,
		completed : body.completed
	};*/



	body.id = todoNextId++;
	todos.push(body);

	//todoNextId++;

	console.log('description '+body.description);

	res.json(body);
});

app.listen(PORT,function(){
	console.log('express listening on port '+PORT);
});










