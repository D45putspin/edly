const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const querystring = require('querystring');
const sqlite3 = require('sqlite3').verbose();
const login = require('../midlleware/login');
const jwt = require('jsonwebtoken');

//falta verificações de logins!!!

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
    var nif_ = req.body.nif;
    var morada_ = req.body.morada;
    var cod_postal_ = req.body.cod_postal;
    var cidade_ = req.body.cidade_;
    var tipo_ = "admin"
    var veiculo_ = req.body.veiculo;
    var matricula_ = req.body.matricula;

    // check type of user for admin can permission entrance

    if (tipo_ == "condutor" || tipo_ == "empresa") {
        var status = "pending";
        if (tipo_ == "empresa") { var image_ = req.file.filename; } else { var image_ = "" }
    } else {
        var status = "acepted"
        var image_ = ""
    }

   

    // check if any field is not empty

    if (nome || password || email_ || nif_ || morada_ || cod_postal_ || cidade_ || tipo_ || veiculo_ || matricula_) {

    } else {
        return res.status(400).send({ messagem: 'Erro de campos' })
    }

    // check if both passwords are the same 

    if (password == password1) {

    } else {
        return res.status(400).send({ messagem: 'Passwords nao coincidem' })
    }

    // check if nif have 9 numbers
    if (nif_.length == 9) {

    } else {
        return res.status(400).send({ messagem: 'O nif nao contem 9 numeros' })
    }

    // check if first number of nif is valid and the rest too
    if (nif_.match("[1,2,5]{1}[0-9]{8}")) {

    } else {
        return res.status(400).send({ messagem: 'Nif incorreto' })
    }

    // check if postal code is valid
    if (cod_postal_.match("[0-9]{4}[-]{1}[0-9]{3}")) {
    } else {
        return res.status(400).send({ messagem: 'Codigo postal incorreto' })
    }




    const hash = bcrypt.hashSync(password, 10);
    console.log(nome, password, hash)
    database.run(`INSERT INTO Users(Nome,Password,Email,NIF,Morada,Cod_postal,Cidade,Tipo,tipo_veic,matricula,aproval,foto_empresa) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`, [nome, hash, email_, nif_, morada_, cod_postal_, cidade_, tipo_, veiculo_, matricula_, status, image_], function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id

    });
    database.close();
    return res.status(201).send({ messagem: 'Criado com sucesso' })
});

// delete admins
router.delete('/delete_admin', async (req, res, next) => {
    //set variables
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    var id_admin = req.query.idAdmin;

    




    database.run(`DELETE FROM Users WHERE Id_user = ? `, [id_admin], function (err) {
        
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id

    });
    database.close();
    return res.status(201).send({ messagem: 'administrador criado' })

});



module.exports = router;