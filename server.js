var express = require('express');

var app = express();

var PORT = process.env.PORT || 3000;

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

app.get('/todos/:id',function(req,res){

	var todoId = parseInt(req.params.id,10);
	var matchedTodo;
	//res.send('Asking for todo with id '+todoId);

	todos.forEach(function(todo){
		//res.send(' id '+todo.id);
		if(todoId === todo.id){
			matchedTodo = todo;
		}
	});

	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}
	
});

//Get /todos/:id

app.listen(PORT,function(){
	console.log('express listening on port '+PORT);
});