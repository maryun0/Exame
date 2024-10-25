import Cliente from '../Modelo/cliente.js';
import conectar from "./conexao.js";

export default class ClienteDAO {

    async incluir(cliente) {
        if (cliente instanceof Cliente) {
            const conexao = await conectar();
            const sql = "INSERT INTO cliente(nome, endereco, telefone) VALUES(?, ?, ?)";
            const valores = [cliente.nome, cliente.endereco, cliente.telefone];
            const resultado = await conexao.query(sql, valores);
            cliente.codigo = resultado[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async alterar(cliente) {
        if (cliente instanceof Cliente) {
            const conexao = await conectar();
            const sql = "UPDATE cliente SET nome = ?, endereco = ?, telefone = ? WHERE codigo = ?";
            const valores = [cliente.nome, cliente.endereco, cliente.telefone, cliente.codigo];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(cliente) {
        if (cliente instanceof Cliente) {
            const conexao = await conectar();
            const sql = "DELETE FROM cliente WHERE codigo = ?";
            const valores = [cliente.codigo];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        const sql = "SELECT * FROM cliente WHERE nome LIKE ?";
        const valores = ['%' + termo + '%'];
        const [rows] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
        const listaClientes = [];
        for (const row of rows) {
            const cliente = new Cliente(row['codigo'], row['nome'], row['endereco'], row['telefone']);
            listaClientes.push(cliente);
        }
        return listaClientes;
    }

    async consultarCodigo(codigo) {
        const conexao = await conectar();
        const sql = "SELECT * FROM cliente WHERE codigo = ?";
        const valores = [codigo];
        const [rows] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
        if (rows.length > 0) {
            const row = rows[0];
            return new Cliente(row['codigo'], row['nome'], row['endereco'], row['telefone']);
        }
        return null;
    }
}
