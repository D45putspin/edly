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

# Utilizadores


```markdown
Cliente
Condutor
Empresa
Adminstrador
```

# Funçoes
 
 # Registo
 
  ### URL
  SERVER /user/register
  
  ### Metohod
  POST
  
  ### URL Params
  None
  
  ### Data Params
  ```markdown
  { nome, 
  password,
  password1, 
  email, 
  nif, 
  morada, 
  cod_postal, 
  cidade_, 
  tipo}
  ```
  ### Success Response
  ***Code:*** 201
  
  ***Content:*** { messagem: 'Criado com sucesso' }
  
  ### Error Response
  ***Code:*** 500
  
  ***Content:*** {}
  
  ### Sample Cell
  ```js
  "  $.ajax({
        url: 'http://localhost:3000/user/register',
        type: 'POST',
        cache: false,
        
        data: { nome: nome_,                                             password:password_,password1:password1_, email: email_, nif: nif_,    morada: morada_, cod_postal: cod_postal_, cidade_: cidade_, tipo:     tipo_ },
        success: function (data) {
          window.location.href = ""../edly/login.html"";
        }
        , error: function (jqXHR, textStatus, err) {
          window.alert('text status ' + textStatus + ', err ' + err)
          window.alert(jqXHR.responseText);
        }
      })
"
  ```
 # Login
 
  ### URL
  SERVER /user/login
  
  ### Metohod
  POST
  
  ### URL Params
  None
  
  ### Data Params
  ```markdown
  
  data: { email, password}
  
  ```
  ### Success Response
  ***Code:*** 200
  
  ***Content:*** { message: token }
  
  ### Error Response
  ***Code:*** 500
  
  ***Content:*** {}
  
  ***Code:*** 403
  
  ***Content:*** { message: "need_activation"}
  
  ***Code:*** 403
  
  ***Content:*** { message: "wrong_fields"}
  
  ***Code:*** 400
  
  ***Content:*** { message: "not_found"}
  
  ### Sample Cell
  ```js
  "  $.ajax({
                url: 'http://localhost:3000/user/login',
                type: 'POST',
                cache: false,
                data: { email: y, password: x },
                success: function (data) {
                    $('#element').text(data.message);
                    document.cookie = ""token = "" + data.message + "";secure"";
                    window.location.href = ""index.html"";

                }
                , error: function ( jqXHR, textStatus, err) {
                    var error= jQuery.parseJSON(jqXHR.responseText);
                    console.log(textStatus);
                    notiferror(error.message);
                  }
            })
"

  ```
  
  # Admin-pendentes
 
  ### URL
  SERVER /user/pendentes
  
  ### Metohod
  GET
  
  ### URL Params
  None
  
  ### Data Params
  None
  
  ### Success Response
  ***Code:*** 200
  
  ***Content:*** { message: nomeia }
  
  ### Error Response
  ***Code:*** 500
  
  ***Content:*** {}
  
  ***Code:*** 400
  
  ***Content:*** { message: "No_registry"}
  
  ### Sample Cell
  ```js
  " $.ajax({
            url: 'http://' + urlattime + '/user/pendentes',
            type: 'GET',
            cache: false,
            headers: { ""token"": tokenrl },


            success: function (data) {


                var nomes = data.nome;
                var ids = data.id;
                console.log(nomes);
                functiondisplay(nomes,ids);
               
            }
            , error: function (jqXHR, textStatus, err) {

                console.log(err, textStatus);
                console.log(jqXHR.responseText);
            }
        })

"
  ```
  
  # Admin-aceitar pendentes
 
  ### URL
  SERVER /user/acept_pending/id=
  
  ### Metohod
  PUT
  
  ### URL Params
  Ident
  
  ### Data Params
  None
  
  ### Success Response
  ***Code:*** 200
  
  ***Content:*** { message: ‘Successfully_edited’ }
  
  ### Error Response
  ***Code:*** 500
  
  ***Content:*** { error: "bd_error"}
  
  ***Code:*** 400
  
  ***Content:*** { message: "No_registry"}
  
  ### Sample Cell
  ```js
  "$.ajax({
                url: 'http://' + urlattime + '/user/acept_pending/id=' + ident,
                type: 'PUT',
                cache: false,
                headers: { ""token"": tokenrl },


                success: function (data) {
                    location.reload();


                }
                , error: function (jqXHR, textStatus, err) {

                    console.log(err, textStatus)
                }
            })
"

  ```
  
# Admin - Criar Admins
 
  ### URL
  SERVER /funcadmins/create_admin
  
  ### Metohod
  POST
  
  ### URL Params
  None
  
  ### Data Params
   ```markdown
    { nome, 
  password,
  password1, 
  email,}
   ```
  
  ### Success Response
  ***Code:*** 201
  
  ***Content:*** { message: ‘Criado com sucesso’ }
  
  ### Error Response
  ***Code:*** 400
  
  ***Content:*** { error: "erro de campos"}
  
  ***Code:*** 400
  
  ***Content:*** { message: "passwords nao coincidem"}
  
  ### Sample Cell
  ```js

  ```
  
 # Admin - Delete Admins
 
  ### URL
  SERVER /funcadmins/delete_admin
  
  ### Metohod
  POST
  
  ### URL Params
  None
  
  ### Data Params
   ```markdown
  idAdmin
   ```
  
  ### Success Response
  ***Code:*** 200
  
  ***Content:*** { message: ‘Administrador eliminado’ }
  
  ### Error Response
  ***Code:*** 500
  
  ***Content:*** {}
  
  ### Sample Cell
  ```js

  ```
  
 # Admin - Eliminar Pendentes
 
  ### URL
  SERVER /user/delete_pending
  
  ### Metohod
  POST
  
  ### URL Params
  None
  
  ### Data Params
   ```markdown
   ID
   ```
  
  ### Success Response
  ***Code:*** 200
  
  ***Content:*** { message: ‘successfully deleted’ }
  
  ### Error Response
  ***Code:*** 400
  
  ***Content:*** { error: "No_registry"}
  
  ### Sample Cell
  ```js
  "$.ajax({
                url: 'http://' + urlattime + '/user/delete_pending',
                type: 'DELETE',
                cache: false,
                data: { id: id },
                headers: { ""token"": tokenrl },


                success: function (data) {
                    location.reload();


                }
                , error: function (jqXHR, textStatus, err) {

                    console.log(err, textStatus)
                }
            })
"
  ```

 # Lojas - Verificar quantas lojas existem
 
  ### URL
  SERVER /loja/verificar_lojas
  
  ### Metohod
  GET
  
  ### URL Params
  ID
  
  ### Data Params
  None
  
  ### Success Response
  ***Code:*** 200
  
  ***Content:*** { message: row.contalojas }
  
  ### Error Response
  ***Code:*** 400
  
  ***Content:*** { message: ‘sem lojas’ }
  
  ***Code:*** 500
  
  ***Content:*** { message: ‘erro bd’ }
  
  ### Sample Cell
  ```js
  "$.ajax({
            url: 'http://' + urlattime + '/loja/verificar_lojas/id=' + ident,
            type: 'GET',
            cache: false,
            headers: { ""token"": tokenrl },



            success: function (data) {

                if (data.message != ""sem lojas"") {
                    document.getElementById(""numerodeloja"").innerHTML = data.message;
                    getlojas(ident, token, data.message);
                }

            }
            , error: function (jqXHR, textStatus, err) {

                console.log(err, textStatus)

            }

        })
"
  ```
  
 # Lojas -  Listar lojas
 
  ### URL
  SERVER /loja/verificar_lojas
  
  ### Metohod
  GET
  
  ### URL Params
  ID
  
  ### Data Params
  None
  
  ### Success Response
  ***Code:*** 200
  
  ***Content:*** {nome, tipo,morada,cod_post}
  
  ### Error Response
  ***Code:*** 400
  
  ***Content:*** { message: ‘sem nenhum registo’ }
  
  ***Code:*** 400
  
  ***Content:*** { message: ‘erro de user’ }
  
  ***Code:*** 500
  
  ***Content:*** { message: ‘erro bd’ }
  
  ### Sample Cell
  ```js
  "
        $.ajax({
            url: 'http://' + urlattime + '/loja/listar_lojas/id=' + ident,
            type: 'GET',
            cache: false,
            headers: { ""token"": tokenrl },


            success: function (data) {

                if (data.message != ""sem lojas"") {
                    var lojas = """" + data.nome;
                    var lojasingular = lojas.split(',');
                    var tipos = """" + data.tipo;
                    var tiposingular = tipos.split(',');
                    var moradas = """" + data.morada;
                    var moradasingular = moradas.split(',');
                    var codigos_postal = """" + data.cp;
                    var cpsingular = codigos_postal.split(',');
                    //verify if header isnt null
                    if (loja != null && loja != """") {
                        console.log(""nome"" + lojasingular[loja]);
                        $('#namelojaprodutos').append(`<h1 style=""font-size:70px;font-family: 'Ubuntu', sans-serif; color:#282828; font-weight: bold !important;"">${lojasingular[loja - 1]}</h1>`)
                        chamarprodutos(id, token);
                    }
                    else {
                        for (let i = 0; i < nr; i++) {

                            displaydata();                       }
                    }








                }

            }
            , error: function (jqXHR, textStatus, err) {

                console.log(err, textStatus)
            }
        })
"
  ```
  
 # Lojas -  Inserir lojas
 
  ### URL
  SERVER /loja/inserir_lojas
  
  ### Metohod
  POST
  
  ### URL Params
  None
  
  ### Data Params
  ```markdown
  {id,
  cod_postal,
  tipo,
  nome}
  ```
  
  ### Success Response
  ***Code:*** 200
  
  ***Content:*** {messagem: ‘criada com sucesso’}
  
  ### Error Response
  ***Code:*** 400
  
  ***Content:*** { message: ‘Não pode associar outras empresas que não a sua’ }
  
  ***Code:*** 400
  
  ***Content:*** { message: ‘para aceder a esta funcionalidade é necessário ser do tipo “empresa”’ }
  
  ***Code:*** 500
  
  ***Content:*** { message: ‘erro bd’ }
  
  ### Sample Cell
  ```js
  " $.ajax({
                url: 'http://' + urlattime + '/loja/inserir_lojas',
                type: 'POST',
                cache: false,
                data: { nome: nome, tipo: tipo, morada: morada, token: tokenrl, id: id, cod_postal: cod_postal },
                headers: { ""token"": tokenrl },
                success: function (data) {
                    window.location.href = ""?sucesso=y"";
                    M.toast({ html: 'Loja criada com sucesso', classes: 'rounded' })

                }
                , error: function (jqXHR, textStatus, err) {
                    M.toast({ html: 'Erro ao criar a loja!', classes: 'rounded' })
                    console.log(err, textStatus);
                }
            })
"
  ```
  
 

