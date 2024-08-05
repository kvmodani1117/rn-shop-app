import Product from '../../models/product';
import { CREATE_PRODUCT, DELETE_PRODUCT, UPDATE_PRODUCT, SET_PRODUCTS } from '../actions/products';
import { LOGOUT } from "../actions/auth";

const initialState = {
    availableProducts: [],
    userProducts: []
}

export default (state = initialState, action) => {
    switch (action.type) {

        case SET_PRODUCTS:
            return {
                availableProducts: action.products,
                userProducts: action.userProducts
            };

        case CREATE_PRODUCT:
            const newProduct = new Product(
                action.productData.id,
                action.productData.ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                action.productData.price,
                action.productData.pushToken,
            );
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            }

        case UPDATE_PRODUCT:
            // 1. FOR 'userProducts' ARRAY UPDATION...
            const productIndex = state.userProducts.findIndex(
                prod => prod.id === action.pid
            );
            const updatedProduct = new Product(
                action.pid,
                state.userProducts[productIndex].ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                // action.productData.price,                If incase, you want to make price editable...0 
                state.userProducts[productIndex].price,
                state.userProducts[productIndex].pushToken,
            );
            const updatedUserProducts = [...state.userProducts];
            updatedUserProducts[productIndex] = updatedProduct;

            // 2. FOR 'availableProducts' ARRAY UPDATION...
            const availableProductIndex = state.availableProducts.findIndex(
                prod => prod.id === action.pid
            );
            const updatedAvailableProducts = [...state.availableProducts];
            updatedAvailableProducts[availableProductIndex] = updatedProduct;

            return {
                ...state,
                userProducts: updatedUserProducts,
                availableProducts: updatedAvailableProducts
            }

        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(
                    product => product.id !== action.pid
                ),
                availableProducts: state.availableProducts.filter(
                    product => product.id !== action.pid
                )
            };

        case LOGOUT:                      //re-initializing states, after logout
            return initialState;
    }
    return state;
}