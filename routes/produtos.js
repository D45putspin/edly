const express =  require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const multer=require('multer');




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
const login = require('../midlleware/login');
var database = new sqlite3.Database('edly.db', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("OK");
    }
});
router.post('/criar-produtos',  uploads.single('produto_imagem'), async (req, res, next) => {
    //set variables
    console.log(req.file);
    var nome_produto_ = req.body.nome_produto;
    var id_empresa_ = req.body.id_empresa;
    var tipo_prod_=req.body.tipo;
    var preco_prod=req.body.preco;
    var image_=req.file.path;
    var id_loja= req.body.id;
    database.run( `INSERT INTO Produto(Nome_produto,Id_empresa,Tipo_produto,Preco_produto,image,Id_loja) values(?,?,?,?,?,?)`, [nome_produto_, id_empresa_, tipo_prod_, preco_prod,image_, id_loja], function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id

    });

    return res.status(200).send({ messagem: 'funcionou' })
});
module.exports = router;
