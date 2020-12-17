const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const login = require('../midlleware/login');
var database = new sqlite3.Database('edly.db', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("OK");
    }
});
router.post('/register', async (req, res, next) => {
    //request body  assign
    var nome = req.body.nome;
    var password = req.body.password;
    var email_ = req.body.email;
    var nif_ = req.body.nif;
    var morada_ = req.body.morada;
    var cod_postal_ = req.body.cod_post;
    var cidade_ = req.body.cidade;
    var tipo_ = req.body.tipo;
    var veiculo_ = req.body.veiculo;
    var matricula_ = req.body.matricula;
    




    const hash = bcrypt.hashSync(password, 10);
    console.log(nome, password, hash)
    database.run(`INSERT INTO Users(Nome,Password,Email,NIF,Morada,Cod_postal,Cidade,Tipo,tipo_veic,matricula) VALUES(?,?,?,?,?,?,?,?,?,?)`, [nome, hash, email_, nif_, morada_, cod_postal_, cidade_, tipo_, veiculo_, matricula_], function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id

    });

    return res.status(200).send({ messagem: 'funcionou' })
});
// login 
router.post('/login', async (req, res, next) => {
    //set variables
    var email_ = req.body.email;
    var password = req.body.password;
    var sql = 'SELECT * FROM Users WHERE email = ?';
    //init login function (checks if email exists, then compare bdpassword with sent one )
    database.get(sql, [email_],
        async function (err, row) {
            if (err) {
                res.status(500).send({ message: "erro 500" })
            }

            if (row) {
                //check password
                //check if password is == bdpassword
                const checkPass = await bcrypt.compareSync(password, row.Password);

                if (checkPass) {
                    //creates a token that is assigned to user
                    const token =jwt.sign({ id_user: row.Id_user,
                        email: row.Email,
                        tipo: row.Tipo,
                        nome:row.Nome }, 'palavradificil', { expiresIn:'5h'});
                    console.log("Y")
                    res.status(200).json({ message: token })
                } else {
                    res.status(400).json({ message: "campos errados" })
                }
            } else {
                res.status(400).send({ message: "erro nao encontrou" })
            }
        }
    )
});
module.exports = router;