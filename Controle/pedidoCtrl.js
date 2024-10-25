import Cliente from "../Modelo/cliente.js";
import Pedido from "../Modelo/pedido.js";
import Pizza from "../Modelo/pizza.js";
import ItemPedido from "../Modelo/itemPedido.js";

export default class PedidoCtrl {
    
    
    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const cliente = dados.cliente;
            const dataPedido = new Date(dados.dataPedido).toLocaleDateString();
            const totalPedido = dados.totalPedido;
            const itensPedido = dados.itens;

            
            const objCliente = new Cliente(cliente.codigo); 

           
            let itens = [];
            for (const item of itensPedido) {
                const pizza = new Pizza(item.codigo);
                const objItem = new ItemPedido(pizza, item.quantidade, item.precoUnitario);
                itens.push(objItem);
            }

            const pedido = new Pedido(0, objCliente, dataPedido, totalPedido, itens);

          
            pedido.gravar().then(() => {
                resposta.status(200).json({
                    "status": true,
                    "mensagem": "Pedido registrado com sucesso!",
                    "codigo": pedido.codigo
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao registrar o pedido: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida!"
            });
        }
    }

   
    consultar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'GET') {
            let termo = requisicao.params.termo;
            const pedido = new Pedido(0);

            pedido.consultar(termo).then((listaPedidos) => {
                resposta.status(200).json({
                    "status": true,
                    "listaPedidos": listaPedidos
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar o pedido: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida!"
            });
        }
    }

    
    alterar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'PUT' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const cliente = dados.cliente;
            const dataPedido = new Date(dados.dataPedido).toLocaleDateString();
            const totalPedido = dados.totalPedido;
            const itensPedido = dados.itens;

          
            const objCliente = new Cliente(cliente.codigo);

           
            let itens = [];
            for (const item of itensPedido) {
                const pizza = new Pizza(item.codigo);
                const objItem = new ItemPedido(pizza, item.quantidade, item.precoUnitario);
                itens.push(objItem);
            }

            const pedido = new Pedido(codigo, objCliente, dataPedido, totalPedido, itens);

        
            pedido.atualizar().then(() => {
                resposta.status(200).json({
                    "status": true,
                    "mensagem": "Pedido atualizado com sucesso!"
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao atualizar o pedido: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida!"
            });
        }
    }

    
    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;

            if (codigo) {
                const pedido = new Pedido(codigo);

        
                pedido.apagar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Pedido excluído com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir o pedido: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Código do pedido não informado!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida!"
            });
        }
    }
}
