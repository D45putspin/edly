const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const login = require('../midlleware/login');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads_empresa/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const uploads = multer({ storage: storage });

router.post('/register', uploads.single('img_empresa'), async (req, res, next) => {
    //request body  assign
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    console.log(req.file);
    var nome = req.body.nome;
    var password = req.body.password;
    var password1 = req.body.password1;
    var email_ = req.body.email;
    var nif_ = req.body.nif;
    var morada_ = req.body.morada;
    var cod_postal_ = req.body.cod_postal;
    var cidade_ = req.body.cidade_;
    var tipo_ = req.body.tipo;
    var veiculo_ = req.body.veiculo;
    var matricula_ = req.body.matricula;
    
    // check type of user for admin can permission entrance

    if (tipo_ == "condutor" || tipo_ == "empresa") {
        var status = "pending";
        if (tipo_ == "empresa") { var image_ = req.file.filename; } else { var image_ = "" }
    } else {
        var status = "acepted"
        var image_ = ""
    }

    // check if user is valid
    if (tipo_ == "condutor" || "empresa" || "cliente") {

    } else {
        return res.status(400).send({ messagem: 'O user nao é valido' })
    }

    // check if any field is not empty

    if (nome || password || email_ || nif_ || morada_ || cod_postal_ || cidade_ || tipo_ || veiculo_ || matricula_) {

    } else {
        return res.status(400).send({ messagem: 'Erro de campos' })
    }

    // check if both passwords are the same 

    if (password == password1) {

    } else {
        return res.status(400).send({ messagem: 'Passwords nao coincidem' })
    }

    // check if nick have 9 numbers
    if (nif_.length == 9) {

    } else {
        return res.status(400).send({ messagem: 'O nif nao contem 9 numeros' })
    }

    // check if first number of nif is valid and the rest too
    if (nif_.match("[1,2,5]{1}[0-9]{8}")) {

    } else {
        return res.status(400).send({ messagem: 'Nif incorreto' })
    }

    // check if postal code is valid
    if (cod_postal_.match("[0-9]{4}[-]{1}[0-9]{3}")) {
    } else {
        return res.status(400).send({ messagem: 'Codigo postal incorreto' })
    }




    const hash = bcrypt.hashSync(password, 10);

    database.run(`INSERT INTO Users(Nome,Password,Email,NIF,Morada,Cod_postal,Cidade,Tipo,tipo_veic,matricula,aproval,foto_empresa) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`, [nome, hash, email_, nif_, morada_, cod_postal_, cidade_, tipo_, veiculo_, matricula_, status, image_], function (err) {
        if (err) {
            return console.log(err.message);
        }


    });
    database.close();
    return res.status(201).send({ messagem: 'Criado com sucesso' })
});
// login 
router.post('/login', async (req, res, next) => {
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    //set variables
    var email_ = req.body.email;
    var password = req.body.password;
    var sql = 'SELECT * FROM Users WHERE Email = ?';
    //init login function (checks if email exists, then compare bdpassword with sent one )
    database.get(sql, [email_],
        async function (err, row) {
            if (err) {
                res.status(500).send({ message: "bd_error" })
            }

            if (row) {
                //check password
                //check if password is == bdpassword
                const checkPass = await bcrypt.compareSync(password, row.Password);

                if (checkPass) {
                    //creates a token that is assigned to user
                    if (row.aproval != "pending") {
                        const token = jwt.sign({
                            id_user: row.Id_user,
                            email: row.Email,
                            tipo: row.Tipo,
                            nome: row.Nome
                        }, 'palavradificil', { expiresIn: '5h' });

                        res.status(201).json({ message: token });
                    }
                    else {
                        res.status(401).json({ message: "need_activation" });

                    }
                } else {
                    res.status(400).json({ message: "wrong_fields" });
                }
            } else {
                res.status(400).send({ message: "not_found" });
            }
        }
    )
    database.close();
});


router.get('/pendentes', login, async (req, res, next) => {
    //set variables
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    let sql = `SELECT * FROM Users WHERE aproval = ?`;
    var nomes = [];
    var ids = []

    var token = req.headers.token;
    const decode = jwt.verify(token, "palavradificil");
    if (decode.tipo != "admin") {
        return res.status(401).send({ messagem: 'sem permissões' })
    }

    database.all(sql, "pending", (err, rows) => {
        if (err) {
            res.status(500).send({ error: "bd_error" })
        }
        if (rows) {
            rows.forEach((row) => {

                nomes.push(row.Nome);
                ids.push(row.Id_user);

            });

            res.status(200).send({ nome: nomes, id: ids })
        }
        else { res.status(400).send({ message: "No_registry" }) }
    });
    database.close();
    return
});
router.put('/acept_pending', login, async (req, res, next) => {
    //set variables
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    var id = req.query.id;
    var token = req.headers.token;
    const decode = jwt.verify(token, "palavradificil");
    if (decode.tipo != "admin") {
        return res.status(400).send({ messagem: 'sem permissões' })
    }

    let sql = `UPDATE Users SET aproval= 'acepted'  WHERE id_user = ?`;



    database.all(sql, id, (err, rows) => {
        if (err) {
            res.status(500).send({ error: "bd_error" })
        }
        if (rows) {
            rows.forEach((row) => {


            });

            res.status(201).send({ message: "successfully_edited" })
        }
        else { res.status(400).send({ message: "No_registry" }) }
    });
    database.close();
    return
});

router.delete('/delete_pending/', login, async (req, res, next) => {
    //set variables
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    var token = req.headers.token;
    const decode = jwt.verify(token, "palavradificil");
    if (decode.tipo != "admin") {
        return res.status(401).send({ messagem: 'sem permissões' })
    }
    var id = req.query.id;

    let sql = `DELETE FROM Users WHERE id_user = ?`;




    database.all(sql, id, (err, rows) => {
        if (err) {
            res.status(500).send({ error: "bd_error" })
        }
        if (rows) {


            res.status(200).send({ message: "successfully_deleted" })
        }
        else { res.status(400).send({ message: "No_registry" }) }
    });
    database.close();
    return
});

router.put('/alterar_info_conta', login, async (req, res, next) => {

    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    var id = req.query.id;
    var Nome = req.body.nome;
    var Cod_postal = req.body.cp;
    var Morada = req.body.morada;
    var Cidade = req.body.cidade;
    var TipoVeic = req.body.Tipo_veic;
    var Matricula = req.body.matricula;


    //var verif = verifylogin(arrayobj[7], arrayobj[1]);
    //if (verif==true){
    const decode = jwt.verify(req.headers.token, "palavradificil");
    if (decode.tipo == 'cliente' || decode.tipo == 'empresa') {
        var sql = `UPDATE Users SET Nome=?,Cod_postal=?,Morada=?,Cidade=? WHERE Id_user = ?`;
        database.all(sql, [Nome, Cod_postal, Morada, Cidade, id], (err, rows) => {
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
    }
    else if (decode.tipo == 'condutor') {
        var sql = `UPDATE Users SET Nome=?,Email=?,Cod_postal=?,Morada=?,NIF=?,Cidade=?,matricula=?,tipo_veic=? WHERE Id_user = ?`;
        database.all(sql, [Nome, Cod_postal, Morada, Cidade, TipoVeic, Matricula, id], (err, rows) => {
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
    }



    // }

    database.close();
    return
});

router.delete('/delete_account', login, async (req, res, next) => {
    //set variables
    var database = new sqlite3.Database('edly.db', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
    var id = req.query.id;

    let sql = `DELETE FROM Users WHERE Id_user = ?`;
    //const decode = jwt.verify(req.headers.token, "palavradificil");
    // if (decode.tipo=='empresa'){
    deleteprodempresa(database, id, res, req);
    deletelojaempresa(database, id);
    //}


    database.all(sql, id, (err, rows) => {
        if (err) {
            res.status(500).send({ error: "bd_error" })
            console.log(err.message);
        }
        if (rows) {


            res.status(200).send({ message: "successfully_deleted" })
        }
        else { res.status(400).send({ message: "No_registry" }) }
    });
    database.close();
    return
});
function deleteprodempresa(database, id, res, req) {
    let sql = `DELETE FROM Produto WHERE Id_empresa = ?`;




    database.all(sql, id, (err, rows) => {

    });


}
function deletelojaempresa(database, id, res, req) {
    let sql = `DELETE FROM Loja WHERE Id_empresa = ?`;




    database.all(sql, id, (err, rows) => {

    });


}
module.exports = router;