import AsyncStorage  from '@react-native-async-storage/async-storage';
import { projectBaseURL } from '../../projectBaseURL';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL';
export const SET_USER_INFO = 'SET_USER_INFO';
export const EMPTY_CART_ON_LOGOUT = 'EMPTY_CART_ON_LOGOUT';

let timer;

export const setDidTryAL = () => {
    return { type: SET_DID_TRY_AL };
};

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({ type: AUTHENTICATE, userId: userId, token: token });
    }
}



export const signup = (username, mobile, address, email, password) => { //Modified
    return async (dispatch, getState) => {

        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDbBsEaR-k46Zov6OMOGdLjZ8giE5KQONs',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Please enter all the details correctly or check your network. Else, maybe check after some time.';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exists already!';
            }
            throw new Error(message);
        }

        const resData = await response.json();

        dispatch(
            authenticate(
                resData.localId,
                resData.idToken,
                parseInt(resData.expiresIn) * 1000  //converting secs into miliseconds
            )
        );

        //Modified
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const res = await fetch(
            `${projectBaseURL}/users/${userId}.json?auth=${token}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    mobile: mobile,
                    address: address,
                    email: email
                })
            }
        );
        const resAfterStoringUserData = await res.json();
        // console.log("resAfterStoringUserData---> ", resAfterStoringUserData);
        dispatch({
            type: SET_USER_INFO,
            userData: {
                // userId: resAfterStoringUserData.name,  //Modified-Comment
                username: username,
                mobile: mobile,
                address: address,
                email: email
            }
        });


        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        saveDataToStorage(resData.idToken, resData.localId, expirationDate, username, mobile);

    };
};



export const login = (email, password) => {
    return async (dispatch, getState) => {

        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDbBsEaR-k46Zov6OMOGdLjZ8giE5KQONs',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Please enter correct credentials or check your network.';
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found!';
            }
            else if (errorId === 'INVALID_PASSWORD') {
                message = 'This password is not valid!';
            }
            throw new Error(message);
        }

        const resData = await response.json();

        dispatch(
            authenticate(
                resData.localId,
                resData.idToken,
                parseInt(resData.expiresIn) * 1000
            )
        );

        //Modified
        const userId = getState().auth.userId;
        
        const res = await fetch(
            `${projectBaseURL}/users/${userId}.json`
        );
      
        if(!res.ok){
        }

        const userDataObj = await res.json();
        
        dispatch({
            type: SET_USER_INFO,
            userData: {
                username: userDataObj.username,
                mobile: userDataObj.mobile,
                address: userDataObj.address,
                email: userDataObj.email
            }
        });

        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        const username = getState().auth.username;
        const mobile = getState().auth.mobile;
        saveDataToStorage(resData.idToken, resData.localId, expirationDate, username, mobile);

    };
};



export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
};


const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
}

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    }
};

const saveDataToStorage = (token, userId, expirationDate, username, mobile) => {
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({
            token: token,
            userId: userId,
            expiryDate: expirationDate.toISOString(),
            username: username,
            mobile: mobile
        })
    );
}

