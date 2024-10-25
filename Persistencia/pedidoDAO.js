import Pedido from "../Modelo/pedido.js";
import Cliente from "../Modelo/cliente.js";
import Pizza from "../Modelo/pizza.js";
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

             
                const sql2 = 'INSERT INTO pedido_pizza(pedido_codigo, pizza_codigo, quantidade, preco_unitario) VALUES(?,?,?,?)';
                for (const item of pedido.itens) {
                    const parametros2 = [pedido.codigo, item.pizza.codigo, item.quantidade, item.precoUnitario];
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

         
                await conexao.execute('DELETE FROM pedido_pizza WHERE pedido_codigo = ?', [pedido.codigo]);

                const sql2 = 'INSERT INTO pedido_pizza(pedido_codigo, pizza_codigo, quantidade, preco_unitario) VALUES(?,?,?,?)';
                for (const item of pedido.itens) {
                    const parametros2 = [pedido.codigo, item.pizza.codigo, item.quantidade, item.precoUnitario];
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
              
                await conexao.execute('DELETE FROM pedido_pizza WHERE pedido_codigo = ?', [pedido.codigo]);

      
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
                   pizza.codigo AS pizza_codigo, pizza.nomePizza, pizza.preco,
                   i.pizza_codigo, i.quantidade, i.preco_unitario
                   FROM pedido AS p
                   INNER JOIN cliente AS c ON p.cliente_codigo = c.codigo
                   INNER JOIN pedido_pizza AS i ON i.pedido_codigo = p.codigo
                   INNER JOIN pizza AS pizza ON pizza.codigo = i.pizza_codigo
                   WHERE p.codigo = ?`;
            parametros = [termoBusca];
        } else {
            sql = `SELECT p.codigo, p.cliente_codigo, p.data_pedido, p.total,
                   c.nome, c.endereco, c.telefone,
                   pizza.codigo AS pizza_codigo, pizza.nomePizza, pizza.preco,
                   i.pizza_codigo, i.quantidade, i.preco_unitario
                   FROM pedido AS p
                   INNER JOIN cliente AS c ON p.cliente_codigo = c.codigo
                   INNER JOIN pedido_pizza AS i ON i.pedido_codigo = p.codigo
                   INNER JOIN pizza AS pizza ON pizza.codigo = i.pizza_codigo`;
        }

        const [registros] = await conexao.execute(sql, parametros);
        global.poolConexoes.releaseConnection(conexao);

        if (registros.length > 0) {
            const cliente = new Cliente(registros[0].cliente_codigo, registros[0].nome, registros[0].endereco, registros[0].telefone);
            let listaItensPedido = [];

            for (const registro of registros) {
                const pizza = new Pizza(registro.pizza_codigo, registro.nomePizza, registro.preco);
                const itemPedido = new ItemPedido(pizza, registro.quantidade, registro.preco_unitario);
                listaItensPedido.push(itemPedido);
            }

            const pedido = new Pedido(registros[0].codigo, cliente, registros[0].data_pedido, registros[0].total, listaItensPedido);
            listaPedidos.push(pedido);
        }

        return listaPedidos;
    }
}
