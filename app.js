const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue, QuerySnapshot } = require('firebase-admin/firestore')
const moment = require('moment');

const serviceAccount = require('./agendamentos-node-firebase-adminsdk-awqwe-85be525718.json')

initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

app.engine("handlebars", handlebars({
    defaultLayout: "main",
    helpers: {
        formatarData: (date) => {
            return moment(date).format('DD/MM/YYYY')
        }
    }
}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    const success = req.query.success ? req.query.success : null;
    const danger = req.query.danger ? req.query.danger : null;
    res.render("primeira_pagina", { success, danger })
})

app.get("/consulta", function(req, res){
    db.collection('agendamentos').get().then(querySnapshot => {
        let agendamentos = [];
        querySnapshot.forEach(documentSnapshot => {
            agendamentos.push(documentSnapshot.data());
        });
        res.render("consulta", { agendamentos });
    }).catch(erro => {
        res.redirect(`/?danger=Erro ao consultar: ${erro}`)
    });
})

app.get("/editar/:id", function(req, res){
})

app.get("/excluir/:id", function(req, res){
})

app.post("/cadastrar", function(req, res){
    var result = db.collection('agendamentos').add({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        res.redirect('/consulta?success=Criado com sucesso')
    }).catch(function(erro){
        res.redirect(`/consulta?danger=Erro ao salvar: ${erro}`)
    })
})

app.post("/atualizar", function(req, res){
})

app.listen(8081, function(){
    console.log("\n\nhttp://localhost:8081\n\n")
})