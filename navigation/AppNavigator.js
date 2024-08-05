import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { ShopNavigator, AuthNavigator } from './ShopNavigator';
import StartupScreen from '../screens/StartupScreen';

const AppNavigator = props => {
  const isAuth = useSelector(state => !!state.auth.token);   // !!--> means forcing to give boolean value.. if token present, returns true
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);

  return (
    <NavigationContainer>
      {isAuth && <ShopNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />} 
      {!isAuth && !didTryAutoLogin && <StartupScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;


//understanding-->
// {!isAuth && didTryAutoLogin && <AuthNavigator />}   
    // ==>  if not authenticated as well as  didTryAutoLogin=true, 
    //      matlab wo StartupScreen ke CONDITION 1 ya 2 me jaa kar aaya..
    //      matlab, yaa to AsyncStorage me 'userData' nahi hai..yaa toh token expire ho gaya hai..
    //      toh uss case me phir se Authenticate krna padega user ko...


