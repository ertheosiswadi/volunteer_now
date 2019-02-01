//--------- Initialize firestore

//--------- Initialize firestore
const express = require('express');
const app = express();
const routes = require('./routes');

const PORT = process.env.PORT || 3000;

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.use('/', routes);

app.listen(PORT, ()=>{
	console.log('server is live');
});

//--------- Firebase stuff

// var test_add = db.collection('users').doc('ertheo');

// var setTheo = test_add.set(
// {
// 	'first' : 'Ertheo',
// 	'second' : 'Siswadi',
// 	'born' : {'month' : 'MAY', 'year': '2020'}
// });


