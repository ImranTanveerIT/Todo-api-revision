var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined,{

	'dialect' : 'sqlite',
	'storage' : __dirname+'/basic-sqlite-database.sqlite'
});


var Todo = sequelize.define('todo',{

	description : {
		type : Sequelize.STRING,
		allowNull : false,
		validate :{
			len : [1,250]
		}
	},
	completed : {
		type : Sequelize.BOOLEAN,
		allowNull : false,
		defaultValue : false
	}
});

//lecture 66
sequelize.sync().then(function(){

	console.log('everything is synced');

	Todo.create({ //insert an item in db
		description : 'walk the dog',
		completed : false
	}).then(function(todo){ //insert 2nd item
		return Todo.create({
			description : 'Clean office'
		}); 
	}).then(function(){ 
		//return Todo.findById(40); //fetch item by id =1
		return Todo.findAll({    	//fetch all items where completed = false
			where : {
				//completed : false   //search by completed status

				description : {		//search by description match
					$like : '%Clean%'
				}
			}
		});
	}).then(function(todos){ //get the item u searched above i-e by id =1
		if(todos){
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			});
			
		}else{
			console.log('no todo found');
		}
	}).catch(function(e){
		console.log(e);
	});
});