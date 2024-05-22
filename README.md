# CRUD com Firebase
CRUD com firebase e MVC em node

```cmd
npm install express --save
npm install express-handlebars --save
npm install body-parser --save
npm install firebase-admin --save
npm install moment --save

npm start
http://localhost:8081
```

# CREATE
```JS
//controller
cadastrar(req, res){
    const agendamento = new Agendamento();
    const { nome, telefone, origem, data_contato, observacao } = req.body;
    Object.assign(agendamento, { nome, telefone, origem, data_contato, observacao });

    agendamento.cadastrar().then(result =>{
        res.redirect(`/consulta?success=${result.message}`)
    }).catch(error => {
        res.redirect(`/consulta?danger=${error.message}`)
    })
}


//model
async cadastrar(){
    return await db.collection('agendamentos').add({
        nome: this.nome,
        telefone: this.telefone,
        origem: this.origem,
        data_contato: this.data_contato,
        observacao: this.observacao
    }).then(function(){
        return Promise.resolve({code: 201, message: `Agendamento realizado`})
    }).catch(error =>{
        return Promise.reject({code: 500, message: `Erro ao salvar: ${error.message}`})
    })
}


```

# READ
```js
//controller
listarAgendamentos(req, res){
    let { success, danger } = this.getNotificacao(req);
    const agendamento = new Agendamento();

    agendamento.listar().then(agendamentos => {
        res.render("consulta", { success, danger, agendamentos });
    }).catch(error => {
        res.redirect(`/?danger=${error.message}`)
    })
}

//model
async listar (){
    return await db.collection('agendamentos').get().then(querySnapshot => {
        let agendamentos = [];
        querySnapshot.forEach(documentSnapshot => {
            let a = documentSnapshot.data();
            a.id = documentSnapshot.id;
            agendamentos.push(a);
        });
        return agendamentos;
    }).catch(error => {
        return Promise.reject({code: 500, message: `Erro ao consultar: ${error.message}`})
    });
}
```

# UPDATE
## GET
```js
//controller
editar(req, res){
    let { success, danger } = this.getNotificacao(req);
    const agendamento = new Agendamento();
    agendamento.id = req.params.id;

    if(!agendamento.id)
        res.redirect(`/consulta?danger=Erro ao buscar agendamento para atualização`);

    agendamento.getAgendamentoById().then(agendamento => {
        res.render('primeira_pagina', { success, danger, agendamento})
    }).catch(error =>{
        res.redirect(`/consulta?danger=${error.message}`)
    })
    
}

//model
async getAgendamentoById(){
    if(!this.id)
        return Promise.reject({code: 500, message: "Id não informado"})

    return await db.collection('agendamentos').doc(this.id).get().then(documentSnapshot => {
        if(documentSnapshot.exists){
            const agendamento = documentSnapshot.data();
            if(!agendamento)
                return Promise.reject({code: 404, message: "Usuário não encontrado"})

            agendamento.id = this.id;
            return agendamento;
        }else 
            return Promise.reject({code: 404, message: `O agendamento não exite ou foi apagado`})

    }).catch(error =>{
        return Promise.reject({code: 500, message: `Erro ao buscar agendamento para atualização: ${error.message}`})
    })
}
```

## POST
```js
//controller
atualizar(req, res){
    const agendamento = new Agendamento();
    agendamento.id = req.body.id
    const { nome, telefone, origem, data_contato, observacao } = req.body;
    Object.assign(agendamento, { nome, telefone, origem, data_contato, observacao });

    if (!agendamento.id)
        return res.redirect('/consulta?danger=ID do agendamento não fornecido');

    agendamento.atualizar().then(result =>{
        res.redirect(`/consulta?success=${result.message}`)
    }).catch(error => {
        res.redirect(`/consulta?danger=${error.message}`)
    })
}

//model
async atualizar(){
    if(!this.id)
        return Promise.reject({code: 500, message: "Id não informado"})

    return await db.collection('agendamentos').doc(this.id).update({
        nome: this.nome,
        telefone: this.telefone,
        origem: this.origem,
        data_contato: this.data_contato,
        observacao: this.observacao
    }).then(function(){
        return Promise.resolve({code: 200, message: `Agendamento atualizado`})
    })
    .catch(error =>{
        return Promise.reject({code: 500, message: `Erro ao atualizar: ${error.message}`})
    })
}
```

# DELETE
```js
//controller
excluir(req, res){
    const agendamento = new Agendamento();
    agendamento.id = req.params.id;

    if(!agendamento.id)
        res.redirect(`/consulta?danger=Erro ao excluir agendamento: ID não encontrado`)
        
    agendamento.exlcuir().then(result => {
        res.redirect(`/consulta?success=${result.message}`)
    }).catch(error =>{
        res.redirect(`/consulta?danger=${error.message}`)
    })
}

//model
async exlcuir(){
    if(!this.id)
        return Promise.reject({code: 500, message: "Id não informado"})

    return db.collection('agendamentos').doc(this.id).delete().then(function(){
        return Promise.resolve({code: 200, message: `Agendamento excluido`})
    }).catch(erro => {
        return Promise.reject({code: 500, message: `Erro ao atualizar: ${error.message}`})
    })
}
```

# READ
![image](https://github.com/JoaoEnrique/projetoweb-node-firebase/assets/87030375/1e9797ee-0216-4205-902b-9dfa44f4af74)

# CREATE
![image](https://github.com/JoaoEnrique/projetoweb-node-firebase/assets/87030375/0241cd35-dfe9-4b5e-9730-1d7242a5a80e)


![image](https://github.com/JoaoEnrique/projetoweb-node-firebase/assets/87030375/c7e369ac-5b2d-41e5-b0d0-6bd7376cec38)
