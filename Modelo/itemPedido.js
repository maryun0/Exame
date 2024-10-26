export default class ItemPedido {
    #pizza; 
    #quantidade; 
    
    constructor(pizza, quantidade) {
        this.#pizza = pizza;
        this.#quantidade = quantidade;
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

    toJSON() {
        return {
            'pizza': this.#pizza.toJSON(), 
            'quantidade': this.#quantidade
        };
    }
}
