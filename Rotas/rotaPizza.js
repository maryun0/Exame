import { Router } from "express";
import PizzaCtrl from "../Controle/pizzaCtrl.js"; 

const pizzaCtrl = new PizzaCtrl();
const rotaPizza = new Router();


rotaPizza
.get('/', pizzaCtrl.consultar)           
.get('/:termo', pizzaCtrl.consultar)      
.post('/', pizzaCtrl.gravar)             
.patch('/', pizzaCtrl.atualizar)          
.put('/', pizzaCtrl.atualizar)            
.delete('/', pizzaCtrl.excluir);        

export default rotaPizza;
