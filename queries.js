// pg_ctl -D "C:\Program Files\PostgreSQL\13\data" start

// const Pool = require('pg').Pool;
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'postgres',
//     password: 'adm',
//     port: 5432,
// })

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const getUsers = (request, response) => {
    // response.setHeader('Access-Control-Allow-Origin', '*');
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const { name, email } = request.body

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${results.insertId}`)
    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body

    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
}

// DESAFIOS ****************************************

const getDesafios = (request, response) => {
    pool.query('SELECT * FROM desafios ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getDesafiosRand = (request, response) => {
    pool.query('select * from desafios order by random() limit 1;', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

// Gerais ? *********** 
//query: (text, params) => pool.query(text, params)

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getDesafios,
    getDesafiosRand,

}

/**
POST
curl --data "name=Elaine&email=elaine@example.com"
http://localhost:3000/users

PUT
Update
curl -X PUT -d "name=Kramer" -d "email=kramer@example.com"
http://localhost:3000/users/1

DELETE
curl -X "DELETE" http://localhost:3000/users/1
*/