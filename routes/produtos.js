const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const login = require('../midlleware/login');
const jwt = require('jsonwebtoken');
var resp;


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const uploads = multer({ storage: storage });
const bodyParser = require('body-parser');


router.post('/criar-produtos', login, uploads.single('produto_imagem'), async (req, res, next) => {
    //set variables
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    
    var nome_produto_ = req.body.nome_produto;
    var id_empresa_ = req.body.id_empresa;
    var tipo_prod_ = req.body.tipo;
    var preco_prod = req.body.preco;
    var image_ = req.file.filename;
    var id_loja = req.body.id;





    var sql = `SELECT * FROM Loja WHERE Id_loja = ? `;
    database.all(sql, [id_loja], (err, rows) => {
        if (err) {

        }
        if (rows!="") {
            inputproducts(nome_produto_,id_empresa_,tipo_prod_,preco_prod,image_,id_loja,database)
            return res.status(201).send({ messagem: 'Criado Produto' })
        }
        else { return res.status(400).send({ messagem: 'loja não existe' })}

    });

    
    database.close();
    



});
function inputproducts(nome, id_empresa,tipo_produto,preco_produto,image,id_loja,database) {
    database.run(`INSERT INTO Produto(Nome_produto,Id_empresa,Tipo_produto,Preco_produto,image,Id_loja) values(?,?,?,?,?,?)`, [nome, id_empresa, tipo_produto, preco_produto, image, id_loja], function (err) {
        if (err) {
          
        }
        

    });

}

router.get('/get-products', login, async (req, res, next) => {
    //set variables
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });


    const decode = jwt.verify(req.headers.token, "palavradificil");
    var id_empresa_ = decode.id_user;
    var idrl = req.query.id_loja;


    var nomes = [];
    var descricoes = [];
    var precos = [];
    var urls = [];

    if (decode.Tipo == "empresa") {
        var sql = `SELECT * FROM Produto WHERE id_empresa = ? AND id_loja = ?`;
        database.all(sql, [id_empresa_, idrl], (err, rows) => {
            if (err) {
                res.status(500).send({ error: "erro na base de dados" })
            }
            if (rows) {
                rows.forEach((row) => {
                  
                    nomes.push(row.Nome_produto);
                    descricoes.push(row.Tipo_produto);
                    precos.push(row.Preco_produto);
                    urls.push(row.image);

                });
                
                res.status(200).send({ nome: nomes, url: urls, descricao: descricoes, preco: precos })
            }
            else { res.status(400).send({ message: "sem nenhum registo" }) }
        });
    } else {
       
        var sql = `SELECT * FROM Produto WHERE id_loja = ?`;
        database.all(sql, idrl, (err, rows) => {
            if (err) {
                res.status(500).send({ error: "erro na base de dados" })
            }
            if (rows) {
                rows.forEach((row) => {
                    
                    nomes.push(row.Nome_produto);
                    descricoes.push(row.Tipo_produto);
                    precos.push(row.Preco_produto);
                    urls.push(row.image);

                });
                
                res.status(200).send({ nome: nomes, url: urls, descricao: descricoes, preco: precos })
            }
            else { res.status(400).send({ message: "sem nenhum registo" }) }
        });
    }

    database.close();
    return
});
router.delete('/delete_product',login, async (req, res, next) => {
    //set variables
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    var id_produto = req.query.idprod;






    database.run(`DELETE FROM Produto WHERE Id_produto = ? `, [id_produto], function (err) {

        if (err) {
            return console.log(err.message);
        }
     

    });
    database.close();
    return res.status(200).send({ messagem: 'Produto eliminado' })

});



router.put('/alterar_info_produto', login,async (req, res, next) => {

    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    var id = req.query.id;
    var Nome_produto = req.body.nomeProduto;
    var Tipo_produto = req.body.tipoProduto;
    var Preco_produto = req.body.precoProduto;





    let sql = `UPDATE Produto SET Nome_produto=?,Tipo_produto=?,Preco_produto=? WHERE Id_Produto = ?`;



    database.all(sql, [Nome_produto, Tipo_produto, Preco_produto, id], (err, rows) => {
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
});

module.exports = router;
