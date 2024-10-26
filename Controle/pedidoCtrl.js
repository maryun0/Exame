import Pedido from "../Modelo/pedido.js";
import Cliente from "../Modelo/cliente.js";
import Pizza from "../Modelo/pizza.js";
import ItemPedido from "../Modelo/itemPedido.js";
import ClienteDAO from "../Persistencia/clienteDAO.js";

export default class PedidoCtrl {
    
    // Método para gravar um novo pedido
    async gravar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const clienteData = dados.cliente;
            const itensData = dados.itens;

            if (clienteData && itensData && Array.isArray(itensData)) {
                try {
               
                    const clienteDAO = new ClienteDAO();
                    const clienteCompleto = await clienteDAO.consultarCodigo(clienteData.codigo);

                    if (!clienteCompleto) {
                        resposta.status(404).json({
                            "status": false,
                            "mensagem": "Cliente não encontrado!"
                        });
                        return;
                    }

                    const itensPedido = itensData.map(item => {
                        if (item.pizza && item.pizza.codigo && item.quantidade) {
                            return new ItemPedido(new Pizza(item.pizza.codigo), item.quantidade);
                        } else {
                            throw new Error("Item de pedido inválido. Cada item deve conter uma pizza com código e uma quantidade.");
                        }
                    });

          
                    const pedido = new Pedido(clienteCompleto, itensPedido);

                    await pedido.gravar();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Pedido gravado com sucesso!",
                        "codigoPedido": pedido.codigo
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao gravar o pedido: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, forneça o cliente e os itens do pedido conforme documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para criar um pedido!"
            });
        }
    }


    async consultar(requisicao, resposta) {
        resposta.type("application/json");
        const termo = requisicao.params.termo || "";

        if (requisicao.method === "GET") {
            const pedido = new Pedido();
            pedido.consultar(termo).then((listaPedidos) => {
                resposta.json({
                    "status": true,
                    "listaPedidos": listaPedidos
                });
            }).catch((erro) => {
                resposta.json({
                    "status": false,
                    "mensagem": "Não foi possível obter os pedidos: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar pedidos!"
            });
        }
    }

 
    async atualizar(requisicao, resposta) {
        resposta.type("application/json");

        if ((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const codigoPedido = dados.codigo;
            const clienteData = dados.cliente;
            const itensData = dados.itens;

            if (codigoPedido && clienteData && itensData && Array.isArray(itensData)) {
                const cliente = new Cliente(clienteData.codigo);
                const itensPedido = itensData.map(item => 
                    new ItemPedido(new Pizza(item.pizza.codigo), item.quantidade)
                );

                const pedido = new Pedido(cliente, itensPedido, codigoPedido);

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
                    "mensagem": "Por favor, forneça o código do pedido, cliente e itens conforme a documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método PUT ou PATCH para atualizar o pedido!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "DELETE" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const codigoPedido = dados.codigo;

            if (codigoPedido) {
                const pedido = new Pedido();
                pedido.codigo = codigoPedido;

                pedido.excluir().then(() => {
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
                    "mensagem": "Por favor, forneça o código do pedido a ser excluído!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um pedido!"
            });
        }
    }
}
