import PizzaDAO from "../Persistencia/pizzaDAO.js";

export default class Pizza {
    #codigo;
    #nomePizza;
    #preco;

    constructor(codigo = 0, nomePizza = "", preco = 0) {
        this.#codigo = codigo;
        this.#nomePizza = nomePizza;
        this.#preco = preco;
    }


    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get nomePizza() {
        return this.#nomePizza;
    }

    set nomePizza(novoNomePizza) {
        this.#nomePizza = novoNomePizza;
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
            nomePizza: this.#nomePizza,
            preco: this.#preco
        };
    }

    async gravar() {
        const pizzaDAO = new PizzaDAO();
        await pizzaDAO.gravar(this);
    }

    async excluir() {
        const pizzaDAO = new PizzaDAO();
        await pizzaDAO.excluir(this);
    }

    async alterar() {
        const pizzaDAO = new PizzaDAO();
        await pizzaDAO.atualizar(this);
    }

    async consultar(termo) {
        const pizzaDAO = new PizzaDAO();
        return await pizzaDAO.consultar(termo);
    }
}
