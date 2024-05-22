import { db } from '../index.js';
import { Agendamento } from '../models/Agendamento.js';

export class AgendamentoController{
    home(req, res){
        let { success, danger } = this.getNotificacao(req);
        res.render("primeira_pagina", { success, danger })
    }

    listarAgendamentos(req, res){
        let { success, danger } = this.getNotificacao(req);
        const agendamento = new Agendamento();

        agendamento.listar().then(agendamentos => {
            res.render("consulta", { success, danger, agendamentos });
        }).catch(error => {
            res.redirect(`/?danger=${error.message}`)
        })
    }

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

    getNotificacao(req){
        let success = req.query.success ? req.query.success : null;
        let danger = req.query.danger ? req.query.danger : null;

        return {success, danger}
    }
}
