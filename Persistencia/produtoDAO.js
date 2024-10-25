import Produto from '../Modelo/produto.js';
import conectar from './conexao.js';

export default class ProdutoDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar(); 
            const sql = `
            CREATE TABLE IF NOT EXISTS produto(
                codigo INT NOT NULL AUTO_INCREMENT,
                nomeProduto VARCHAR(100) NOT NULL,
                preco DECIMAL(10,2) NOT NULL DEFAULT 0,
                CONSTRAINT pk_produto PRIMARY KEY(codigo)
            )`;
            await conexao.execute(sql);
            global.poolConexoes.releaseConnection(conexao);
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(produto) {
        if (produto instanceof Produto) {
            const sql = `INSERT INTO produto(nomeProduto, preco)
                         VALUES(?,?)`;
            const parametros = [produto.nomeProduto, produto.preco];

            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            produto.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(produto) {
        if (produto instanceof Produto) {  
            const sql = `UPDATE produto SET nomeProduto = ?, preco = ?
                         WHERE codigo = ?`;
            const parametros = [produto.nomeProduto, produto.preco, produto.codigo];

            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(produto) {
        if (produto instanceof Produto) {
            const sql = `DELETE FROM produto WHERE codigo = ?`;
            const parametros = [produto.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        if (!termo) {
            termo = "";
        }
        const conexao = await conectar();
        let listaProdutos = [];
        if (!isNaN(parseInt(termo))) {
        
            const sql = `SELECT p.codigo, p.nomeProduto, p.preco
                         FROM produto p 
                         WHERE p.codigo = ?
                         ORDER BY p.nomeProduto`;
            const parametros = [termo];
            const [registros] = await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
            for (const registro of registros) {
                const produto = new Produto(registro.codigo, registro.nomeProduto, registro.preco);
                listaProdutos.push(produto);
            }
        } else {
     
            const sql = `SELECT p.codigo, p.nomeProduto, p.preco
                         FROM produto p 
                         WHERE p.nomeProduto LIKE ?
                         ORDER BY p.nomeProduto`;
            const parametros = ['%' + termo + '%'];
            const [registros] = await conexao.execute(sql, parametros);
            for (const registro of registros) {
                const produto = new Produto(registro.codigo, registro.nomeProduto, registro.preco);
                listaProdutos.push(produto);
            }
        }

        return listaProdutos;
    }
}
