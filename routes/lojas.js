const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const login = require('../midlleware/login');
const jwt = require('jsonwebtoken');
var database = new sqlite3.Database('edly.db', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("OK");
    }
});

router.post('/verificar_lojas', login, async (req, res, next) => {
    var token = req.body.token;
    const decode = jwt.verify(token, "palavradificil");
    if (decode.tipo == "empresa") {
        var id = req.body.id;
        var sql = 'SELECT COUNT(*) AS contalojas FROM Loja WHERE id_empresa = ?';
        var z = 0;
        //init login function (checks if email exists, then compare bdpassword with sent one )
        database.get(sql, [id],
            async function (err, row) {
                if (err) {
                    res.status(500).send({ message: "erro 500" })
                }

                if (row) {

                    console.log("encontrou loja");
                    ;



                    console.log("loja encontradas->" + row.contalojas)
                    res.status(200).json({ message: row.contalojas })
                } else {
                    console.log("não encontrou loja");
                    console.log(id);
                    res.status(200).send({ message: "sem lojas" })
                }
            });
    }
    else { res.status(200).send({ message: "erro de user" }) }
});
router.post('/listar_lojas', login, async (req, res, next) => {
    var token = req.body.token;
    const decode = jwt.verify(token, "palavradificil");

    if (decode.tipo == "empresa") {
        var id = req.body.id;
        let sql = `SELECT * From Loja WHERE id_empresa = ?`;
        var nomes = [];
        var tipos = [];
        var moradas = [];
        var cod_posts = [];
        database.all(sql, [id], (err, rows) => {
            if (err) {

            }
            if (rows) {
                rows.forEach((row) => {
                    console.log(row.Nome);
                    nomes.push(row.Nome);
                    console.log(row.Tipo);
                    tipos.push(row.Tipo);
                    moradas.push(row.Morada);
                    cod_posts.push(row.Cod_postal);
                });
                res.status(200).send({ nome: nomes, tipo: tipos, morada: moradas, cp: cod_posts })
            }
            else { res.status(200).send({ message: "sem nenhum registro" }) }
        });
    }
    else { res.status(200).send({ message: "erro de user" }) }


})

router.post('/verificar_lojas', login, async (req, res, next) => {
    var token = req.body.token;
    const decode = jwt.verify(token, "palavradificil");
    if (decode.tipo == "empresa") {
        var id = req.body.id;
        var sql = 'SELECT COUNT(*) AS contalojas FROM Loja WHERE id_empresa = ?';
        var z = 0;
        //init login function (checks if email exists, then compare bdpassword with sent one )
        database.get(sql, [id],
            async function (err, row) {
                if (err) {
                    res.status(500).send({ message: "erro 500" })
                }

                if (row) {

                    console.log("encontrou loja");
                    ;



                    console.log("loja encontradas->" + row.contalojas)
                    res.status(200).json({ message: row.contalojas })
                } else {
                    console.log("não encontrou loja");
                    console.log(id);
                    res.status(200).send({ message: "sem lojas" })
                }
            });
    }
    else { res.status(200).send({ message: "erro de user" }) }
});
router.post('/inserir_lojas', login, async (req, res, next) => {
    var token = req.body.token;
    const decode = jwt.verify(token, "palavradificil");
    if (decode.tipo == "empresa") {
        var id_empresa = req.body.id;
        var cod_postal_restaurante = req.body.cod_postal;
        var morada_restaurante = req.body.morada;
        var tipo_restaurante = req.body.tipo;
        var Nome_restaurante = req.body.nome;
        if (decode.id_user == id_empresa) {
            database.run(`INSERT INTO Loja(Cod_postal,Morada,Tipo,Id_empresa,Nome) VALUES(?,?,?,?,?)`, [cod_postal_restaurante, morada_restaurante, tipo_restaurante, id_empresa, Nome_restaurante], function (err) {
                if (err) {
                    return console.log(err.message);
                }
                // get the last insert id

            });

            return res.status(200).send({ messagem: 'funcionou' })
        }
        else { return res.status(200).send({ messagem: 'não pode associar outras empresas que não a sua ' }) }
    }
    else { return res.status(200).send({ messagem: 'para aceder a esta funcionalidade é necessário ser empresa' }) }

});

module.exports = router;