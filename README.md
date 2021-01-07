# Descrição

 plataforma de entrega de comida, que permite pedir comida dos seus 
 restaurantes locais preferidos com apenas alguns cliques.


# Tecnologias utilizadas


```markdown
HTML
JavaScript
CSS
Bootstrap
NodeJs
SQLite
```
# Registo :
```markdown
- A todos os utilizadores é atribuido um "tipo" de utilizadore aquando a criação da conta.
- As contas com o tipo "empresa" e "condutor" necessitam de autorização de um administrador após criada.
- As contas de Administrador ,  estas, só podem ser criadas por um Super-Admin que controla o sistema todo.
```

# Log-In:
```markdown
- A password é criptografada e comparada com a que está na base de dados ( esta tambem criptografada)
- A Cada login é gerado um token Unico  de segurança, o qual é utilizado para fazer todas as verificações do projeto
- O Token expira passado 5 horas do Log-in .
```

# Funções:


###  Registo Front-end:
```js
 $.ajax({
        url: 'http://localhost:3000/user/register',
        type: 'POST',
        cache: false,
        data: { nome: nome_, password: password_, password1: password1_, email: email_, nif: nif_, morada: morada_, cod_postal: cod_postal_, cidade_: cidade_, tipo: tipo_ },
        success: function (data) {
          window.location.href = "../edly/login.html";
        }
        , error: function (jqXHR, textStatus, err) {
          window.alert('text status ' + textStatus + ', err ' + err)
          window.alert(jqXHR.responseText);
        }
      })
```
      
### Registo Back-end:

```js
database.run(`INSERT INTO Users(Nome,Password,Email,NIF,Morada,Cod_postal,Cidade,Tipo,tipo_veic,matricula,aproval,foto_empresa) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`, [nome, hash, email_, nif_, morada_, cod_postal_, cidade_, tipo_, veiculo_, matricula_, status, image_], function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id

    });
    database.close();
    return res.status(201).send({ messagem: 'Criado com sucesso' })
});
```

### Login Front-end:
```js
 $.ajax({
                url: 'http://localhost:3000/user/login',
                type: 'POST',
                cache: false,
                data: { email: y, password: x },
                success: function (data) {
                    $('#element').text(data.message);
                    document.cookie = "token = " + data.message + ";secure";
                    window.location.href = "index.html";

                }
                , error: function ( jqXHR, textStatus, err) {
                    var error= jQuery.parseJSON(jqXHR.responseText);
                    console.log(error.message);
                    console.log(textStatus);
                    console.log(err);
                    notiferror(error.message);
                 
                   
                
                
                }
            })
        });
```
### Login Back-end:
```js
var sql = 'SELECT * FROM Users WHERE Email = ?';
    //init login function (checks if email exists, then compare bdpassword with sent one )
    database.get(sql, [email_],
        async function (err, row) {
            if (err) {
                res.status(500).send({ message: "erro 500" })
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
                        console.log("Y");
                        res.status(200).json({ message: token });
                    }
                    else{
                        res.status(403).json({ message: "need_activation"});
                   
                    }
                } else {
                    res.status(403).json({ message: "wrong_fields" });
                }
            } else {
                res.status(400).send({ message: "not_found" });
            }
        }
    )
    database.close();
});
```
