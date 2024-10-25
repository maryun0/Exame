import ClienteDAO from "../Persistencia/clienteDAO.js";

export default class Cliente {

    #codigo;
    #nome;
    #endereco;
    #telefone;


    constructor(codigo = 0, nome = "", endereco = "", telefone = "") {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#endereco = endereco;
        this.#telefone = telefone;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        if (novoNome != "") 
            this.#nome = novoNome;
    }

    get endereco() {
        return this.#endereco;
    }

    set endereco(novoEndereco) {
        this.#endereco = novoEndereco;
    }

    get telefone() {
        return this.#telefone;
    }

    set telefone(novoTelefone) {
        this.#telefone = novoTelefone;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            endereco: this.#endereco,
            telefone: this.#telefone
        };
    }

    async gravar() {
        const clienteDAO = new ClienteDAO();
        await clienteDAO.incluir(this);
    }

    async atualizar() {
        const clienteBD = new ClienteDAO();
        await clienteBD.alterar(this);
    }

    async excluir() {
        const clienteBD = new ClienteDAO();
        await clienteBD.excluir(this);
    }

    async consultar(termo) {
        const clienteBD = new ClienteDAO();
        const clientes = await clienteBD.consultar(termo);
        return clientes;
    }

    async consultarCodigo(codigo) {
        const clienteBD = new ClienteDAO();
        const cliente = await clienteBD.consultarCodigo(codigo);
        return cliente;
    }
}
