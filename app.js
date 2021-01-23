const express = require('express');

const bodyParser = require ('body-parser');
const cors=require('cors');
const app = express();
const rotaProdutos = require('./routes/produtos');
const rotaClientes = require('./routes/clientes');
const rotaUtilizadores = require('./routes/users');
const rotaLojas = require('./routes/lojas');
const rotaEncomendas= require('./routes/encomendas');
const rotaAdmins= require('./routes/admins');
const rotaEntregas= require('./routes/deliver');
const path=require('path');
app.use(express.static(path.join(__dirname, 'Public')));
app.use(bodyParser.urlencoded({extended: false})); //apenas dados simples
app.use(bodyParser.json());
app.use(cors());
app.use('/produtos',rotaProdutos);
app.use('/user',rotaUtilizadores);
app.use('/loja',rotaLojas);
app.use('/cliente',rotaClientes);
app.use(express.static('uploads'));
app.use('/encomenda',rotaEncomendas);
app.use('/funcadmin',rotaAdmins);
app.use('/entrega',rotaEntregas);
module.exports = app;