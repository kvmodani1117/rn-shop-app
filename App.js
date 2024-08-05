import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

import ReduxThunk from 'redux-thunk';

import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import orderReducer from './store/reducers/orders';
import authReducer from './store/reducers/auth';

import AppNavigator from './navigation/AppNavigator';

import OpenSans_Regular from './assets/fonts/OpenSans-Regular.ttf';
import OpenSans_Bold from './assets/fonts/OpenSans-Bold.ttf';
import Nunito_Regular from './assets/fonts/Nunito-Regular.ttf';
import Nunito_SemiBold from './assets/fonts/Nunito-SemiBold.ttf';

import { StatusBar } from 'react-native';
import Colors from './constants/Colors';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {shouldShowAlert: true};
  }
});

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: orderReducer,
  auth: authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = async () => {
  await Font.loadAsync({
    'opensans-regular': OpenSans_Regular,
    'opensans-bold': OpenSans_Bold,
    'nunito-regular': Nunito_Regular,
    'nunito-semi-bold': Nunito_SemiBold,
  });
}

export default function App() {

  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => { setFontLoaded(true) }}
        onError={(err) => console.log(err)}
      />);
  }

  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <AppNavigator />
    </Provider>
  );

}
