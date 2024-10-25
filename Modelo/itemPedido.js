export default class ItemPedido {
    #pizza; 
    #quantidade; 
    #precoUnitario; 
    
    constructor(pizza, quantidade, precoUnitario) {
        this.#pizza = pizza;
        this.#quantidade = quantidade;
        this.#precoUnitario = precoUnitario;
    }

    // Getters e Setters
    get pizza() {
        return this.#pizza;
    }

    set pizza(novaPizza) {
        this.#pizza = novaPizza;
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
            'pizza': this.#pizza.toJSON(), 
            'quantidade': this.#quantidade,
            'precoUnitario': this.#precoUnitario
        };
    }
}
