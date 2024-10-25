import Cliente from '../Modelo/cliente.js';


export default class ClienteCTRL {

  
    gravar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            const endereco = dados.endereco;
            const telefone = dados.telefone;

            if (nome && endereco && telefone) {
        
                const cliente = new Cliente(0, nome, endereco, telefone);
                cliente.gravar().then(() => {
                    resposta.status(200).json({
                        status: true,
                        codigoGerado: cliente.codigo, 
                        mensagem: "Cliente gravado com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe adequadamente todos os dados de um cliente conforme documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou cliente no formato JSON não fornecido! Consulte a documentação da API"
            });
        }
    }

  
    atualizar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "PUT" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            const endereco = dados.endereco;
            const telefone = dados.telefone;

            if (codigo && nome && endereco && telefone) {
                const cliente = new Cliente(codigo, nome, endereco, telefone);
                cliente.atualizar().then(() => {
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Cliente atualizado com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe adequadamente todos os dados de um cliente conforme documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou cliente no formato JSON não fornecido! Consulte a documentação da API"
            });
        }
    }

   
    excluir(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "DELETE" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;

            if (codigo) {
                const cliente = new Cliente(codigo);
                cliente.excluir().then(() => {
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Cliente excluído com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o código do cliente conforme documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou cliente no formato JSON não fornecido! Consulte a documentação da API"
            });
        }
    }

    
    consultar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "GET") {
            const cliente = new Cliente();
            cliente.consultar('').then((clientes) => {
                resposta.status(200).json({
                    status: true,
                    listaClientes: clientes
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: erro.message
                });
            });
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido! Consulte a documentação da API"
            });
        }
    }

  
    consultarPeloCodigo(requisicao, resposta) {
        resposta.type("application/json");

        const codigo = requisicao.params['codigo'];

        if (requisicao.method === "GET") {
            const cliente = new Cliente();
            cliente.consultarCodigo(codigo).then((cliente) => {
                resposta.status(200).json({
                    status: true,
                    cliente: cliente
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: erro.message
                });
            });
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido! Consulte a documentação da API"
            });
        }
    }
}
