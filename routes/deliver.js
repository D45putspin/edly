const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const login = require('../midlleware/login');
const jwt = require('jsonwebtoken');
router.post('/criar-deliver',   async (req, res, next) => {
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    let iduserCriouEncomeda=req.body.iduserCriou;
    let iduserPegouPaDeliver=req.body.iduserPegou;
    let idEncomenda=req.body.idEncomenda;


    database.run(`INSERT INTO Entregas(Id_user,Id_user_deliver,Id_encomenda,estado) values(?,?,?,?)`, [iduserCriouEncomeda, iduserPegouPaDeliver, idEncomenda,"onDeliver"], function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id

    });
    database.close();
    return res.status(201).send({ messagem: 'Criado deliver' })



});

router.put('/fechar-deliver/:id_deliver',async(req,res,next)=>{
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    var data = req.params.id_deliver;
    var id = data.replace("id_deliver=", "");
    let sql = `UPDATE Entregas SET Estado="done" WHERE Id_entrega = ?`;



    database.all(sql, [id], (err, rows) => {
        if (err) {
            res.status(500).send({ error: err.message })
        }
        else {
            if (rows) {
                rows.forEach((row) => {
                    console.log(
                        "sucesso!")
                        ;
                });

                res.status(200).send({ message: "successfully_edited" })
            }
            else { res.status(400).send({ message: "No_registry" }) }
        }
    });


database.close();
return



})
module.exports = router;