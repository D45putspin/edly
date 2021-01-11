const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const login = require('../midlleware/login');
const multer = require('multer');
router.get('/top_stores', login, async (req, res, next) => {
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    let sql = `SELECT * FROM Loja  ORDER BY ranking desc LIMIT 3`;
    var nomes = [];
    var ids = []
    const decode = jwt.verify(req.headers.token, "palavradificil");
    var top1=0,top2=0,top3=0;
    var idtop1,idtop2,idtop3;

    database.all(sql, (err, rows) => {
        if (err) {
            res.status(500).send({ error: "bd_error" })
        }
        if (rows) {
            rows.forEach((row) => {
                console.log(row.Nome)
            


            });
            
            res.status(200).send({ nome: nomes, id: ids })
        }
        else { res.status(404).send({ message: "No_registry" }) }
    });
    database.close();
    return
});

module.exports = router;