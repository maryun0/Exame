export default class ItemPedido {
    #produto; 
    #quantidade; 
    #precoUnitario; 
    
    constructor(produto, quantidade, precoUnitario) {
        this.#produto = produto;
        this.#quantidade = quantidade;
        this.#precoUnitario = precoUnitario;
    }

   
    get produto() {
        return this.#produto;
    }

    set produto(novoProduto) {
        this.#produto = novoProduto;
    }

    get quantidade() {
        return this.#quantidade;
    }

    set quantidade(novaQuantidade) {
        this.#quantidade = novaQuantidade;
    }
    
    get precoUnitario() {
        return this.#precoUnitario;
    }

    set precoUnitario(novoPrecoUnitario) {
        this.#precoUnitario = novoPrecoUnitario;
    }

  
    toJSON() {
        return {
            'produto': this.#produto.toJSON(), 
            'quantidade': this.#quantidade,
            'precoUnitario': this.#precoUnitario
        };
    }
}
