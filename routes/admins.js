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


module.exports = router;