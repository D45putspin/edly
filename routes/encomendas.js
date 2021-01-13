const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const login = require('../midlleware/login');
const multer = require('multer');
router.get('/nr_last_order', async (req, res, next) => {
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    let sql = `SELECT * FROM Encomendas  ORDER BY Nr_encomenda desc LIMIT 1`;
    var nr;




    database.all(sql, (err, rows) => {
        if (err) {
            res.status(500).send({ error: "bd_error" })
        }
        if (rows) {
            rows.forEach((row) => {
                nr = row.Nr_encomenda
            });

            res.status(200).send({ last_nr_order: nr })
        }
        else { res.status(404).send({ message: "No_registry" }) }
    });
    database.close();
    return
});
router.post('/new_order', async (req, res, next) => {
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    var id_prod = req.body.idProduto;
    var id_user = req.body.idUser;
    var preco = req.body.precoProduto;
    var nr_encomenda = req.body.nr_encomenda;
    database.run(`INSERT INTO Encomendas(Id_produto,Preco_total_produtos,Id_user,Nr_encomenda,state) values(?,?,?,?,?)`, [id_prod, preco, id_user, nr_encomenda, "awaiting"], function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id

    });
    database.close();
    return res.status(201).send({ messagem: 'order_created' })

});
router.delete('/delete_client_order/', async (req, res, next) => {
    //set variables
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    var nrencomenda = req.body.nrEncomenda;
    console.log(id);
    let sql = `DELETE FROM Encomendas WHERE Nr_encomenda = ?`;




    database.all(sql, nrencomenda, (err, rows) => {
        if (err) {
            res.status(500).send({ error: "bd_error" })
        }
        if (rows) {


            res.status(200).send({ message: "successfully_deleted" })
        }
        else { res.status(400).send({ message: "No_registry" }) }
    });
    database.close();
    return
});
router.delete('/delete_order_item/', async (req, res, next) => {
    //set variables
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    var nr_encomenda = req.body.nrEncomenda;
    var id_prod = req.body.idProduto;

    




    database.run(`DELETE FROM Encomendas WHERE Nr_encomenda = ? AND Id_produto = ?`, [nr_encomenda,id_prod], function (err) {
        
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id

    });
    database.close();
    return res.status(201).send({ messagem: 'order_item_deleted' })

});

module.exports = router;