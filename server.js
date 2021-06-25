const express = require('express');
const cors = require('cors');
const db = require('./queries');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true, }));
app.use(cors());

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);
//desafios
app.get('/desafios', db.getDesafios);
app.get('/desafios/aleatorio', db.getDesafiosRand);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})