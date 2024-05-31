import { db } from '../src/index.js';

export class Agendamento{
    id;
    nome;
    telefone;
    origem;
    contato;
    observacao;

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

    async exlcuir(){
        if(!this.id)
            return Promise.reject({code: 500, message: "Id não informado"})

        return db.collection('agendamentos').doc(this.id).delete().then(function(){
            return Promise.resolve({code: 200, message: `Agendamento excluido`})
        }).catch(erro => {
            return Promise.reject({code: 500, message: `Erro ao atualizar: ${error.message}`})
        })
    }
}