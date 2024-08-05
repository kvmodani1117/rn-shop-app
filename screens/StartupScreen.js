import React, { useEffect } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import  AsyncStorage  from "@react-native-async-storage/async-storage";

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

const StartupScreen = props => {
    const dispatch = useDispatch();

    useEffect( () => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');  //setting from store->actions->auth.js
            if (!userData) {                                                  //CONDITION 1
                // props.navigation.navigate('Auth');
                dispatch(authActions.setDidTryAL());   //true 
                return;
            }
            const transformedData = JSON.parse(userData);
            const { token, userId, expiryDate } = transformedData;
            const expirationDate = new Date(expiryDate);

            if (expirationDate <= new Date() || !token || !userId) {          //CONDITION 2
                // props.navigation.navigate('Auth');
                dispatch(authActions.setDidTryAL());   //true
                return;
            }

            const expirationTime = expirationDate.getTime() - new Date().getTime();

            // props.navigation.navigate('Shop');  //if didTryAutoLogin = false--> matlab, token expire nahi hua..
            dispatch(authActions.authenticate(userId, token, expirationTime));
        };

        tryLogin();

        // return () => {
        //     console.log("unsubscribing StartupScreen");
        //     tryLogin;
        // };

    }, [dispatch] );

    return (
        <ActivityIndicator size='large' color={Colors.primary} />
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default StartupScreen;