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
        console.log('Added document');
        res.redirect('/')
    })
})
```
![image](https://github.com/JoaoEnrique/projetoweb-node-firebase/assets/87030375/c7e369ac-5b2d-41e5-b0d0-6bd7376cec38)
