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

//GET /todos?complete=true
app.get('/todos', function(req,res){
	var queryParams = req.query; //Query is an object to specify URL parameters
	var filteredTodos = todos;

	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed : false});
	}

	res.json(filteredTodos); //return todos converted to json
});

//GET /todos/:id
app.get('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(matchedTodo){
		res.json(matchedTodo);
	}else {
		res.status(404).send();
	}
});

//POST /todos
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

//DELETE /todos/:id
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

//PUT /todos/:id
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

