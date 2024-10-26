
import PedidoDAO from "../Persistencia/pedidoDAO.js";
export default class Pedido {
    #codigo;
    #cliente;
    #itens;

    constructor(cliente, itens = [], codigo = 0) {
        this.#codigo = codigo;
        this.#cliente = cliente;
        this.#itens = itens; 
    }

    // Getters e Setters
    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get cliente() {
        return this.#cliente;
    }

    set cliente(novoCliente) {
        this.#cliente = novoCliente;
    }

    get itens() {
        return this.#itens;
    }

    set itens(novosItens) {
        this.#itens = novosItens;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            cliente: this.#cliente.toJSON(),
            itens: this.#itens.map(item => item.toJSON())
        };
    }

    async gravar() {
        const pedidoDAO = new PedidoDAO();
        await pedidoDAO.gravar(this);
    }

    async excluir() {
        const pedidoDAO = new PedidoDAO();
        await pedidoDAO.excluir(this.codigo);
    }

    async consultar(termo) {
        const pedidoDAO = new PedidoDAO();
        return await pedidoDAO.consultar(termo);
    }
}
