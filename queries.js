// pg_ctl -D "C:\Program Files\PostgreSQL\13\data" start

//local
// const Pool = require('pg').Pool;
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'postgres',
//     password: 'adm',
//     port: 5432,
// })

heroku
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// DESAFIOS ****************************************

const getDesafios = (request, response) => {
    pool.query('SELECT * FROM desafios ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const getDesafiosRand = (request, response) => {
    pool.query('select * from desafios order by random() limit 1;', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

// RANKING
const getRanking = (request, response) => {
    pool.query('SELECT * FROM ranking ORDER BY pontos DESC LIMIT 100', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const setRanking = (request, response) => {
    const { nome, pontos } = request.body;
    // const nome = "giu";
    // const pontos = "100";
    pool.query('INSERT INTO ranking (nome, pontos) VALUES ($1, $2) returning id', [nome, pontos], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).send(`Jogada salva! Verifique abaixo se está entre os TOP 50 :) <button class="msgbox__btn" onclick="game.ini(true)">Começar de novo!</button>.`);
    })
};
//INSERT INTO public.ranking (nome, pontos) VALUES ('Picles'::character varying, '5'::integer) returning id;

module.exports = {
    getDesafios,
    getDesafiosRand,
    getRanking,
    setRanking,
}

/*
Exemplos:

query: (text, params) => pool.query(text, params)

const getUsers = (request, response) => {
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

Curl no terminal para teste local
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