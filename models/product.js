class Product {
    constructor(id, ownerId, title, imageUrl, description, price, ownerPushToken){
        this.id = id;
        this.ownerId = ownerId;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.pushToken = ownerPushToken
    }
}

export default Product;