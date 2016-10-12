var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(matchedTodo){
		res.json(matchedTodo);
	}else {
		res.status(404).send();
	}
});

//Post can take data (Using /todos as other method)
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed'); //pick to select only fields you want pick (params, valueToKeep);
	
	//If body.completed IS NOT A BOOLEAN OR Body.description IS NOT A STRING OR if body.description is not a bunch of blank spaces :)
 	// Checking using underscore methods to see if the value provided can be accepted
 	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
 		return res.status(400).send();
 	}

	body.id = todoNextId++;
	body.description = body.description.trim();
	todos.push(body);
	
	res.json(body);
});

app.delete('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo){
		res.status(404).json("error : No todo found with that id");
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});

app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if(!matchedTodo){
		return res.status(404).json("error : No todo found with that id");
	} 

 	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
 		validAttributes.completed = body.completed;
 	} else if (body.hasOwnProperty('completed') ) {
 		return res.status(400).send();
 	}

 	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
 		validAttributes.description = body.description;
 	} else if (body.hasOwnProperty('description') ) {
 		return res.status(400).send();
 	} 

	matchedTodo = _.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});


app.listen(PORT, function(){
	console.log('Express listening on PORT ' + PORT + '!');
});

