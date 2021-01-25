const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const login = require('../midlleware/login');
const multer = require('multer');
router.get('/stores', login, async (req, res, next) => {
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    var ids = req.query.getTop;
    // checks if is all stores or only top ones
    if (ids == "yes") {
        var sql = `SELECT * FROM Loja  ORDER BY ranking desc LIMIT 3`;
    }
    else {
         var sql = `SELECT * FROM Loja  ORDER BY ranking asc`;
    }
    var nomes = [];
    var ids = [];
    database.all(sql, (err, rows) => {
        if (err) {
            res.status(500).send({ error: "bd_error" })
        }
        if (rows) {
            rows.forEach((row) => {
                //push data to arrays 
                nomes.push(row.Nome);
                ids.push(row.Id_loja)


            });
            //send arrays
            res.status(200).send({ nome: nomes, id: ids })
        }
        else { res.status(400).send({ message: "No_registry" }) }
    });
    database.close();
    return
});
















//function to get a rangom product image from a given store id
router.get('/image', login, async (req, res, next) => {
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });

    let sql = `SELECT * FROM Produto  WHERE Id_loja = ? ORDER BY RANDOM () Limit 1 `;
    var ids = req.query.id;


    database.all(sql, ids, (err, rows) => {
        if (err) {
            console.log("erroimagem");
            res.status(500).send({ error: "bd_error" })
        }
        else {
            if (rows) {
                console.log("aqui foi um " + ids);
                console.log("----");
                console.log("existe imagem");
                console.log(rows);
                rows.forEach((row) => {
                    console.log(row.image);
                    res.status(200).send({ nome_ficheiro: row.image })

                });


            }
            else {
                console.log("n existe");
                res.status(404).send({ message: "No_registry" })
            }
        }
    });
    database.close();
    return
});
module.exports = router;