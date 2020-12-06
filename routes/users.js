const express =  require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt= require('bcrypt');

var database = new sqlite3.Database('test.db', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("OKkk");
    }
});
router.post('/register',async(req, res, next) => {
    
    var nome= req.body.nome;
    var password= req.body.pass;
    const hash = bcrypt.hashSync(password, 10);
    console.log(nome,password,hash)
    database.run(`INSERT INTO Utilizador(nome,password) VALUES(?,?)`, [nome,hash], function(err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        
      });
      
      return res.status(200).send({messagem:'funcionou CARALHO'})
});
module.exports = router;