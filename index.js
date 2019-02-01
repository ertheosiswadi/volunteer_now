const express = require('express');
const app = express();

const PORT = process.env.PORT || 80;

app.use(express.static('./public'));

app.listen(PORT, ()=>{
	console.log('server is live');
});

app.get('/', (request, response)=>{
	response.send("HELLO THERE");
});