import express from 'express';
import { AgendamentoController } from './controllers/AgendamentoController.js';

const app = express();
const agendamentoController = new AgendamentoController();

// GET
app.get("/", (req, res) => { agendamentoController.home(req, res) }); // CREATE
app.get("/consulta", (req, res) => { agendamentoController.listarAgendamentos(req, res); }); // READ
app.get("/editar/:id", (req, res) => { agendamentoController.editar(req, res) }); // UPDATE
app.get("/excluir/:id", (req, res) =>{  agendamentoController.excluir(req, res)}); // DELETE

// POST
app.post("/cadastrar", (req, res) => { agendamentoController.cadastrar(req, res)} );// CREATE
app.post("/atualizar", (req, res) =>{ agendamentoController.atualizar(req, res)}); // UPDATE

export const router = app;