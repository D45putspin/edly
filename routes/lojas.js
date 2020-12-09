const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

var database = new sqlite3.Database('edly.db', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("OK");
    }
});

router.post('/verificar_lojas', async (req, res, next) => {
    var id = req.body.id;
    var sql = 'SELECT COUNT(*) AS contalojas FROM Loja WHERE id_empresa = ?';
    var z=0;
    //init login function (checks if email exists, then compare bdpassword with sent one )
    database.get(sql, [id],
        async function (err, row) {
            if (err) {
                res.status(500).send({ message: "erro 500" })
            }

            if (row) {
                
                console.log("encontrou loja");
                ;



                console.log("loja encontradas->"+row.contalojas)
                res.status(200).json({ message:row.contalojas })
            } else {
                console.log("não encontrou loja");
                console.log(id);
                res.status(200).send({ message: "sem lojas" })
            }
        });
});
router.post('/listar_lojas',async(req,res,next) => {
    
    var id = req.body.id;
    let sql = `SELECT * From Loja WHERE id_empresa = ?`;
    var nomes = [ ];
    var tipos = [ ];
    database.all(sql, [id], (err, rows) => {
      if (err) {
        
      }
      if(rows){
      rows.forEach((row) => {
        console.log(row.Nome);
        nomes.push(row.Nome);
        tipos.push(row.tipo);
      });
      res.status(200).send({ message:nomes, tipos:tipos })}
      else {res.status(200).send({ message:"sem nenhum registro" })}
    });



})

// login 

module.exports = router;