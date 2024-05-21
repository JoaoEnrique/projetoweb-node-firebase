const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue, QuerySnapshot } = require('firebase-admin/firestore')
const moment = require('moment');
const path = require('path');

const serviceAccount = require('../agendamentos-node-firebase-adminsdk-awqwe-85be525718.json')

initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

app.engine("handlebars", handlebars({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    helpers: {
        formatarData: (date) => {
            return moment(date).format('DD/MM/YYYY')
        },
        ifEquals: function(arg1, arg2) {
            return arg1 == arg2;
        }
    }
}))
app.set("view engine", "handlebars")
app.set('views', path.join(__dirname, "views"));
app.use(express.static('src'));

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// GET
// CREATE
app.get("/", function(req, res){
    const success = req.query.success ? req.query.success : null;
    const danger = req.query.danger ? req.query.danger : null;
    res.render("primeira_pagina", { success, danger })
})

// READ
app.get("/consulta", function(req, res){
    const success = req.query.success ? req.query.success : null;
    const danger = req.query.danger ? req.query.danger : null;
    
    db.collection('agendamentos').get().then(querySnapshot => {
        let agendamentos = [];
        querySnapshot.forEach(documentSnapshot => {
            let a = documentSnapshot.data();
            a.id = documentSnapshot.id;
            agendamentos.push(a);
        });
        res.render("consulta", { success, danger, agendamentos });
    }).catch(erro => {
        res.redirect(`/?danger=Erro ao consultar: ${erro}`)
    });
})

// UPDATE
app.get("/editar/:id", function(req, res){
    const success = req.query.success ? req.query.success : null;
    const danger = req.query.danger ? req.query.danger : null;
    const agendamentoId = req.params.id;

    db.collection('agendamentos').doc(agendamentoId).get().then(documentSnapshot => {
        if(documentSnapshot.exists){
            const agendamento = documentSnapshot.data();
            agendamento.id = agendamentoId;
            res.render("primeira_pagina", { success, danger, agendamento})
        }else 
            res.redirect(`/consulta?danger=O agendamento não exite ou foi apagado`);

    }).catch(erro =>{
        res.redirect(`/consulta?danger=Erro ao buscar agendamento para atualização: ${erro}`);
    })
})

// DELETE
app.get("/excluir/:id", function(req, res){
    agendamentoId = req.params.id;
    db.collection('agendamentos').doc(agendamentoId).delete().then(function(){
        res.redirect('/consulta?success=Agendamento excluido com sucesso')
    }).catch(erro => {
        res.redirect(`/consulta?danger=Erro ao excluir agendamento: ${erro}`)
    })
})

// POST
// CREATE
app.post("/cadastrar", function(req, res){
    dados = {}
    db.collection('agendamentos').add({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        res.redirect('/consulta?success=Criado com sucesso')
    }).catch(erro =>{
        res.redirect(`/consulta?danger=Erro ao salvar: ${erro}`)
    })
})

// POST
// UPDATE
app.post("/atualizar", function(req, res){
    const agendamentoId = req.body.id;

    if (!agendamentoId) {
        return res.redirect('/consulta?danger=ID do agendamento não fornecido');
    }

    db.collection('agendamentos').doc(agendamentoId).update({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        res.redirect(`/consulta?success=Agendamento atualizado`);
    })
    .catch(erro =>{
        res.redirect(`/consulta?danger=Erro ao atualizar agendamento: ${erro}`);
    })
});


app.listen(8081, function(){
    console.log("\n\nhttp://localhost:8081\n\n")
})