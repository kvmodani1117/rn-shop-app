import React from 'react';
import { CardStyleInterpolators, createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { Platform, SafeAreaView, Button, View, Text } from 'react-native';

import ProductsOverviewScreen, {
    screenOptions as productsOverviewScreenOptions
} from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import CartScreen from '../screens/shop/CartScreen';
import Colors from '../constants/Colors';
import OrderScreen from '../screens/shop/OrdersScreen';
import { Ionicons } from '@expo/vector-icons';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen, { screenOptions as authScreenOptions } from '../screens/user/AuthScreen';
import * as authActions from '../store/actions/auth';

import { useDispatch, useSelector } from 'react-redux';
import { shopAdmins } from '../Admins';
import ProfileSection from '../components/UI/ProfileSection';
import SearchScreen from '../screens/shop/SearchScreen';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTitleStyle: {
        fontFamily: 'nunito-semi-bold',
        textAlign: 'center',
    },
    headerBackTitleStyle: {
        // fontFamily: 'Nunito_600SemiBold'
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
}


const productsNav = createStackNavigator();
const productsNavigator = props => {
    return (
        <productsNav.Navigator
            screenOptions={{
                ...defaultNavOptions,
                gestureEnabled: true,
                gestureDirection: "horizontal",
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                // ...TransitionPresets.SlideFromRightIOS,
                // transitionSpec: {
                //     open: config,
                //     close: config
                // }
            }}
            headerMode="screen"
        >
            <productsNav.Screen
                name="ProductsOverview" component={ProductsOverviewScreen}
                options={productsOverviewScreenOptions}
            />
            <productsNav.Screen
                name="ProductDetail" component={ProductDetailScreen}
                options={{
                    title: 'Product Detail', headerTitleStyle: {
                        fontFamily: 'nunito-semi-bold',
                        textAlign: 'center',
                        marginRight: 50
                    }
                }}
            />
            <productsNav.Screen
                name="Cart" component={CartScreen}
                options={{
                    title: 'Your Cart', headerTitleStyle: {
                        fontFamily: 'nunito-semi-bold',
                        textAlign: 'center',
                        marginRight: 50
                    }
                }}
            />
            <productsNav.Screen
                name="Search" component={SearchScreen}
                // options={{
                //     title: 'Search', headerTitleStyle: {
                //         fontFamily: 'nunito-semi-bold',
                //         textAlign: 'center',
                //         marginRight: 50
                //     }
                // }}
            />
        </productsNav.Navigator>
    );
}
const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 50,
        mass: 3,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
};


// const productsNavigator = createStackNavigator({
//     ProductsOverview : ProductsOverviewScreen
// }, {
//     defaultNavigationOptions: {
// headerStyle:{
//     backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
// },
// headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
//     }
// });


const ordersNav = createStackNavigator();
const ordersNavigator = props => {
    return (
        <ordersNav.Navigator
            screenOptions={{
                ...defaultNavOptions, headerTitleStyle: {
                    fontFamily: 'nunito-semi-bold',
                    textAlign: 'center',
                    marginRight: 50
                }
            }} >
            <ordersNav.Screen name="Orders" component={OrderScreen} />
        </ordersNav.Navigator>
    );
}

const AdminStackNavigator = createStackNavigator();
const AdminNavigator = props => {
    return (
        <AdminStackNavigator.Navigator screenOptions={defaultNavOptions} >
            <AdminStackNavigator.Screen name="UserProducts" component={UserProductsScreen} />
            <AdminStackNavigator.Screen name="EditProduct" component={EditProductScreen} />
        </AdminStackNavigator.Navigator>
    );
}



const shopNavDrawer = createDrawerNavigator();
export const ShopNavigator = () => {
    const dispatch = useDispatch();
    const isUserAdmin = useSelector(state => state.auth.userId);

    return (
        <shopNavDrawer.Navigator
            edgeWidth={100}
            hideStatusBar={true}
            drawerContent={props => {
                return (
                    <View style={{ flex: 1, paddingTop: 8 }}>
                        <ProfileSection />
                        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>

                            <DrawerItemList {...props} />
                            <Button
                                title="Logout"
                                color={Colors.primary}
                                onPress={() => {
                                    dispatch(authActions.logout());
                                    // props.navigation.navigate('Auth');
                                }}
                            />
                        </SafeAreaView>
                    </View>
                );
            }}
            drawerContentOptions={{
                activeTintColor: Colors.primary
            }}
        >
            <shopNavDrawer.Screen
                name="Products" component={productsNavigator}
                options={{
                    drawerIcon: (drawerConfig) => (
                        <Ionicons
                            name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                            size={23}
                            color={drawerConfig.focused ? Colors.primary : '#888'}
                        />
                    )
                }}
            />
            <shopNavDrawer.Screen
                name="Orders" component={ordersNavigator}
                options={{
                    drawerIcon: (drawerConfig) => (
                        <Ionicons
                            name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                            size={23}
                            color={drawerConfig.focused ? Colors.primary : '#888'}
                        />
                    )
                }}
            />
            {shopAdmins.includes(isUserAdmin) ? <shopNavDrawer.Screen
                name="Admin" component={AdminNavigator}
                options={{
                    drawerIcon: (drawerConfig) => (
                        <Ionicons
                            name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                            size={23}
                            color={drawerConfig.focused ? Colors.primary : '#888'}
                        />
                    )
                }}
            /> : null}
        </shopNavDrawer.Navigator>
    );
}



const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
    return (
        <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
            <AuthStackNavigator.Screen
                name="Auth"
                component={AuthScreen}
                options={authScreenOptions}
            />
        </AuthStackNavigator.Navigator>
    );
};


export default ShopNavigator;
// export default productsNavigator;