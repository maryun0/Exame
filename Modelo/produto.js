import ProdutoDAO from "../Persistencia/produtoDAO.js";

export default class Produto {
    #codigo;
    #nomeProduto;
    #preco;

    constructor(codigo = 0, nomeProduto = "", preco = 0) {
        this.#codigo = codigo;
        this.#nomeProduto = nomeProduto;
        this.#preco = preco;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get nomeProduto() {
        return this.#nomeProduto;
    }

    set nomeProduto(novoNomeProduto) {
        this.#nomeProduto = novoNomeProduto;
    }

    get preco() {
        return this.#preco;
    }

    set preco(novoPreco) {
        this.#preco = novoPreco;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            nomeProduto: this.#nomeProduto,
            preco: this.#preco
        };
    }

    async gravar() {
        const prodDAO = new ProdutoDAO();
        await prodDAO.gravar(this);
    }

    async excluir() {
        const prodDAO = new ProdutoDAO();
        await prodDAO.excluir(this);
    }

    async alterar() {
        const prodDAO = new ProdutoDAO();
        await prodDAO.atualizar(this);
    }

    async consultar(termo) {
        const prodDAO = new ProdutoDAO();
        return await prodDAO.consultar(termo);
    }
}
