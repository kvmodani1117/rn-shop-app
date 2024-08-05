import { shopAdmins } from "../../Admins";
import Order from "../../models/order";
// import * as Notifications from 'expo-notifications';
// import * as Permissions from 'expo-permissions';
import { projectBaseURL } from '../../projectBaseURL';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';
export const UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS';

export const fetchOrders = () => { //to fetch all the past orders of a particular user...
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {

            if (shopAdmins.includes(userId)) {
                const responseAdmin = await fetch(`${projectBaseURL}/orders.json`);
                const resDataAdmin = await responseAdmin.json();  // { {}, {}, {} }
                //#############
                const userdataResponse = await fetch(`${projectBaseURL}/users.json`);
                if (!userdataResponse.ok) {
                    throw new Error('Something went wrong while fetching all users data!');
                }
                const usersdataResObj = await userdataResponse.json();
                //#############
                const ordersArr = [];
                let orderStatus = '';
                for (let key1 in usersdataResObj) {
                    for (let key2 in resDataAdmin) {  // for tracing users key in orders node
                        if (key1 === key2) {
                            let userOrders = resDataAdmin[key2];
                            for (let orderkey in userOrders) {  //for tracing order's keys of particular users
                                orderStatus = userOrders[orderkey].orderStatus;
                                let mappedOrdersToUserObj = new Object({
                                    orderkey: orderkey,  //order key (order id), 
                                    items: userOrders[orderkey].cartItems,  //cartItems
                                    totalAmount: userOrders[orderkey].totalAmount,  //totalAmount
                                    date: userOrders[orderkey].date,  //date of order
                                    username: usersdataResObj[key1].username,  //username
                                    address: usersdataResObj[key1].address,//address
                                    email: usersdataResObj[key1].email,//email
                                    mobile: usersdataResObj[key1].mobile,//mobile
                                    orderStatus: userOrders[orderkey].orderStatus,
                                });
                                // console.log("mappedOrdersToUserObj ==> ",mappedOrdersToUserObj);
                                ordersArr.push(mappedOrdersToUserObj);
                            }
                        }
                    }
                }

                dispatch({ type: SET_ORDERS, orders: ordersArr, orderStatus: orderStatus });
            }
            else {  // IF USER IS NOT ADMIN ( i.e. they are CUSTOMERS )
                const response = await fetch(`${projectBaseURL}/orders/${userId}.json`);

                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                const resData = await response.json();

                // console.log("resData-->", resData);  //returns back data in form of OBJECT.. BUT We're using Arrays in Project..
                const loadedOrders = [];
                let orderStatus = '';
                for (const key in resData) {

                    orderStatus = resData[key].orderStatus;

                    loadedOrders.push(
                        new Order(
                            key,
                            resData[key].cartItems,
                            resData[key].totalAmount,
                            new Date(resData[key].date),
                            resData[key].orderStatus
                            // resData[key].username,          // optional for normal users..
                            // resData[key].mobile,            //no need
                            // resData[key].address,           //can be directly fetched from State..      
                            // resData[key].email          //while login..these are already set in state.
                        )                               //state.auth.username, state.auth.mobile, etc.
                    );
                }
                dispatch({ type: SET_ORDERS, orders: loadedOrders, orderStatus: orderStatus });
            }

        }
        catch (err) {
            throw err;
        }
    };
};



export const addOrder = (cartItems, totalAmount) => {  //userInfo -->{username, mobile, address, email}
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        // const orderStatus = getState().orders.orderStatus;
        console.log("cartItems: ",cartItems);
        // let pushToken;
        // let statusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        // if (statusObj.status !== 'granted') {
        //     statusObj = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        // }
        // if (statusObj.status !== 'granted') {
        //     pushToken = null;
        // }
        // else {
        //     pushToken = (await Notifications.getExpoPushTokenAsync()).data;
        // }


        const date = new Date();
        const response = await fetch(
            `${projectBaseURL}/orders/${userId}.json?auth=${token}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // userInfo,  // {}
                    cartItems,
                    totalAmount,
                    date: date.toISOString(),
                    // ownerPushToken: pushToken,
                    orderStatus: 'pending'
                })
            });

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        const resData = await response.json();

        dispatch({
            type: ADD_ORDER,
            orderData: {
                id: resData.name,
                items: cartItems,
                amount: totalAmount,
                date: date,
                orderStatus: 'pending'
            }
        });


        //PUSH NOTIFICATIONS
        let tempTokenArr = [];
        for (const cartItem of cartItems) {
            const pushToken = cartItem.productPushToken;
            tempTokenArr.push(pushToken);
            // console.log("pushToken --> ",pushToken);
        }

        let productOwnersTokenArr = Array.from(new Set(tempTokenArr));
        // console.log("productOwnersTokenArr --> ",productOwnersTokenArr);

        for (const pushToken of productOwnersTokenArr) {
            // const pushToken = cartItem.productPushToken;
            // console.log("pushToken --> ",pushToken);
            const resp = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip, deflate',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: pushToken,
                    sounds: ["../../assets/sounds/notification.wav"],
                    title: 'Order was placed!',
                    body: 'Someone placed an order just now..!'
                })
            });
            const respData = await resp.json();
            // console.log("respData => ",respData );
            // if(!resp.ok){
            //     console.log("push error");
            // }
        }

    };
};



export const updateOrderStatus = (orderId, orderStatus) => {
    // console.log("Inside updateOrderStatus : orderId --> ", orderId);
    // console.log("Inside updateOrderStatus : orderStatus --> ", orderStatus);
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        // const userId = getState().auth.userId;

        // console.log("*** Inside updateOrderStatus() ***");

        //Need to get User belonging to a particular order...
        // try {
            const res = await fetch(`${projectBaseURL}/orders.json`);
            const resDataObj = await res.json();  // { {}, {}, {} }

            let foundCustomerId = '';

            // console.log(resDataObj);
            for(let customerId in resDataObj){
                // console.log("customerId : ", customerId );
                for(let orderKey in resDataObj[customerId]){
                    // console.log("orderKey : ", orderKey );
                    if(orderKey === orderId){
                        foundCustomerId = customerId;
                    }
                }
            }
            if(!res.ok){
                throw new Error('Something went wrong, while updating order status!');
            }

        // } catch (error) {
            
        // }

        const response = await fetch( //nkXXhpxXuqN8LacWaB7DYw4vG6w2
            `${projectBaseURL}/orders/${foundCustomerId}/${orderId}.json?auth=${token}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderStatus: orderStatus
                })
            });

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();
        // console.log("resData --> ", resData);
        // fetchOrders();

        dispatch({
            type: UPDATE_ORDER_STATUS,
            orderStatusData: {
                // id: resData.name,
                orderStatus: orderStatus
            }
        });

    };
};







