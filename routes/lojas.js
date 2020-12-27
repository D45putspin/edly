const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const querystring = require('querystring');
const sqlite3 = require('sqlite3').verbose();
const login = require('../midlleware/login');
const jwt = require('jsonwebtoken');


router.get('/verificar_lojas/:id', login, async (req, res, next) => {
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("");
        }
    });

    var token = req.headers.token;
    const decode = jwt.verify(token, "palavradificil");
    console.log(decode.tipo);
    if (decode.tipo == "empresa") {
        var idrl = req.params.id;
        var id = idrl.replace("id=", "");
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
                    console.log("loja encontradas->" + row.contalojas)
                    res.status(200).json({ message: row.contalojas }/*ok cod200*/)
                } else {
                    console.log("não encontrou loja");

                    res.status(204).send({ message: "sem lojas" }/*no content cod204*/)
                }
            });
    }
    else { res.status(401).send({ message: "erro de user" }) /*unauthorized cod401*/ }
    database.close();
});
router.get('/listar_lojas/:id', login, async (req, res, next) => {
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("");
        }
    });

    var token = req.headers.token;
    const decode = jwt.verify(token, "palavradificil");
    
    if (decode.tipo == "empresa") {


        var idrl = req.params.id;
        var id= idrl.replace("id=", "");
        console.log(idrl);
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

                    nomes.push(row.Nome);

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
database.close();

})


router.post('/inserir_lojas', login, async (req, res, next) => {
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("");
        }
    });

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
              

            });

            return res.status(200).send({ messagem: 'funcionou' })
        }
        else { return res.status(200).send({ messagem: 'não pode associar outras empresas que não a sua ' }) }
    }
    else { return res.status(200).send({ messagem: 'para aceder a esta funcionalidade é necessário ser empresa' }) }
    database.close();
});

module.exports = router;