const express =  require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const multer=require('multer');
const login = require('../midlleware/login');
const jwt = require('jsonwebtoken');



const storage = multer.diskStorage({
destination: function(req,file,cb){
    cb(null,'./uploads/');
},
filename: function(req,file,cb){
    cb(null,file.originalname);
}
})
const uploads=multer({storage :storage});
const bodyParser = require ('body-parser');

var database = new sqlite3.Database('edly.db', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("OK");
    }
});
router.post('/criar-produtos',login,  uploads.single('produto_imagem'), async (req, res, next) => {
    //set variables
    console.log(req.file);
    var nome_produto_ = req.body.nome_produto;
    var id_empresa_ = req.body.id_empresa;
    var tipo_prod_=req.body.tipo;
    var preco_prod=req.body.preco;
    var image_=req.file.filename;
    var id_loja= req.body.id;
    database.run( `INSERT INTO Produto(Nome_produto,Id_empresa,Tipo_produto,Preco_produto,image,Id_loja) values(?,?,?,?,?,?)`, [nome_produto_, id_empresa_, tipo_prod_, preco_prod,image_, id_loja], function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id

    });
    database.close();
    return res.status(201).send({ messagem: 'Criado Produto' })


});
router.get('/get-products/:id_loja',login,async (req, res, next) => {
    //set variables
    
    let sql = `SELECT * FROM Produto WHERE id_empresa = ? AND id_loja = ?`;
  
   const decode = jwt.verify(req.headers.token,"palavradificil");
   var id_empresa_=decode.id_user;
   var idrl = req.params.id_loja;
    var id_loja = idrl.replace("id=", "");
    console.log(id_empresa_);
    console.log(id_loja);
    var nomes=[ ];
    var descricoes=[ ];
    var precos=[ ];
    var urls=[];

    database.all(sql, [id_empresa_,id_loja], (err, rows) => {
        if (err) {
            res.status(500).send({ error: "erro na base de dados"})
        }
        if (rows) {
            rows.forEach((row) => {
                console.log(row.Nome_produto);
                nomes.push(row.Nome_produto);
                descricoes.push(row.Tipo_produto);
                precos.push(row.Preco_produto);
                urls.push(row.image);
                
            });
            console.log(urls+","+nomes+","+descricoes+","+precos)
            res.status(200).send({ nome: nomes, url:urls,descricao:descricoes,preco:precos})
        }
        else { res.status(400).send({ message: "sem nenhum registo" }) }
    });
    database.close();
    return
});






module.exports = router;
