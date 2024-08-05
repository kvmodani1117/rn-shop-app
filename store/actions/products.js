import Product from "../../models/product";
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { projectBaseURL } from '../../projectBaseURL';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';


export const fetchProducts = () => {
    return async (dispatch, getState) => {
        // any async code you want!
        const userId = getState().auth.userId;
        try {
            const response = await fetch(`${projectBaseURL}/products.json`);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            // console.log("resData-->", resData);  //returns back data in form of OBJECT.. BUT We're using Arrays in Project..
            const loadedProducts = [];

            for (const key in resData) {
                loadedProducts.push(
                    new Product(
                        key,
                        resData[key].ownerId,
                        resData[key].title,
                        resData[key].imageUrl,
                        resData[key].description,
                        resData[key].price,
                        resData[key].ownerPushToken,
                    )
                );
            }
            dispatch({
                type: SET_PRODUCTS,
                products: loadedProducts,
                userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
            });
        } catch (err) {
            //send to custom analytics server
            throw err;  //ultimately will reach to catch of 'ProductsOverviewScreen'
        }
    };
};


export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(
            `${projectBaseURL}/products/${productId}.json?auth=${token}`,
            {
                method: 'DELETE',
            }
        );

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        dispatch({ type: DELETE_PRODUCT, pid: productId });
    }
};


export const createProduct = (title, imageUrl, description, price) => {
    return async (dispatch, getState) => {
        // any async code you want!

        let pushToken;
        let statusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        if (statusObj.status !== 'granted') {
            statusObj = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        if (statusObj.status !== 'granted') {
            pushToken = null;
        }
        else {
            pushToken = (await Notifications.getExpoPushTokenAsync()).data;
        }
        

        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(
            `${projectBaseURL}/products.json?auth=${token}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ownerId: userId,
                    title,
                    imageUrl,
                    description,
                    price,
                    ownerPushToken: pushToken
                })
            });

        const resData = await response.json();

        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: resData.name,
                ownerId: userId,
                title: title,
                imageUrl: imageUrl,
                description: description,
                price: price,
                pushToken: pushToken
            }
        });
    }
};


export const updateProduct = (id, title, imageUrl, description) => { //price excluded..as we don't want to edit it..

    return async (dispatch, getState) => {
        
        const token = getState().auth.token;
        const response = await fetch(
            `${projectBaseURL}/products/${id}.json?auth=${token}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    imageUrl,
                    description,
                })
            }
        );

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: {
                title,
                imageUrl,
                description
            }
        });
    };
};

