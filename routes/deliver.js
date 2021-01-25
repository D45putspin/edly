const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const login = require('../midlleware/login');
const jwt = require('jsonwebtoken');
router.post('/criar-deliver', login, async (req, res, next) => {
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    let iduserCriouEncomeda = req.body.iduserCriou;
    let iduserPegouPaDeliver = req.body.iduserPegou;
    let idEncomenda = req.body.idEncomenda;
    //send to a function to update table encomendas
    updateencomenda(database, idEncomenda);
    database.run(`INSERT INTO Entregas(Id_user,Id_user_deliver,Id_encomenda,estado) values(?,?,?,?)`, [iduserCriouEncomeda, iduserPegouPaDeliver, idEncomenda, "onDeliver"], function (err) {
        if (err) {
            return console.log(err.message);
        }


    });
    database.close();
    return res.status(201).send({ messagem: 'Criado deliver' })



});
function updateencomenda(database, nrencomenda) {
    database.run(` UPDATE Encomendas SET state= 'onDeliver' WHERE nr_encomenda=?`, [nrencomenda], function (err) {
        if (err) {
            return console.log(err.message);
        }


    });



}

router.put('/fechar-deliver', login, async (req, res, next) => {
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });

    var id = req.query.id;
    var nrEncomenda = req.query.nrEncomenda;

    let sql = `UPDATE Entregas SET Estado="done" WHERE Id_entrega = ?`;

    console.log(nrEncomenda);
    updateencomendafech(database, nrEncomenda);
    database.all(sql, [id], (err, rows) => {
        if (err) {
            res.status(500).send({ error: err.message })
        }
        else {
            if (rows) {
                rows.forEach((row) => {

                });

                res.status(201).send({ message: "successfully_edited" })
            }
            else { res.status(400).send({ message: "No_registry" }) }
        }
    });


    database.close();
    return



})
function updateencomendafech(database, nrencomenda) {
    database.run(` UPDATE Encomendas SET state= 'done' WHERE Nr_encomenda=?`, [nrencomenda], function (err) {
        if (err) {
            return console.log(err.message);
        }


    });



}
router.get('/listar_encomendas', login, async (req, res, next) => {
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {

        }
    });

    var token = req.headers.token;
    const decode = jwt.verify(token, "palavradificil");

    if (decode.tipo == "condutor") {




        // select data from users where id user is equal in Encomendas and users, and id produto is equal in encomendas or produto
        let sql = `SELECT u.Nome, u.Tipo, e.Nr_encomenda, e.Id_encomenda, e.state,p.Nome_produto,p.Preco_produto
        FROM Users  AS u 
        INNER JOIN Encomendas AS e
        INNER JOIN Produto AS p
        ON e.Id_user = u.Id_user AND  e.Id_produto = p.Id_produto
        WHERE e.state='awaiting' `;

        var arraynome = [];
        var arrayTipo = [];
        var arrayNrEncomenda = [];
        var arrayIdEncomenda = [];
        var arraystate = [];
        var arrayNomeProd = [];
        var arrayprecoProd = [];

        database.all(sql, (err, rows) => {
            if (err) {

            }
            if (rows) {
                rows.forEach((row) => {
                    //send data to array 
                    arraynome.push(row.Nome);
                    arrayTipo.push(row.Tipo);
                    arrayNrEncomenda.push(row.Nr_encomenda);
                    arrayIdEncomenda.push(row.Id_encomenda);
                    arraystate.push(row.state);
                    arrayNomeProd.push(row.Nome_produto);
                    arrayprecoProd.push(row.Preco_produto);
                });

                res.status(200).send({ nome: arraynome, tipo: arrayTipo, nrEncomenda: arrayNrEncomenda, idEncomenda: arrayIdEncomenda, state: arraystate, NomeProduto: arrayNomeProd, preco: arrayprecoProd })
            }
            else { res.status(400).send({ message: "sem nenhum registro" }) }
        });
    } 
    else { res.status(401).send({ message: "erro de user" }) }
    database.close();

})
module.exports = router;