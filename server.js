var express = require('express');

var app = express();
var PORT = process.env.PORT || 3000;
//todo model
var todos = [{
	id: 1,
	description: 'Meet mom lunch',
	completed: false
}, {
	id:2,
	description: 'Go to market',
	completed: false
}, {
	id:3,
	description: 'Go to airport',
	completed: true	
}

];

app.get('/', function(req,res){
	res.send('TODO Api Root');
});

//get all todo items get /todos
app.get('/todos', function(req,res){
	res.json(todos); //return todos converted to json
});
//get individual todo by id GET /todos/:id

app.listen(PORT, function(){
	console.log('Express listening on PORT ' + PORT + '!');
});

