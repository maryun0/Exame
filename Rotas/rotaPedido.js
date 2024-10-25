import { Router } from "express";
import PedidoCtrl from "../Controle/pedidoCtrl.js";

const rotaPedido = new Router();
const pedidoCtrl = new PedidoCtrl();


rotaPedido.post('/', pedidoCtrl.gravar)      
.put('/', pedidoCtrl.alterar)               
.delete('/', pedidoCtrl.excluir)            
.get('/', pedidoCtrl.consultar)             
.get('/:termo', pedidoCtrl.consultar);      

export default rotaPedido;
