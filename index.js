//--------- Initialize firestore
const admin = require('firebase-admin');

var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
//--------- Initialize firestore

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('./public'));

app.listen(PORT, ()=>{
	console.log('server is live');
});

app.get('/', (request, response)=>{
	response.send("HELLO THERE");
	db.collection('users').get()
	  .then((snapshot) => {
	    snapshot.forEach((doc) => {
	      console.log(doc.id, '=>', doc.data());
	    });
	  })
	  .catch((err) => {
	    console.log('Error getting documents', err);
	  });
});

//--------- Firebase stuff

var test_add = db.collection('users').doc('ertheo');

var setTheo = test_add.set(
{
	'first' : 'Ertheo',
	'second' : 'Siswadi',
	'born' : {'month' : 'MAY', 'year': '2020'}
});


