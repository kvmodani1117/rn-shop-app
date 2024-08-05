import CartItem from "../../models/cart-item";
import { ADD_TO_CART, SET_CART_ITEMS, REMOVE_FROM_CART } from "../actions/cart";
import { ADD_ORDER } from "../actions/orders";
import { DELETE_PRODUCT } from "../actions/products";
import { LOGOUT } from "../actions/auth";

const initialState = {
    // items: {},
    items: [],
    totalAmount: 0
};

export default (state = initialState, action) => {

    switch (action.type) {

        case SET_CART_ITEMS:
            return {
                ...state,
                items: action.items,
                totalAmount: action.totalAmount
            };
        case ADD_TO_CART:                                                                      // CASE 1 
            const addedProduct = action.product;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;
            const prodId = addedProduct.id;
            const pushToken = addedProduct.pushToken;  //push notification

            let updatedOrNewCartItem;
            // console.log("state.items~~~", state.items);  // [{}, {}]
            let cartItemsArray = state.items;      //[{}, {}]
            let cartItemsCollObj = { ...cartItemsArray };
            let isItemAlreadyPresent = false;
            let index;
            let finalCartArray;
            if (cartItemsCollObj) {
                for (let i in cartItemsCollObj) {
                    if (cartItemsCollObj[i] && cartItemsCollObj[i].productId === prodId) {
                        isItemAlreadyPresent = true;
                        index = i;
                        updatedOrNewCartItem = new CartItem(       //updatedCartItem
                            prodId,
                            cartItemsCollObj[i].quantity + 1,
                            prodPrice,
                            prodTitle,
                            cartItemsCollObj[i].sum + prodPrice,
                            pushToken
                        );
                        finalCartArray = { ...cartItemsCollObj, [index]: updatedOrNewCartItem };
                        break;
                    }
                }
            }
            if (!isItemAlreadyPresent) { //if item already NOT present, then push it in cart array
                updatedOrNewCartItem = new CartItem(prodId, 1, prodPrice, prodTitle, prodPrice, pushToken);

                let objectLength = Object.keys(cartItemsCollObj).length;

                if (objectLength === 0) {
                    finalCartArray = { ...cartItemsCollObj, [0]: updatedOrNewCartItem };
                }
                else {
                    var keys = [];
                    for (let key in cartItemsCollObj) {
                        keys.push(key);
                    };
                    let keyIndex = Math.max(...keys);
                    finalCartArray = { ...cartItemsCollObj, [keyIndex + 1]: updatedOrNewCartItem }
                  
                }

            }
           
            return {
                ...state,
                items: finalCartArray,
                totalAmount: state.totalAmount + prodPrice
            };

        case REMOVE_FROM_CART:                                       // CASE 2
            const cartArray = state.items;
            // console.log("cartArray Items: ", cartArray);  //[ {Obj}, {Obj}, {Obj} ]
            let cartItemsCollectionObj = { ...cartArray };
            let selectedCartItem;
            let idx;
            for (let i in cartItemsCollectionObj) {
                if (cartItemsCollectionObj[i] && cartItemsCollectionObj[i].productId === action.pid) {
                    idx = i;
                    selectedCartItem = cartItemsCollectionObj[i];
                    break;
                }
            }
            
            let currentQty;
            if (selectedCartItem) {
                currentQty = selectedCartItem.quantity;
            }
            let updatedCartItems;
            if (selectedCartItem && currentQty && currentQty > 1) {
                //need to reduce it, not erase it
                const updatedCartItem = new CartItem(
                    selectedCartItem.productId,
                    selectedCartItem.quantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice,
                    selectedCartItem.pushToken, 
                );

                updatedCartItems = { ...cartItemsCollectionObj, [idx]: updatedCartItem };
            }
            else {
                updatedCartItems = { ...cartItemsCollectionObj }
                delete updatedCartItems[idx];
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            }

        case ADD_ORDER:
            return initialState;

        case DELETE_PRODUCT:  //FOR DELETING ADMIN CREATED PRODUCTS..
            let productsArray = state.items; //[{},{},{}]
            // console.log("DELETE_PRODUCT   productsArray   --> ", productsArray);
            let productsCollectionObj = { ...productsArray };
            let particularItem;
            let pIdx;
            if (productsCollectionObj) {
                for (let i in productsCollectionObj) {
                    if (productsCollectionObj[i].productId === action.pid) {
                        particularItem = productsCollectionObj[i];
                        pIdx = i;
                    }
                }
            }
            
            if (!particularItem) {
                return state;
            }

            const updatedItems = {...state.items};
            const itemTotal = particularItem.sum;
            delete updatedItems[action.pid];
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }

        case LOGOUT:                      //emptycart
            return initialState;
    }
    return state;
}