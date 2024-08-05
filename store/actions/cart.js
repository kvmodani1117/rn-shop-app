export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const SET_CART_ITEMS = 'SET_CART_ITEMS';

import CartItem from "../../models/cart-item";
import { projectBaseURL } from '../../projectBaseURL';

export const addToCart = product => {
    return async (dispatch, getState) => {  //cartItem -> {quantity, productPrice, productTitle, sum}
        //product ->  { id, ownerId, title, imageUrl, description, price }
        //STORING USER'S CART ITEMS TO DB`
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const cartItemsArray = [];
        const res = await fetch(`${projectBaseURL}/cartitems/${userId}.json`);
        if (!res.ok) {
            throw new Error('Something went wrong!');
        }
        const resData = await res.json();
        // console.log("serverPushToken **>>>>> ", product.pushToken);
        cartItemsArray.push(
            new CartItem(product.id, 1, product.price, product.title, product.price, product.pushToken)
        )
        if (!resData) { //if no items in user's cart
            
            const response = await fetch(
                `${projectBaseURL}/cartitems/${userId}.json?auth=${token}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cartItemsArray
                    })
                });
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
        }
        else { //if user has already some items present in the cart
            const res = await fetch(
                `${projectBaseURL}/cartitems/${userId}.json?auth=${token}`
            );
            if (!res.ok) {
                throw new Error("Problem occured while fetching user's Cart Items Array!");
            }
            const resData = await res.json();
            const cartArray = resData.cartItemsArray;  //[ {} , {}, {} ]
            // console.log("cartArray***** ", cartArray);
            let cartItemsCollectionObj = { ...cartArray };
            let productAlreadyExistsInCart = false;
            let currentCartLength = 0;

            var keys = [];
            for (let key in cartItemsCollectionObj) {
                keys.push(key);
            };
            let keyIndex = Math.max(...keys);
            
            for (let i in cartItemsCollectionObj) {  //for (let i = 0; i < cartArray.length; i++)

                if (cartItemsCollectionObj[i] && cartItemsCollectionObj[i].productId === product.id) { //if same product exists.. update the product quantity.
                    productAlreadyExistsInCart = true;
                    const updatedQuantity = cartItemsCollectionObj[i].quantity + 1;
                    const updatedSum = cartItemsCollectionObj[i].sum + cartItemsCollectionObj[i].productPrice;
                    // const pid = cartItemsCollectionObj[i].productId;
                    // const pPrice = cartItemsCollectionObj[i].productPrice;
                    // const pTitle = cartItemsCollectionObj[i].productTitle;
                    const response = await fetch(
                        `${projectBaseURL}/cartitems/${userId}/cartItemsArray/${i}.json?auth=${token}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                // productId: pid,
                                quantity: updatedQuantity,
                                // productPrice: pPrice,
                                // productTitle: pTitle,
                                sum: updatedSum,
                            })
                        });
                    if (!response.ok) {
                        throw new Error("Something went wrong while updating quantity of item in cart");
                    }
                    const patchResponseData = await response.json();
                    // console.log("PATCH response-> ", patchResponseData);
                }

            }
            if (!productAlreadyExistsInCart) { //if the added product doesn't exists in cart..add it in the cart including the other items..
                // console.log("serverPushToken ####>>>>> ", product.pushToken);
                const newCartItemToAdd = new CartItem(product.id, 1, product.price, product.title, product.price, product.pushToken);
                let productId = newCartItemToAdd.productId;
                let quantity = newCartItemToAdd.quantity;
                let productPrice = newCartItemToAdd.productPrice;
                let productTitle = newCartItemToAdd.productTitle;
                let sum = newCartItemToAdd.sum;
                let pushToken = newCartItemToAdd.pushToken;
                // console.log("-------pushToken------- ", product.pushToken);
                const response = await fetch(
                    `${projectBaseURL}/cartitems/${userId}/cartItemsArray/${keyIndex + 1}.json?auth=${token}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            productId,
                            quantity,
                            productPrice,
                            productTitle,
                            sum,
                            pushToken
                        })
                    }
                );
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                const responseData = await response.json();
                // console.log("MY cartItems response-> ", responseData);

            }

        }

        dispatch({ type: ADD_TO_CART, product: product });

    }
};



export const fetchCartItems = () => {                 //updated considering Object
    return async (dispatch, getState) => {
        // any async code you want!
        const userId = getState().auth.userId;
        const token = getState().auth.token;
        try {
            const response = await fetch(
                `${projectBaseURL}/cartitems/${userId}/cartItemsArray.json?auth=${token}`
            );

            if (!response.ok) {
                throw new Error('Something went wrong while fetching cart items!');
            }

            const resData = await response.json();
            // console.log("fetchCartItems resData-->", resData);  // returns [ {}, {}, {} ]
            const resDataObj = { ...resData };
            // console.log("resDataObj==> ", resDataObj);
            const loadedCartItems = [];
            let totalAmount = 0;
            if (resDataObj) {
                for (let idx in resDataObj) {
                    if (resDataObj[idx]) {
                        totalAmount = totalAmount + resDataObj[idx].sum;
                    }
                }
            }
            
            dispatch({
                type: SET_CART_ITEMS,
                items: resData,
                totalAmount: totalAmount
            });
        } catch (err) {
            //send to custom analytics server
            throw err;
        }
    };
};




export const emptyDbCartItems = () => {
    return async (dispatch, getState) => {
        // any async code you want!
        const userId = getState().auth.userId;
        const token = getState().auth.token;
        try {
            const response = await fetch(
                `${projectBaseURL}/cartitems/${userId}.json?auth=${token}`,
                {
                    method: 'DELETE',
                }
            );
            if (!response.ok) {
                throw new Error('Something went wrong while fetching cart items!');
            }
            const resData = await response.json();
            
        } catch (err) {
            throw err;
        }
    };
};


export const reducingOrRemovingItemFromCartDb = productId => {         //updated considering Object

    return async (dispatch, getState) => {

        //use PATCH for updating quantity.. for quantity > 0
        //else DELETE that item from the array itself i.e Arr[i]  by using ${i}
        const userId = getState().auth.userId;
        const token = getState().auth.token;

        try {
            const response = await fetch(
                `${projectBaseURL}/cartitems/${userId}/cartItemsArray.json?auth=${token}`
            );

            if (!response.ok) {
                throw new Error('Something went wrong while fetching cart items!');
            }
            const resData = await response.json(); //returns [ {}, {}, {} ]
            const resDataObj = { ...resData };

            for (let idx in resDataObj) {
                if (resDataObj[idx] && resDataObj[idx].productId === productId) {
                    if (resDataObj[idx].quantity === 1) {    //delete that item node completely from cartItemsArray
                        // console.log("Got the product at index ", idx);
                        const deleteResponse = await fetch(
                            `${projectBaseURL}/cartitems/${userId}/cartItemsArray/${idx}.json?auth=${token}`,
                            {
                                method: 'DELETE',
                            }
                        );
                    }
                    else if (resDataObj[idx].quantity > 1) {
                        const reducedQuantity = resDataObj[idx].quantity - 1;
                        const reducedSum = resDataObj[idx].sum - resDataObj[idx].productPrice;

                        const response = await fetch(
                            `${projectBaseURL}/cartitems/${userId}/cartItemsArray/${idx}.json?auth=${token}`,
                            {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    quantity: reducedQuantity,
                                    sum: reducedSum
                                })
                            }
                        );
                        if (!response.ok) {
                            throw new Error("Something went wrong while updating quantity of item in cart");
                        }
                        // console.log("REDUCED QUANTITY BY 1");
                    }
                    break;
                }

            }


        } catch (err) {
            throw err;
        }
        // dispatch({ type: REMOVE_FROM_CART, pid: productId });
    };
};


export const removeFromCart = productId => {
    return async (dispatch, getState) => {

        const itemsArray = getState().cart.items;    //[ {}, {}, {}]

        if (itemsArray.length === 1 && itemsArray[0].quantity === 1) {
            dispatch(emptyDbCartItems());  //will delete complete userNode..from DB
        }
        else {  //while removing one-one item from cart..and also, cart is not empty
            dispatch(reducingOrRemovingItemFromCartDb(productId));
        }

        dispatch({ type: REMOVE_FROM_CART, pid: productId });
    }
};

