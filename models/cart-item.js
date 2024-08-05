class CartItem {
    constructor(productId, quantity, productPrice, productTitle, sum, pushToken){
        this.productId = productId;
        this.quantity = quantity;
        this.productPrice = productPrice;
        this.productTitle = productTitle;
        this.sum = sum;
        this.pushToken = pushToken;
    }
}

export default CartItem;