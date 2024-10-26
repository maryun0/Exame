import conectar from "./conexao.js";
import Pedido from "../Modelo/pedido.js";
import Cliente from "../Modelo/cliente.js";
import ItemPedido from "../Modelo/itemPedido.js";
import Pizza from "../Modelo/pizza.js";

export default class PedidoDAO {
    async gravar(pedido) {
        if (pedido instanceof Pedido) {
            const conexao = await conectar();
            try {
                await conexao.beginTransaction();

                
                const sqlPedido = `INSERT INTO pedido (cliente_id) VALUES (?)`;
                const [resultado] = await conexao.execute(sqlPedido, [pedido.cliente.codigo]);
                pedido.codigo = resultado.insertId;

                const sqlItem = `INSERT INTO item_pedido (pedido_id, pizza_id, quantidade) VALUES (?, ?, ?)`;
                for (const item of pedido.itens) {
                    await conexao.execute(sqlItem, [pedido.codigo, item.pizza.codigo, item.quantidade]);
                }

                await conexao.commit();
            } catch (erro) {
                await conexao.rollback();
                throw erro;
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        let listaPedidos = [];
        try {
            const sqlPedido = `
                SELECT p.codigo, c.codigo AS clienteCodigo, c.nome AS clienteNome 
                FROM pedido p 
                JOIN cliente c ON p.cliente_id = c.codigo 
                WHERE c.nome LIKE ? OR p.codigo = ?
            `;
            const parametros = ['%' + termo + '%', isNaN(termo) ? null : termo];
            const [pedidos] = await conexao.execute(sqlPedido, parametros);

            for (const row of pedidos) {
                const cliente = new Cliente(row.clienteCodigo, row.clienteNome);
                const pedido = new Pedido(cliente, [], row.codigo);

                const sqlItens = `
                    SELECT i.quantidade, pi.codigo AS pizzaCodigo, pi.nomePizza, pi.preco
                    FROM item_pedido i 
                    JOIN pizza pi ON i.pizza_id = pi.codigo 
                    WHERE i.pedido_id = ?
                `;
                const [itens] = await conexao.execute(sqlItens, [pedido.codigo]);
                pedido.itens = itens.map(item => new ItemPedido(new Pizza(item.pizzaCodigo, item.nomePizza, item.preco), item.quantidade));

                listaPedidos.push(pedido);
            }
        } catch (erro) {
            console.log("Erro ao consultar pedidos: " + erro.message);
        } finally {
            global.poolConexoes.releaseConnection(conexao);
        }
        return listaPedidos;
    }

    async excluir(codigoPedido) {
        const conexao = await conectar();
        try {
            await conexao.beginTransaction();

            const sqlExcluirItens = `DELETE FROM item_pedido WHERE pedido_id = ?`;
            await conexao.execute(sqlExcluirItens, [codigoPedido]);

            const sqlExcluirPedido = `DELETE FROM pedido WHERE codigo = ?`;
            await conexao.execute(sqlExcluirPedido, [codigoPedido]);

            await conexao.commit();
        } catch (erro) {
            await conexao.rollback();
            throw erro;
        } finally {
            global.poolConexoes.releaseConnection(conexao);
        }
    }
}
