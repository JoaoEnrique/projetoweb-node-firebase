# CRUD com Firebase

```cmd
npm install express --save
npm install express-handlebars --save
npm install body-parser --save
npm install firebase-admin --save

node app.js
http://localhost:8081
```

# CREATE
```JS
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

```

# READ
```js
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
```

# UPDATE
## GET
```js
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
```

## POST
```js
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

```

# DELETE
```js
app.get("/excluir/:id", function(req, res){
    agendamentoId = req.params.id;
    db.collection('agendamentos').doc(agendamentoId).delete().then(function(){
        res.redirect('/consulta?success=Agendamento excluido com sucesso')
    }).catch(erro => {
        res.redirect(`/consulta?danger=Erro ao excluir agendamento: ${erro}`)
    })
})
```

![image](https://github.com/JoaoEnrique/projetoweb-node-firebase/assets/87030375/c7e369ac-5b2d-41e5-b0d0-6bd7376cec38)
