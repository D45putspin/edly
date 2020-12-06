const express = require('express');

const bodyParser = require ('body-parser');
const cors=require('cors');
const app = express();


const rotaProdutos = require('./routes/produtos');
const rotaUtilizadores = require('./routes/users');
app.use(bodyParser.urlencoded({extended: false})); //apenas dados simples
app.use(bodyParser.json());
app.use(cors());
app.use('/produtos',rotaProdutos)<
app.use('/user',rotaUtilizadores)

module.exports = app;