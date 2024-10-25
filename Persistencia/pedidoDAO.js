import Pedido from "../Modelo/pedido.js";
import Cliente from "../Modelo/cliente.js";
import Produto from "../Modelo/produto.js";
import ItemPedido from "../Modelo/itemPedido.js";
import conectar from "./conexao.js";

export default class PedidoDAO {

    async gravar(pedido) {
        if (pedido instanceof Pedido) {
            const conexao = await conectar();
            await conexao.beginTransaction(); 
            try {
         
                const sql = 'INSERT INTO pedido(cliente_codigo, data_pedido, total) VALUES(?,str_to_date(?,"%d/%m/%Y"),?)';
                const parametros = [pedido.cliente.codigo, pedido.data, pedido.total];
                const retorno = await conexao.execute(sql, parametros);
                pedido.codigo = retorno[0].insertId;

           
                const sql2 = 'INSERT INTO pedido_produto(pedido_codigo, produto_codigo, quantidade, preco_unitario) VALUES(?,?,?,?)';
                for (const item of pedido.itens) {
                    const parametros2 = [pedido.codigo, item.produto.codigo, item.quantidade, item.precoUnitario];
                    await conexao.execute(sql2, parametros2);
                }
                await conexao.commit(); 
                global.poolConexoes.releaseConnection(conexao);
            } catch (error) {
                await conexao.rollback(); 
                throw error;
            }
        }
    }

    async alterar(pedido) {
        if (pedido instanceof Pedido) {
            const conexao = await conectar();
            await conexao.beginTransaction();
            try {
           
                const sql = 'UPDATE pedido SET cliente_codigo = ?, data_pedido = str_to_date(?,"%d/%m/%Y"), total = ? WHERE codigo = ?';
                const parametros = [pedido.cliente.codigo, pedido.data, pedido.total, pedido.codigo];
                await conexao.execute(sql, parametros);

        
                await conexao.execute('DELETE FROM pedido_produto WHERE pedido_codigo = ?', [pedido.codigo]);

                const sql2 = 'INSERT INTO pedido_produto(pedido_codigo, produto_codigo, quantidade, preco_unitario) VALUES(?,?,?,?)';
                for (const item of pedido.itens) {
                    const parametros2 = [pedido.codigo, item.produto.codigo, item.quantidade, item.precoUnitario];
                    await conexao.execute(sql2, parametros2);
                }

                await conexao.commit();
                global.poolConexoes.releaseConnection(conexao);
            } catch (error) {
                await conexao.rollback();
                throw error;
            }
        }
    }

    async excluir(pedido) {
        if (pedido instanceof Pedido) {
            const conexao = await conectar();
            await conexao.beginTransaction();
            try {
        
                await conexao.execute('DELETE FROM pedido_produto WHERE pedido_codigo = ?', [pedido.codigo]);

       
                await conexao.execute('DELETE FROM pedido WHERE codigo = ?', [pedido.codigo]);

                await conexao.commit();
                global.poolConexoes.releaseConnection(conexao);
            } catch (error) {
                await conexao.rollback();
                throw error;
            }
        }
    }

    async consultar(termoBusca) {
        const listaPedidos = [];
        const conexao = await conectar();
        let sql = "";
        let parametros = [];
        
        if (!isNaN(termoBusca)) { 
            sql = `SELECT p.codigo, p.cliente_codigo, p.data_pedido, p.total,
                   c.nome, c.endereco, c.telefone,
                   prod.codigo AS prod_codigo, prod.nomeProduto, prod.preco,
                   i.produto_codigo, i.quantidade, i.preco_unitario
                   FROM pedido AS p
                   INNER JOIN cliente AS c ON p.cliente_codigo = c.codigo
                   INNER JOIN pedido_produto AS i ON i.pedido_codigo = p.codigo
                   INNER JOIN produto AS prod ON prod.codigo = i.produto_codigo
                   WHERE p.codigo = ?`;
            parametros = [termoBusca];
        } else {
            sql = `SELECT p.codigo, p.cliente_codigo, p.data_pedido, p.total,
                   c.nome, c.endereco, c.telefone,
                   prod.codigo AS prod_codigo, prod.nomeProduto, prod.preco,
                   i.produto_codigo, i.quantidade, i.preco_unitario
                   FROM pedido AS p
                   INNER JOIN cliente AS c ON p.cliente_codigo = c.codigo
                   INNER JOIN pedido_produto AS i ON i.pedido_codigo = p.codigo
                   INNER JOIN produto AS prod ON prod.codigo = i.produto_codigo`;
        }

        const [registros] = await conexao.execute(sql, parametros);
        global.poolConexoes.releaseConnection(conexao);

        if (registros.length > 0) {
            const cliente = new Cliente(registros[0].cliente_codigo, registros[0].nome, registros[0].endereco, registros[0].telefone);
            let listaItensPedido = [];

            for (const registro of registros) {
                const produto = new Produto(registro.prod_codigo, registro.nomeProduto, registro.preco);
                const itemPedido = new ItemPedido(produto, registro.quantidade, registro.preco_unitario);
                listaItensPedido.push(itemPedido);
            }

            const pedido = new Pedido(registros[0].codigo, cliente, registros[0].data_pedido, registros[0].total, listaItensPedido);
            listaPedidos.push(pedido);
        }

        return listaPedidos;
    }
}
