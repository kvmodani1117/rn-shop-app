import { ADD_ORDER, SET_ORDERS, UPDATE_ORDER_STATUS } from "../actions/orders";
import Order from "../../models/order";
import { LOGOUT } from "../actions/auth";

const initialState = {
    orders: [],
    orderStatus: 'Pata nhi'
};

export default (state = initialState, action) => {

    switch (action.type) {
        case SET_ORDERS:
            return {
                ...state,
                orders: action.orders,
                orderStatus: action.orderStatus
            }
        case ADD_ORDER:
            const newOrder = new Order(
                action.orderData.id,
                action.orderData.items,   //array of items []
                action.orderData.amount,  //total amount in cart
                action.orderData.date,
                action.orderData.orderStatus
            );
            return {
                ...state,
                orders: state.orders.concat(newOrder)
            };
        case UPDATE_ORDER_STATUS:
            // console.log("Inside UPDATE_ORDER_STATUS");
            return {
                ...state,
                orderStatus: action.orderStatusData.orderStatus
            } 
        case LOGOUT:                      //emptycart
            return initialState;
    }

    return state;
};