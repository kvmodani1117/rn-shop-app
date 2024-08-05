import { LOGIN, SIGNUP, AUTHENTICATE, LOGOUT, SET_DID_TRY_AL, SET_USER_INFO } from "../actions/auth";

const initialState = {

    token: null,
    userId: null,
    didTryAutoLogin: false,
    username: null,          //Modified-Comment
    mobile: null,
    address: null,
    email: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE: 
            return {    
                ...state,                     //Reducer me return krna matlab state set kr dena!!
                token: action.token,
                userId: action.userId,
                didTryAutoLogin: true
            };
        case SET_USER_INFO:   //Modified-Comment
            return {                         //Reducer me return krna matlab state set kr dena!!
                // userId: action.userData.id, 
                ...state,
                username: action.userData.username,
                mobile: action.userData.mobile,
                address: action.userData.address,
                email: action.userData.email
            };
        case SET_DID_TRY_AL: 
            return {
                ...state,
                didTryAutoLogin: true
            }
        case LOGOUT:
            return {
                ...initialState,
                didTryAutoLogin: true  //we didn't really try auto login, jaan kr kiya.. so trying it won't make any sense
            };
        
        default:
            return state;
    }
}

