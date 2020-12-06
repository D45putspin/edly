const express =  require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt= require('bcrypt');
const jwt=require("jsonwebtoken");
var database = new sqlite3.Database('edly.db', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("OK");
    }
});
router.post('/register',async(req, res, next) => {
    //request body  assign
    var nome= req.body.nome;
    var password= req.body.password;
    var email_= req.body.email;
    var nif_= req.body.nif;
    var morada_=req.body.morada;
    var cod_postal_=req.body.cod_post;
    var cidade_=req.body.cidade;
    var tipo_=req.body.tipo;





    const hash = bcrypt.hashSync(password, 10);
    console.log(nome,password,hash)
    database.run(`INSERT INTO Users(Nome,Password,Email,NIF,Morada,Cod_postal,Cidade,Tipo) VALUES(?,?,?,?,?,?,?,?)`, [nome,hash,email_,nif_,morada_,cod_postal_,cidade_,tipo_], function(err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        
      });
      
      return res.status(200).send({messagem:'funcionou CARALHO'})
});
router.post('/login',async(req, res, next) => {
    var email_=req.body.email;
    var password=req.body.password;

    var sql = 'SELECT * FROM Users WHERE email = ?';
    database.get(sql, [email_], 
        async function (err, row) {
            if (err) {
                res.status(500).send({message: "erro 500"})
            }
            //if found email on DB, check if password is equal
            if (row) {
                //check password
                
                const checkPass = await bcrypt.compareSync(password, row.Password);
                console.log(password);
                if (checkPass) {
                    console.log(row.Id_user + " ..." + row.Email + " ... " + row);
                   
                    const token = jwt.sign({
                        id_user: row.Id_user,
                        email:row.email
                    }, 'palavradificil',{
                        expiresIn:"5h"
                    })
                    res.status(200).send({message: "Login com sucesso",token:token})
                } else {
                    res.status(400).send({message: "campos errados"})
                }
            } else {
                res.status(400).send({message: "erro nao encontrou"})
            }
        }
    )
});
module.exports = router;