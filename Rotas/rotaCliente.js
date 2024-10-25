import { Router } from "express";
import ClienteCTRL from "../Controle/clienteCtrl.js";

const rotaCliente = new Router();
const clienteCtrl = new ClienteCTRL();


rotaCliente.post('/', clienteCtrl.gravar)
.put('/',clienteCtrl.atualizar)
.delete('/',clienteCtrl.excluir)
.get('/', clienteCtrl.consultar)
.get('/:nome', clienteCtrl.consultarPeloCodigo);

export default rotaCliente;