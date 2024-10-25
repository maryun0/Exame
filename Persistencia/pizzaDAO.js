import Pizza from '../Modelo/pizza.js';
import conectar from './conexao.js';

export default class PizzaDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar(); 
            const sql = `
            CREATE TABLE IF NOT EXISTS pizza(
                codigo INT NOT NULL AUTO_INCREMENT,
                nomePizza VARCHAR(100) NOT NULL,
                preco DECIMAL(10,2) NOT NULL DEFAULT 0,
                CONSTRAINT pk_pizza PRIMARY KEY(codigo)
            )`;
            await conexao.execute(sql);
            global.poolConexoes.releaseConnection(conexao);
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(pizza) {
        if (pizza instanceof Pizza) {
            const sql = `INSERT INTO pizza(nomePizza, preco)
                         VALUES(?,?)`;
            const parametros = [pizza.nomePizza, pizza.preco];

            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            pizza.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(pizza) {
        if (pizza instanceof Pizza) {  
            const sql = `UPDATE pizza SET nomePizza = ?, preco = ?
                         WHERE codigo = ?`;
            const parametros = [pizza.nomePizza, pizza.preco, pizza.codigo];

            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(pizza) {
        if (pizza instanceof Pizza) {
            const sql = `DELETE FROM pizza WHERE codigo = ?`;
            const parametros = [pizza.codigo];
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
        let listaPizzas = [];
        if (!isNaN(parseInt(termo))) {
        
            const sql = `SELECT p.codigo, p.nomePizza, p.preco
                         FROM pizza p 
                         WHERE p.codigo = ?
                         ORDER BY p.nomePizza`;
            const parametros = [termo];
            const [registros] = await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
            for (const registro of registros) {
                const pizza = new Pizza(registro.codigo, registro.nomePizza, registro.preco);
                listaPizzas.push(pizza);
            }
        } else {
     
            const sql = `SELECT p.codigo, p.nomePizza, p.preco
                         FROM pizza p 
                         WHERE p.nomePizza LIKE ?
                         ORDER BY p.nomePizza`;
            const parametros = ['%' + termo + '%'];
            const [registros] = await conexao.execute(sql, parametros);
            for (const registro of registros) {
                const pizza = new Pizza(registro.codigo, registro.nomePizza, registro.preco);
                listaPizzas.push(pizza);
            }
        }

        return listaPizzas;
    }
}
