const express = require('express');

const bodyParser = require ('body-parser');
const cors=require('cors');
const app = express();
const rotaProdutos = require('./routes/produtos');
const rotaClientes = require('./routes/clientes');
const rotaUtilizadores = require('./routes/users');
const rotaLojas = require('./routes/lojas');

app.use(bodyParser.urlencoded({extended: false})); //apenas dados simples
app.use(bodyParser.json());
app.use(cors());
app.use('/produtos',rotaProdutos);
app.use('/user',rotaUtilizadores);
app.use('/loja',rotaLojas);
app.use('/cliente',rotaClientes);
app.use(express.static('uploads'));

module.exports = app;