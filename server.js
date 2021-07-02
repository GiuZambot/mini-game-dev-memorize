const express = require('express');
const cors = require('cors');
const db = require('./queries');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true, }));
app.use(cors());

app.use(express.static("front"));

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/front/index.html");
});

// users
app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);
// create 

//desafios
app.get('/desafios', db.getDesafios);
app.get('/desafios/aleatorio', db.getDesafiosRand);

const port = process.env.PORT || 5500;
//local
//const host = process.env.YOUR_HOST || '127.0.0.1';
const host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(port, host, () => {
    console.log(`listening on ${host} - ${port}`);
});