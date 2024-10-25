import PedidoDAO from "../Persistencia/pedidoDAO.js";

export default class Pedido {
    #codigo;
    #cliente; 
    #data;
    #total;
    #itens; 

    constructor(codigo, cliente, data, total, itens) {
        this.#codigo = codigo;
        this.#cliente = cliente; 
        this.#data = data;
        this.#total = total;
        this.#itens = itens; 
    }

  
    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        if (novoCodigo === "" || typeof novoCodigo !== "number") {
            console.log("Formato de dado inválido");
        } else {
            this.#codigo = novoCodigo;
        }
    }

    // Cliente
    get cliente() {
        return this.#cliente;
    }

    set cliente(novoCliente) {
        this.#cliente = novoCliente; 
    }

    get data() {
        return this.#data;
    }

    set data(novaData) {
        this.#data = novaData;
    }

    get total() {
        return this.#total;
    }

    set total(novoTotal) {
        this.#total = novoTotal;
    }

    get itens() {
        return this.#itens;
    }

    set itens(novosItens) {
        this.#itens = novosItens; 
    }

    toJSON() {
        return {
            'codigo': this.#codigo,
            'cliente': this.#cliente.toJSON(), 
            'data': this.#data,
            'total': this.#total,
            'itens': this.#itens.map(item => item.toJSON()) 
        };
    }

  
    async gravar() {
        const pedidoDAO = new PedidoDAO();
        this.codigo = await pedidoDAO.gravar(this);
    }

    async atualizar() {
        const pedidoDAO = new PedidoDAO();
        await pedidoDAO.alterar(this);
    }

    async apagar() {
        const pedidoDAO = new PedidoDAO();
        await pedidoDAO.deletar(this);
    }

    async consultar(termoBusca) {
        const pedidoDAO = new PedidoDAO();
        const listaPedidos = await pedidoDAO.consultar(termoBusca);
        return listaPedidos;
    }
}
