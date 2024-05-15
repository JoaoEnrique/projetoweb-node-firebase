CRUD com Firebase

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
![image](https://github.com/JoaoEnrique/projetoweb-node-firebase/assets/87030375/c7e369ac-5b2d-41e5-b0d0-6bd7376cec38)
