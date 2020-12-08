const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
var database = new sqlite3.Database('edly.db', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("OK");
    }
});

router.post('/verificar_lojas', async (req, res, next) => {
    var id = req.body.id;
    var sql = 'SELECT * FROM Loja WHERE id_empresa = ?';
    
    //init login function (checks if email exists, then compare bdpassword with sent one )
    database.get(sql, [id],
        async function (err, row) {
            if (err) {
                res.status(500).send({ message: "erro 500" })
            }

            if (row) {
                //check password
                //check if password is == bdpassword
                console.log("aqui 1");



                console.log("loja encontrada")
                res.status(200).json({ message:"cc" })
            } else {
                console.log("aqui2");
                res.status(200).send({ message: "sem lojas" })
            }
        });
});

// login 

module.exports = router;