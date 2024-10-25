import express from 'express';
import cors from 'cors';


import rotaCliente from './Rotas/rotaCliente.js';
import rotaProduto from './Rotas/rotaProduto.js';
import rotaPedido from './Rotas/rotaPedido.js';

const app = express();

const host =  '0.0.0.0';
const porta =  4000;

app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://192.168.10.152:3000"],
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/cliente', rotaCliente);
app.use('/produto', rotaProduto);
app.use('/pedido', rotaPedido);

app.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}.`);
});
