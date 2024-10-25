import Pizza from "../Modelo/pizza.js";

export default class PizzaCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nomePizza = dados.nomePizza;
            const preco = dados.preco;

            if (nomePizza && preco > 0) {
                const pizza = new Pizza(0, nomePizza, preco);
                pizza.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": pizza.codigo,
                        "mensagem": "Pizza incluída com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar a pizza: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, forneça todos os dados da pizza segundo a documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar uma pizza!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nomePizza = dados.nomePizza;
            const preco = dados.preco;

            if (codigo && nomePizza && preco > 0) {
                const pizza = new Pizza(codigo, nomePizza, preco);
                pizza.alterar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Pizza atualizada com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar a pizza: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, forneça todos os dados da pizza segundo a documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar uma pizza!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;

            if (codigo) {
                const pizza = new Pizza(codigo);
                pizza.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Pizza excluída com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir a pizza: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, forneça o código da pizza!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir uma pizza!"
            });
        }
    }

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo || "";

        if (requisicao.method === "GET") {
            const pizza = new Pizza();
            pizza.consultar(termo).then((listaPizzas) => {
                resposta.json({
                    status: true,
                    listaPizzas
                });
            })
            .catch((erro) => {
                resposta.json({
                    status: false,
                    mensagem: "Não foi possível obter as pizzas: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar pizzas!"
            });
        }
    }
}
