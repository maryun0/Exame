import PedidoDAO from "../Persistencia/pedidoDAO.js";

export default class Pedido {
    #codigo;
    #cliente; 
    #itens; 

    constructor(codigo, cliente, itens) {
        this.#codigo = codigo;
        this.#cliente = cliente; 
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
            'codigo': this.#codigo,
            'cliente': this.#cliente.toJSON(),
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

    async deletar() {
        const pedidoDAO = new PedidoDAO();
        await pedidoDAO.deletar(this);
    }

    async consultar(termoBusca) {
        const pedidoDAO = new PedidoDAO();
        const listaPedidos = await pedidoDAO.consultar(termoBusca);
        return listaPedidos;
    }
}
