const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const querystring = require('querystring');
const sqlite3 = require('sqlite3').verbose();
const login = require('../midlleware/login');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


//create administrators
router.post('/create_admin', async (req, res, next) => {
    //set variables
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    var nome = req.body.nome;
    var password = req.body.password;
    var password1 = req.body.password1;
    var email_ = req.body.email;
   var tipo_="admin";

    

   var token = req.headers.token;
    const decode = jwt.verify(token, "palavradificil");
    if (decode.tipo!="admin"){
        return res.status(401).send({ messagem: 'sem permissões' })
    }
    // check if any field is not empty

    if (nome || password || email_ || tipo_) {

    } else {
        return res.status(400).send({ messagem: 'Erro de campos' })
    }

    // check if both passwords are the same 

    if (password == password1) {

    } else {
        return res.status(400).send({ messagem: 'Passwords nao coincidem' })
    }




    //function to hash password
    const hash = bcrypt.hashSync(password, 10);
    
    database.run(`INSERT INTO Users(Nome,Password,Email,Tipo,Nif) VALUES(?,?,?,?)`, [nome, hash, email_, tipo_], function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id

    });
    database.close();
    //return message
    return res.status(201).send({ messagem: 'Criado com sucesso' })
});

// delete admins
router.delete('/delete_admin',login, async (req, res, next) => {
    //set variables
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    var id_admin = req.query.idAdmin;
    var token = req.headers.token;
    const decode = jwt.verify(token, "palavradificil");
    if (decode.tipo!="admin"){
        return res.status(400).send({ messagem: 'sem permissões' })
    }
    database.run(`DELETE FROM Users WHERE Id_user = ? `, [id_admin], function (err) {
        
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id

    });
    database.close();
    //return message
    return res.status(201).send({ messagem: 'administrador criado' })

});



module.exports = router;