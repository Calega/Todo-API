var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;

//Everytime a json request is made it will be possible to get data
app.use(bodyParser.json()); 

//Model(Array) for Todo
var todos = [];

app.get('/', function(req,res){
	res.send('TODO Api Root');
});

//get all todo items get /todos
app.get('/todos', function(req,res){
	res.json(todos); //return todos converted to json
});
//get individual todo by id GET /todos/:id
app.get('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo;

	todos.forEach(function (todo){
		if(todo.id === todoId){
			matchedTodo = todo;
		} 
	});

	if(matchedTodo){
		res.json(matchedTodo);
	}else {
		res.status(404).send();
	}
});

//Post can take data (Using /todos as other method)
app.post('/todos', function(req, res) {
	var body = req.body; //getting item from body parser
	body.id = todoNextId++;
	todos.push(body);
	
	res.json(body);
});

app.listen(PORT, function(){
	console.log('Express listening on PORT ' + PORT + '!');
});

